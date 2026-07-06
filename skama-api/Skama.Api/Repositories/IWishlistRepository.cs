using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IWishlistRepository
{
    Task<(Guid NewId, int ResultCode)> AddAsync(Guid userId, Guid productId);
    Task<IEnumerable<WishlistItemDetail>> GetByUserIdAsync(Guid userId);
    Task<int> RemoveAsync(Guid userId, Guid productId);
    Task<bool> ToggleAsync(Guid userId, Guid productId);
}
