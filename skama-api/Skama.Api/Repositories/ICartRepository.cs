using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface ICartRepository
{
    Task<Guid> GetOrCreateActiveAsync(Guid userId);
    Task<Cart?> GetActiveByUserIdAsync(Guid userId);
    Task<CartDetail?> GetDetailAsync(Guid cartId);
    Task<(Guid CartItemId, int ResultCode)> AddItemAsync(Guid cartId, Guid productId, int quantity);
    Task<(int RowsAffected, int ResultCode)> UpdateItemQuantityAsync(Guid cartItemId, int quantity);
    Task<(int RowsAffected, int ResultCode)> RemoveItemAsync(Guid cartItemId);
}