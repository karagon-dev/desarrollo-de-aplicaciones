using Skama.Api.DTOs;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Guid> GetOrCreateActiveAsync(Guid userId)
    {
        return await _cartRepository.GetOrCreateActiveAsync(userId);
    }

    public async Task<CartDto?> GetActiveByUserIdAsync(Guid userId)
    {
        var cart = await _cartRepository.GetActiveByUserIdAsync(userId);

        if (cart is null)
            return null;

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Status = cart.Status,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }

    public async Task<CartDetailDto?> GetDetailAsync(Guid cartId)
    {
        var detail = await _cartRepository.GetDetailAsync(cartId);

        if (detail is null)
            return null;

        return new CartDetailDto
        {
            Id = detail.Id,
            UserId = detail.UserId,
            Status = detail.Status,
            CreatedAt = detail.CreatedAt,
            UpdatedAt = detail.UpdatedAt,
            Total = detail.Total,
            Items = detail.Items.Select(item => new CartItemDetailDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.Subtotal,
                StockQuantity = item.StockQuantity,
                IsActive = item.IsActive
            }).ToList()
        };
    }

    public async Task<(Guid CartItemId, bool Success, int ResultCode, string? Error)> AddItemAsync(Guid cartId, AddCartItemRequest request)
    {
        var (cartItemId, resultCode) = await _cartRepository.AddItemAsync(cartId, request.ProductId, request.Quantity);

        return resultCode switch
        {
            0 => (cartItemId, true, resultCode, null),
            2 => (Guid.Empty, false, resultCode, "La cantidad debe ser mayor a 0."),
            20 => (Guid.Empty, false, resultCode, "El producto no existe o no está activo."),
            22 => (Guid.Empty, false, resultCode, "No hay suficiente stock disponible."),
            31 => (Guid.Empty, false, resultCode, "El carrito no existe o no está activo."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al agregar el producto al carrito.")
        };
    }

    public async Task<(bool Success, int ResultCode, string? Error)> UpdateItemQuantityAsync(Guid cartItemId, UpdateCartItemQuantityRequest request)
    {
        var (rowsAffected, resultCode) = await _cartRepository.UpdateItemQuantityAsync(cartItemId, request.Quantity);

        return resultCode switch
        {
            0 => (true, resultCode, null),
            2 => (false, resultCode, "La cantidad debe ser mayor a 0."),
            20 => (false, resultCode, "El producto no existe o no está activo."),
            22 => (false, resultCode, "No hay suficiente stock disponible."),
            30 => (false, resultCode, "No se encontró el item en un carrito activo."),
            _ => (false, resultCode, "Ocurrió un error inesperado al actualizar la cantidad.")
        };
    }

    public async Task<(bool Success, int ResultCode, string? Error)> RemoveItemAsync(Guid cartItemId)
    {
        var (rowsAffected, resultCode) = await _cartRepository.RemoveItemAsync(cartItemId);

        return resultCode switch
        {
            0 => (true, resultCode, null),
            30 => (false, resultCode, "No se encontró el item en un carrito activo."),
            _ => (false, resultCode, "Ocurrió un error inesperado al quitar el producto del carrito.")
        };
    }
}