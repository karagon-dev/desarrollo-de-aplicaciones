using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IWishlistService
{
    Task<(Guid WishlistItemId, bool Success, int ResultCode, string? Error)> AddAsync(
        Guid userId, AddWishlistItemRequest request);
    Task<IEnumerable<WishlistItemDto>> GetByUserIdAsync(Guid userId);
    Task<(bool Success, string? Error)> RemoveAsync(Guid userId, Guid productId);
    Task<WishlistToggleResponse> ToggleAsync(Guid userId, Guid productId);
}
