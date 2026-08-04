using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/reviews")]
public sealed class ReviewsApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("product/{productId:guid}")]
    public IActionResult GetProductReviews(Guid productId)
    {
        lock (store.SyncRoot)
        {
            return Ok(store.Reviews
                .Where(review => review.ProductId == productId)
                .OrderByDescending(review => review.CreatedAt)
                .Select(store.ToReviewDto)
                .ToArray());
        }
    }

    [HttpGet("user/{userId:guid}")]
    public IActionResult GetUserReviews(Guid userId)
    {
        lock (store.SyncRoot)
        {
            return Ok(store.Reviews
                .Where(review => review.UserId == userId)
                .OrderByDescending(review => review.CreatedAt)
                .Select(store.ToReviewDto)
                .ToArray());
        }
    }

    [HttpPost]
    public IActionResult Create(CreateReviewRequest request)
    {
        if (request.UserId == Guid.Empty ||
            request.ProductId == Guid.Empty ||
            request.OrderId == Guid.Empty ||
            request.Rating is < 1 or > 5)
        {
            return Problem(title: "Validación inválida", detail: "Usuario, producto, orden y calificación entre 1 y 5 son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != request.UserId) ||
                store.Products.All(product => product.Id != request.ProductId) ||
                store.Orders.All(order => order.Id != request.OrderId))
            {
                return NotFound();
            }

            if (store.Reviews.Any(review => review.UserId == request.UserId && review.ProductId == request.ProductId && review.OrderId == request.OrderId))
            {
                return Problem(title: "Reseña duplicada", detail: "Ya existe una reseña para este producto y orden.", statusCode: StatusCodes.Status409Conflict);
            }

            var review = new ReviewRecord
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ProductId = request.ProductId,
                OrderId = request.OrderId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            store.Reviews.Add(review);
            return Created($"/api/reviews/product/{review.ProductId}", new ReviewIdResponse(review.Id));
        }
    }
}
