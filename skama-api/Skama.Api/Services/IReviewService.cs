using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetByProductIdAsync(Guid productId);
    Task<IEnumerable<ReviewDto>> GetByUserIdAsync(Guid userId);
    Task<(Guid ReviewId, bool Success, int ResultCode, string? Error)> CreateAsync(CreateReviewRequest request);
}