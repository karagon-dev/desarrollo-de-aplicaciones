using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/inventory")]
public sealed class InventoryApiController(SkamaApiDataStore store) : ControllerBase
{
    private static readonly HashSet<string> ValidMovementTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "SALE",
        "RETURN",
        "MANUAL_ADJUSTMENT"
    };

    [HttpPost("movements")]
    public IActionResult CreateMovement(InventoryMovementRequest request)
    {
        if (request.ProductId == Guid.Empty || request.Quantity == 0 || !ValidMovementTypes.Contains(request.MovementType))
        {
            return Problem(title: "Validación inválida", detail: "Producto, tipo de movimiento válido y cantidad distinta de cero son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var product = store.Products.FirstOrDefault(item => item.Id == request.ProductId);
            if (product is null)
            {
                return NotFound();
            }

            var previousStock = product.StockQuantity;
            var signedQuantity = string.Equals(request.MovementType, "SALE", StringComparison.OrdinalIgnoreCase)
                ? -Math.Abs(request.Quantity)
                : Math.Abs(request.Quantity);

            var newStock = previousStock + signedQuantity;
            if (newStock < 0)
            {
                return Problem(title: "Stock insuficiente", detail: "El movimiento dejaria stock negativo.", statusCode: StatusCodes.Status400BadRequest);
            }

            product.StockQuantity = newStock;
            product.UpdatedAt = DateTime.UtcNow;

            var movement = new InventoryMovementRecord
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                MovementType = request.MovementType.ToUpperInvariant(),
                Quantity = request.Quantity,
                PreviousStock = previousStock,
                NewStock = newStock,
                ReferenceOrderId = request.ReferenceOrderId,
                CreatedAt = DateTime.UtcNow
            };

            store.InventoryMovements.Add(movement);
            return Created($"/api/inventory/movements/product/{product.Id}", new InventoryMovementIdResponse(movement.Id));
        }
    }

    [HttpGet("movements/product/{productId:guid}")]
    public IActionResult GetProductMovements(Guid productId)
    {
        lock (store.SyncRoot)
        {
            if (store.Products.All(product => product.Id != productId))
            {
                return NotFound();
            }

            return Ok(store.InventoryMovements
                .Where(item => item.ProductId == productId)
                .OrderByDescending(item => item.CreatedAt)
                .Select(store.ToInventoryMovementDto)
                .ToArray());
        }
    }

    [HttpGet("low-stock")]
    public IActionResult GetLowStock()
    {
        lock (store.SyncRoot)
        {
            var products = store.Products
                .Where(product => product.IsActive && product.StockQuantity <= product.MinimumStock)
                .Select(product => new LowStockProductDto(product.Id, product.Name, product.StockQuantity, product.MinimumStock, product.IsActive))
                .ToArray();

            return Ok(products);
        }
    }
}
