using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IInventoryService
{
    Task<(Guid MovementId, bool Success, int ResultCode, string? Error)> CreateMovementAsync(
        CreateInventoryMovementRequest request);
    Task<IEnumerable<InventoryMovementDto>> GetMovementsByProductIdAsync(Guid productId);
    Task<IEnumerable<LowStockProductDto>> GetLowStockAsync();
}
