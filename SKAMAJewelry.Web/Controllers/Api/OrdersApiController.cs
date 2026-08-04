using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/orders")]
public sealed class OrdersApiController(SkamaApiDataStore store) : ControllerBase
{
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "PENDING",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    };

    [HttpPost("from-cart/{cartId:guid}")]
    public IActionResult CreateFromCart(Guid cartId, CreateOrderFromCartRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentMethod) || string.IsNullOrWhiteSpace(request.ShippingAddress))
        {
            return Problem(title: "Validación inválida", detail: "Método de pago y dirección de entrega son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var cart = store.Carts.FirstOrDefault(item => item.Id == cartId);
            if (cart is null)
            {
                return NotFound();
            }

            var cartItems = store.CartItems.Where(item => item.CartId == cartId).ToArray();
            if (cartItems.Length == 0)
            {
                return Problem(title: "Carrito vacío", detail: "No se puede crear una orden desde un carrito vacío.", statusCode: StatusCodes.Status400BadRequest);
            }

            foreach (var cartItem in cartItems)
            {
                var product = store.Products.FirstOrDefault(item => item.Id == cartItem.ProductId);
                if (product is null || !product.IsActive || product.StockQuantity < cartItem.Quantity)
                {
                    return Problem(title: "Sin stock", detail: "Uno o más productos no tienen stock suficiente.", statusCode: StatusCodes.Status400BadRequest);
                }
            }

            var order = new OrderRecord
            {
                Id = Guid.NewGuid(),
                UserId = cart.UserId,
                OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{store.Orders.Count + 1:000}",
                Status = "PAID",
                PaymentMethod = request.PaymentMethod,
                ShippingAddress = request.ShippingAddress,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var cartItem in cartItems)
            {
                var product = store.Products.First(item => item.Id == cartItem.ProductId);
                product.StockQuantity -= cartItem.Quantity;
                product.UpdatedAt = DateTime.UtcNow;

                var lineTotal = cartItem.UnitPrice * cartItem.Quantity;
                order.Subtotal += lineTotal;
                store.OrderItems.Add(new OrderItemRecord
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice,
                    DiscountAmount = 0m,
                    LineTotal = lineTotal
                });

                store.InventoryMovements.Add(new InventoryMovementRecord
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    MovementType = "SALE",
                    Quantity = cartItem.Quantity,
                    PreviousStock = product.StockQuantity + cartItem.Quantity,
                    NewStock = product.StockQuantity,
                    ReferenceOrderId = order.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            order.Total = order.Subtotal - order.DiscountTotal;
            cart.Status = "CONVERTED";
            cart.UpdatedAt = DateTime.UtcNow;
            store.Orders.Add(order);

            return Created($"/api/orders/{order.Id}", new CreateOrderResponse(order.Id, order.OrderNumber));
        }
    }

    [HttpGet("{orderId:guid}")]
    public IActionResult GetOrder(Guid orderId)
    {
        lock (store.SyncRoot)
        {
            var order = store.Orders.FirstOrDefault(item => item.Id == orderId);
            return order is null ? NotFound() : Ok(store.ToOrderDto(order));
        }
    }

    [HttpGet("user/{userId:guid}")]
    public IActionResult GetUserOrders(Guid userId)
    {
        lock (store.SyncRoot)
        {
            return Ok(store.Orders
                .Where(order => order.UserId == userId)
                .OrderByDescending(order => order.CreatedAt)
                .Select(store.ToOrderDto)
                .ToArray());
        }
    }

    [HttpGet("{orderId:guid}/detail")]
    public IActionResult GetOrderDetail(Guid orderId)
    {
        lock (store.SyncRoot)
        {
            var order = store.Orders.FirstOrDefault(item => item.Id == orderId);
            return order is null ? NotFound() : Ok(store.ToOrderDetailDto(order));
        }
    }

    [HttpPatch("{orderId:guid}/status")]
    public IActionResult UpdateStatus(Guid orderId, UpdateOrderStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status) || !ValidStatuses.Contains(request.Status))
        {
            return Problem(title: "Estado inválido", detail: "El estado solicitado no es válido.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var order = store.Orders.FirstOrDefault(item => item.Id == orderId);
            if (order is null)
            {
                return NotFound();
            }

            order.Status = request.Status.ToUpperInvariant();
            order.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpPost("{orderId:guid}/cancel")]
    public IActionResult Cancel(Guid orderId)
    {
        lock (store.SyncRoot)
        {
            var order = store.Orders.FirstOrDefault(item => item.Id == orderId);
            if (order is null)
            {
                return NotFound();
            }

            if (order.Status is "SHIPPED" or "DELIVERED")
            {
                return Problem(title: "Orden procesada", detail: "La orden ya no puede cancelarse.", statusCode: StatusCodes.Status409Conflict);
            }

            order.Status = "CANCELLED";
            order.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }
}
