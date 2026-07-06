using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class WishlistService : IWishlistService
{
    private readonly IWishlistRepository _wishlistRepository;

    public WishlistService(IWishlistRepository wishlistRepository)
    {
        _wishlistRepository = wishlistRepository;
    }

    public async Task<(Guid WishlistItemId, bool Success, int ResultCode, string? Error)> AddAsync(
        Guid userId, AddWishlistItemRequest request)
    {
        var (newId, resultCode) = await _wishlistRepository.AddAsync(userId, request.ProductId);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            3 => (Guid.Empty, false, resultCode, "El producto ya está en la lista de favoritos."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al agregar el favorito.")
        };
    }

    public async Task<IEnumerable<WishlistItemDto>> GetByUserIdAsync(Guid userId)
    {
        var items = await _wishlistRepository.GetByUserIdAsync(userId);
        return items.Select(MapToDto);
    }

    public async Task<(bool Success, string? Error)> RemoveAsync(Guid userId, Guid productId)
    {
        var rowsAffected = await _wishlistRepository.RemoveAsync(userId, productId);

        return rowsAffected > 0
            ? (true, null)
            : (false, "El producto no se encontró en la lista de favoritos.");
    }

    public async Task<WishlistToggleResponse> ToggleAsync(Guid userId, Guid productId)
    {
        var isFavorite = await _wishlistRepository.ToggleAsync(userId, productId);
        return new WishlistToggleResponse { IsFavorite = isFavorite };
    }

    private static WishlistItemDto MapToDto(WishlistItemDetail item) => new()
    {
        Id = item.Id,
        UserId = item.UserId,
        ProductId = item.ProductId,
        ProductName = item.ProductName,
        Price = item.Price,
        StockQuantity = item.StockQuantity,
        IsActive = item.IsActive,
        CreatedAt = item.CreatedAt
    };
}
