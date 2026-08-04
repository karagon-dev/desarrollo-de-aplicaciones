using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/cart")]
public sealed class CartApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpPost("user/{userId:guid}")]
    public IActionResult GetOrCreateActiveCart(Guid userId)
    {
        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != userId))
            {
                return NotFound();
            }

            var cart = store.Carts.FirstOrDefault(item => item.UserId == userId && item.Status == "ACTIVE");
            if (cart is null)
            {
                cart = new CartRecord
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Status = "ACTIVE",
                    CreatedAt = DateTime.UtcNow
                };

                store.Carts.Add(cart);
            }

            return Ok(new CartIdResponse(cart.Id));
        }
    }

    [HttpGet("user/{userId:guid}")]
    public IActionResult GetActiveCart(Guid userId)
    {
        lock (store.SyncRoot)
        {
            var cart = store.Carts.FirstOrDefault(item => item.UserId == userId && item.Status == "ACTIVE");
            return cart is null ? NotFound() : Ok(store.ToCartDto(cart));
        }
    }

    [HttpGet("{cartId:guid}")]
    public IActionResult GetCartDetail(Guid cartId)
    {
        lock (store.SyncRoot)
        {
            var cart = store.Carts.FirstOrDefault(item => item.Id == cartId);
            return cart is null ? NotFound() : Ok(store.ToCartDetailDto(cart));
        }
    }

    [HttpPost("{cartId:guid}/items")]
    public IActionResult AddItem(Guid cartId, AddCartItemRequest request)
    {
        if (request.ProductId == Guid.Empty || request.Quantity <= 0)
        {
            return Problem(title: "Validación inválida", detail: "Producto y cantidad mayor a cero son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var cart = store.Carts.FirstOrDefault(item => item.Id == cartId);
            var product = store.Products.FirstOrDefault(item => item.Id == request.ProductId);
            if (cart is null || product is null)
            {
                return NotFound();
            }

            if (!product.IsActive || product.StockQuantity < request.Quantity)
            {
                return Problem(title: "Producto no disponible", detail: "El producto está inactivo o no tiene stock suficiente.", statusCode: StatusCodes.Status400BadRequest);
            }

            var existing = store.CartItems.FirstOrDefault(item => item.CartId == cartId && item.ProductId == request.ProductId);
            if (existing is not null)
            {
                if (product.StockQuantity < existing.Quantity + request.Quantity)
                {
                    return Problem(title: "Stock insuficiente", detail: "No hay stock suficiente para la cantidad solicitada.", statusCode: StatusCodes.Status400BadRequest);
                }

                existing.Quantity += request.Quantity;
                cart.UpdatedAt = DateTime.UtcNow;
                return Created($"/api/cart/items/{existing.Id}", new CartItemIdResponse(existing.Id));
            }

            var cartItem = new CartItemRecord
            {
                Id = Guid.NewGuid(),
                CartId = cartId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                UnitPrice = product.Price,
                CreatedAt = DateTime.UtcNow
            };

            store.CartItems.Add(cartItem);
            cart.UpdatedAt = DateTime.UtcNow;
            return Created($"/api/cart/items/{cartItem.Id}", new CartItemIdResponse(cartItem.Id));
        }
    }

    [HttpPut("items/{cartItemId:guid}")]
    public IActionResult UpdateItem(Guid cartItemId, UpdateCartItemRequest request)
    {
        if (request.Quantity <= 0)
        {
            return Problem(title: "Validación inválida", detail: "La cantidad debe ser mayor a cero.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var item = store.CartItems.FirstOrDefault(item => item.Id == cartItemId);
            if (item is null)
            {
                return NotFound();
            }

            var product = store.Products.FirstOrDefault(product => product.Id == item.ProductId);
            if (product is null || product.StockQuantity < request.Quantity)
            {
                return Problem(title: "Stock insuficiente", detail: "No hay stock suficiente para la cantidad solicitada.", statusCode: StatusCodes.Status400BadRequest);
            }

            item.Quantity = request.Quantity;
            var cart = store.Carts.FirstOrDefault(cart => cart.Id == item.CartId);
            if (cart is not null)
            {
                cart.UpdatedAt = DateTime.UtcNow;
            }

            return NoContent();
        }
    }

    [HttpDelete("items/{cartItemId:guid}")]
    public IActionResult DeleteItem(Guid cartItemId)
    {
        lock (store.SyncRoot)
        {
            var item = store.CartItems.FirstOrDefault(item => item.Id == cartItemId);
            if (item is null)
            {
                return NotFound();
            }

            store.CartItems.Remove(item);
            return NoContent();
        }
    }
}
