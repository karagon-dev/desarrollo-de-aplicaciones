using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("from-cart/{cartId:guid}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> CreateFromCart(Guid cartId, [FromBody] CreateOrderFromCartRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (orderId, orderNumber, success, _, error) = await _orderService.CreateFromCartAsync(cartId, request);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Could not create order",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetDetail), new { orderId }, new { orderId, orderNumber });
    }

    [HttpGet("{orderId:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetById(Guid orderId)
    {
        var order = await _orderService.GetByIdAsync(orderId);

        if (order is null)
            return NotFound();

        return Ok(order);
    }

    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetByUserId(Guid userId)
    {
        var orders = await _orderService.GetByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{orderId:guid}/detail")]
    [ProducesResponseType(typeof(OrderDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDetailDto>> GetDetail(Guid orderId)
    {
        var detail = await _orderService.GetDetailAsync(orderId);

        if (detail is null)
            return NotFound();

        return Ok(detail);
    }

    [HttpPatch("{orderId:guid}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, resultCode, error) = await _orderService.UpdateStatusAsync(orderId, request);

        if (!success)
        {
            if (resultCode == 40)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not update order status",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }

    [HttpPost("{orderId:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Cancel(Guid orderId)
    {
        var (success, resultCode, error) = await _orderService.CancelAsync(orderId);

        if (!success)
        {
            if (resultCode == 40)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            if (resultCode == 41)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Order cannot be cancelled",
                    Detail = error,
                    Status = StatusCodes.Status409Conflict
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not cancel order",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }
}
