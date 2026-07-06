using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpPost("movements")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> CreateMovement([FromBody] CreateInventoryMovementRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (movementId, success, resultCode, error) = await _inventoryService.CreateMovementAsync(request);

        if (!success)
        {
            if (resultCode == 20)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not create inventory movement",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(
            nameof(GetMovementsByProductId),
            new { productId = request.ProductId },
            new { id = movementId });
    }

    [HttpGet("movements/product/{productId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<InventoryMovementDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InventoryMovementDto>>> GetMovementsByProductId(Guid productId)
    {
        var movements = await _inventoryService.GetMovementsByProductIdAsync(productId);
        return Ok(movements);
    }

    [HttpGet("low-stock")]
    [ProducesResponseType(typeof(IEnumerable<LowStockProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<LowStockProductDto>>> GetLowStock()
    {
        var products = await _inventoryService.GetLowStockAsync();
        return Ok(products);
    }
}
