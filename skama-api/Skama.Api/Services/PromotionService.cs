using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;

    public PromotionService(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<IEnumerable<PromotionDto>> GetActiveAsync()
    {
        var promotions = await _promotionRepository.GetActiveAsync();
        return promotions.Select(MapToDto);
    }

    public async Task<(Guid PromotionId, bool Success, int ResultCode, string? Error)> CreateAsync(CreatePromotionRequest request)
    {
        var promotion = new Promotion
        {
            Name = request.Name,
            Description = request.Description,
            DiscountPercentage = request.DiscountPercentage,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        var (newId, resultCode) = await _promotionRepository.InsertAsync(promotion);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            2 => (Guid.Empty, false, resultCode, "El porcentaje de descuento o el rango de fechas no es válido."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al crear la promoción.")
        };
    }

    public async Task<(bool Success, int ResultCode, string? Error)> UpdateAsync(Guid id, UpdatePromotionRequest request)
    {
        var promotion = new Promotion
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            DiscountPercentage = request.DiscountPercentage,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = request.IsActive
        };

        var (rowsAffected, resultCode) = await _promotionRepository.UpdateAsync(promotion);

        return resultCode switch
        {
            0 => (true, resultCode, null),
            1 => (false, resultCode, "No se encontró la promoción indicada."),
            2 => (false, resultCode, "El porcentaje de descuento o el rango de fechas no es válido."),
            _ => (false, resultCode, "Ocurrió un error inesperado al actualizar la promoción.")
        };
    }

    public async Task<(Guid AssignId, bool Success, int ResultCode, string? Error)> AssignProductAsync(Guid promotionId, Guid productId)
    {
        var (newId, resultCode) = await _promotionRepository.AssignProductAsync(promotionId, productId);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            3 => (Guid.Empty, false, resultCode, "El producto ya está asignado a esta promoción."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al asignar el producto.")
        };
    }

    public async Task<bool> RemoveProductAsync(Guid promotionId, Guid productId)
    {
        var rowsAffected = await _promotionRepository.RemoveProductAsync(promotionId, productId);
        return rowsAffected > 0;
    }

    private static PromotionDto MapToDto(Promotion promotion) => new()
    {
        Id = promotion.Id,
        Name = promotion.Name,
        Description = promotion.Description,
        DiscountPercentage = promotion.DiscountPercentage,
        StartDate = promotion.StartDate,
        EndDate = promotion.EndDate,
        IsActive = promotion.IsActive,
        CreatedAt = promotion.CreatedAt,
        UpdatedAt = promotion.UpdatedAt
    };
}