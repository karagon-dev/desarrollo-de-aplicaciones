using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IPromotionService
{
    Task<IEnumerable<PromotionDto>> GetActiveAsync();
    Task<(Guid PromotionId, bool Success, int ResultCode, string? Error)> CreateAsync(CreatePromotionRequest request);
    Task<(bool Success, int ResultCode, string? Error)> UpdateAsync(Guid id, UpdatePromotionRequest request);
    Task<(Guid AssignId, bool Success, int ResultCode, string? Error)> AssignProductAsync(Guid promotionId, Guid productId);
    Task<bool> RemoveProductAsync(Guid promotionId, Guid productId);
}