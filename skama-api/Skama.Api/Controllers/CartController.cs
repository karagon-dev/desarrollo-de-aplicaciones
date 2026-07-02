using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("user/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetOrCreateActive(Guid userId)
    {
        var cartId = await _cartService.GetOrCreateActiveAsync(userId);
        return Ok(new { cartId });
    }

    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartDto>> GetActiveByUserId(Guid userId)
    {
        var cart = await _cartService.GetActiveByUserIdAsync(userId);

        if (cart is null)
            return NotFound(new ProblemDetails
            {
                Title = "Active cart not found",
                Detail = $"El usuario {userId} no tiene un carrito activo.",
                Status = StatusCodes.Status404NotFound
            });

        return Ok(cart);
    }

    [HttpGet("{cartId:guid}")]
    [ProducesResponseType(typeof(CartDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartDetailDto>> GetDetail(Guid cartId)
    {
        var detail = await _cartService.GetDetailAsync(cartId);

        if (detail is null)
            return NotFound(new ProblemDetails
            {
                Title = "Cart not found",
                Detail = $"No se encontró el carrito con Id {cartId}.",
                Status = StatusCodes.Status404NotFound
            });

        return Ok(detail);
    }

    [HttpPost("{cartId:guid}/items")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> AddItem(Guid cartId, [FromBody] AddCartItemRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (cartItemId, success, resultCode, error) = await _cartService.AddItemAsync(cartId, request);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Could not add item to cart",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetDetail), new { cartId }, new { cartItemId });
    }

    [HttpPut("items/{cartItemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateItemQuantity(Guid cartItemId, [FromBody] UpdateCartItemQuantityRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, resultCode, error) = await _cartService.UpdateItemQuantityAsync(cartItemId, request);

        if (!success)
        {
            if (resultCode == 30)
                return NotFound(new ProblemDetails
                {
                    Title = "Cart item not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });

            return BadRequest(new ProblemDetails
            {
                Title = "Could not update item quantity",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }

    [HttpDelete("items/{cartItemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(Guid cartItemId)
    {
        var (success, resultCode, error) = await _cartService.RemoveItemAsync(cartItemId);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Cart item not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }
}