using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<IEnumerable<ReviewDto>> GetByProductIdAsync(Guid productId)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId);
        return reviews.Select(MapToDto);
    }

    public async Task<IEnumerable<ReviewDto>> GetByUserIdAsync(Guid userId)
    {
        var reviews = await _reviewRepository.GetByUserIdAsync(userId);
        return reviews.Select(MapToDto);
    }

    public async Task<(Guid ReviewId, bool Success, int ResultCode, string? Error)> CreateAsync(CreateReviewRequest request)
    {
        var review = new Review
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            OrderId = request.OrderId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        var (newId, resultCode) = await _reviewRepository.InsertAsync(review);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            2 => (Guid.Empty, false, resultCode, "La calificación no es válida o el usuario no ha comprado este producto en una orden completada."),
            3 => (Guid.Empty, false, resultCode, "El usuario ya calificó este producto."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al registrar la reseña.")
        };
    }

    private static ReviewDto MapToDto(Review review) => new()
    {
        Id = review.Id,
        UserId = review.UserId,
        ProductId = review.ProductId,
        OrderId = review.OrderId,
        Rating = review.Rating,
        Comment = review.Comment,
        CreatedAt = review.CreatedAt
    };
}