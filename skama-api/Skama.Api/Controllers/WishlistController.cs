using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<WishlistItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<WishlistItemDto>>> GetByUserId(Guid userId)
    {
        var items = await _wishlistService.GetByUserIdAsync(userId);
        return Ok(items);
    }

    [HttpPost("user/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<object>> Add(Guid userId, [FromBody] AddWishlistItemRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (wishlistItemId, success, resultCode, error) = await _wishlistService.AddAsync(userId, request);

        if (!success)
        {
            if (resultCode == 3)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Product already in wishlist",
                    Detail = error,
                    Status = StatusCodes.Status409Conflict
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not add product to wishlist",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetByUserId), new { userId }, new { id = wishlistItemId });
    }

    [HttpDelete("user/{userId:guid}/product/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remove(Guid userId, Guid productId)
    {
        var (success, error) = await _wishlistService.RemoveAsync(userId, productId);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Wishlist item not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }

    [HttpPost("user/{userId:guid}/toggle")]
    [ProducesResponseType(typeof(WishlistToggleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<WishlistToggleResponse>> Toggle(Guid userId, [FromBody] AddWishlistItemRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _wishlistService.ToggleAsync(userId, request.ProductId);
        return Ok(result);
    }
}
