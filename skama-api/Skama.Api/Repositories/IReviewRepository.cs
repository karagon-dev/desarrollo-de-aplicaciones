using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetByProductIdAsync(Guid productId);
    Task<IEnumerable<Review>> GetByUserIdAsync(Guid userId);
    Task<(Guid NewId, int ResultCode)> InsertAsync(Review review);
}