using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IInventoryRepository
{
    Task<(Guid NewId, int ResultCode)> InsertMovementAsync(InventoryMovement movement);
    Task<IEnumerable<InventoryMovement>> GetMovementsByProductIdAsync(Guid productId);
    Task<IEnumerable<LowStockProduct>> GetLowStockAsync();
}
