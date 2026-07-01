using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("product/{productId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByProductId(Guid productId)
    {
        var reviews = await _reviewService.GetByProductIdAsync(productId);
        return Ok(reviews);
    }

    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByUserId(Guid userId)
    {
        var reviews = await _reviewService.GetByUserIdAsync(userId);
        return Ok(reviews);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<object>> Create([FromBody] CreateReviewRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (reviewId, success, resultCode, error) = await _reviewService.CreateAsync(request);

        if (!success)
        {
            if (resultCode == 3)
                return Conflict(new ProblemDetails
                {
                    Title = "Review already exists",
                    Detail = error,
                    Status = StatusCodes.Status409Conflict
                });

            return BadRequest(new ProblemDetails
            {
                Title = "Review validation failed",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetByProductId), new { productId = request.ProductId }, new { reviewId });
    }
}