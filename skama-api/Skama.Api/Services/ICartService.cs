using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface ICartService
{
    Task<Guid> GetOrCreateActiveAsync(Guid userId);
    Task<CartDto?> GetActiveByUserIdAsync(Guid userId);
    Task<CartDetailDto?> GetDetailAsync(Guid cartId);
    Task<(Guid CartItemId, bool Success, int ResultCode, string? Error)> AddItemAsync(Guid cartId, AddCartItemRequest request);
    Task<(bool Success, int ResultCode, string? Error)> UpdateItemQuantityAsync(Guid cartItemId, UpdateCartItemQuantityRequest request);
    Task<(bool Success, int ResultCode, string? Error)> RemoveItemAsync(Guid cartItemId);
}