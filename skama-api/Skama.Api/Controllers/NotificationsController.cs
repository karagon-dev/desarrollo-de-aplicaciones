using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("pending")]
    [ProducesResponseType(typeof(IEnumerable<EmailNotificationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmailNotificationDto>>> GetPending()
    {
        var notifications = await _notificationService.GetPendingAsync();
        return Ok(notifications);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> Create([FromBody] CreateEmailNotificationRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (notificationId, success, _, error) = await _notificationService.CreateAsync(request);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Could not create email notification",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetPending), new { notificationId }, new { id = notificationId });
    }

    [HttpPatch("{id:guid}/sent")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsSent(Guid id)
    {
        var (success, error) = await _notificationService.MarkAsSentAsync(id);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Email notification not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }

    [HttpPatch("{id:guid}/failed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsFailed(Guid id)
    {
        var (success, error) = await _notificationService.MarkAsFailedAsync(id);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Email notification not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }
}
