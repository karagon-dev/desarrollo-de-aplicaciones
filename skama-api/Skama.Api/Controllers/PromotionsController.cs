using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PromotionsController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionsController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<PromotionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PromotionDto>>> GetActive()
    {
        var promotions = await _promotionService.GetActiveAsync();
        return Ok(promotions);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> Create([FromBody] CreatePromotionRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (promotionId, success, resultCode, error) = await _promotionService.CreateAsync(request);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Promotion validation failed",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetActive), new { promotionId });
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePromotionRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, resultCode, error) = await _promotionService.UpdateAsync(id, request);

        if (!success)
        {
            if (resultCode == 1)
                return NotFound(new ProblemDetails
                {
                    Title = "Promotion not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });

            return BadRequest(new ProblemDetails
            {
                Title = "Promotion validation failed",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }

    [HttpPost("{promotionId:guid}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<object>> AssignProduct(Guid promotionId, Guid productId)
    {
        var (assignId, success, resultCode, error) = await _promotionService.AssignProductAsync(promotionId, productId);

        if (!success)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Product already assigned",
                Detail = error,
                Status = StatusCodes.Status409Conflict
            });
        }

        return CreatedAtAction(nameof(GetActive), new { assignId });
    }

    [HttpDelete("{promotionId:guid}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveProduct(Guid promotionId, Guid productId)
    {
        var removed = await _promotionService.RemoveProductAsync(promotionId, productId);

        if (!removed)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Assignment not found",
                Detail = "No se encontró la asignación de producto a la promoción.",
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }
}