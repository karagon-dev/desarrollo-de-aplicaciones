using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;

    public InventoryService(IInventoryRepository inventoryRepository)
    {
        _inventoryRepository = inventoryRepository;
    }

    public async Task<(Guid MovementId, bool Success, int ResultCode, string? Error)> CreateMovementAsync(
        CreateInventoryMovementRequest request)
    {
        var movement = new InventoryMovement
        {
            ProductId = request.ProductId,
            MovementType = request.MovementType,
            Quantity = request.Quantity,
            ReferenceOrderId = request.ReferenceOrderId
        };

        var (newId, resultCode) = await _inventoryRepository.InsertMovementAsync(movement);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            2 => (Guid.Empty, false, resultCode, "El tipo de movimiento o la cantidad no son válidos."),
            20 => (Guid.Empty, false, resultCode, "No se encontró el producto."),
            22 => (Guid.Empty, false, resultCode, "No hay stock suficiente para completar el movimiento."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al registrar el movimiento.")
        };
    }

    public async Task<IEnumerable<InventoryMovementDto>> GetMovementsByProductIdAsync(Guid productId)
    {
        var movements = await _inventoryRepository.GetMovementsByProductIdAsync(productId);
        return movements.Select(MapToDto);
    }

    public async Task<IEnumerable<LowStockProductDto>> GetLowStockAsync()
    {
        var products = await _inventoryRepository.GetLowStockAsync();
        return products.Select(MapToLowStockDto);
    }

    private static InventoryMovementDto MapToDto(InventoryMovement movement) => new()
    {
        Id = movement.Id,
        ProductId = movement.ProductId,
        MovementType = movement.MovementType,
        Quantity = movement.Quantity,
        PreviousStock = movement.PreviousStock,
        NewStock = movement.NewStock,
        ReferenceOrderId = movement.ReferenceOrderId,
        CreatedAt = movement.CreatedAt
    };

    private static LowStockProductDto MapToLowStockDto(LowStockProduct product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        StockQuantity = product.StockQuantity,
        MinimumStock = product.MinimumStock,
        IsActive = product.IsActive
    };
}
