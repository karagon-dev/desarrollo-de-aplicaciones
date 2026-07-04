using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IPromotionRepository
{
    Task<IEnumerable<Promotion>> GetActiveAsync();
    Task<(Guid NewId, int ResultCode)> InsertAsync(Promotion promotion);
    Task<(int RowsAffected, int ResultCode)> UpdateAsync(Promotion promotion);
    Task<(Guid NewId, int ResultCode)> AssignProductAsync(Guid promotionId, Guid productId);
    Task<int> RemoveProductAsync(Guid promotionId, Guid productId);
}