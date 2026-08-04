using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/notifications")]
public sealed class NotificationsApiController(SkamaApiDataStore store) : ControllerBase
{
    private static readonly HashSet<string> ValidTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "ORDER_CONFIRMATION",
        "ORDER_STATUS_UPDATE",
        "PASSWORD_RESET"
    };

    [HttpGet("pending")]
    public IActionResult GetPending()
    {
        lock (store.SyncRoot)
        {
            return Ok(store.Notifications
                .Where(notification => notification.Status == "PENDING")
                .OrderBy(notification => notification.CreatedAt)
                .Select(store.ToNotificationDto)
                .ToArray());
        }
    }

    [HttpPost]
    public IActionResult Create(CreateNotificationRequest request)
    {
        if (request.UserId == Guid.Empty ||
            string.IsNullOrWhiteSpace(request.RecipientEmail) ||
            string.IsNullOrWhiteSpace(request.Subject) ||
            !ValidTypes.Contains(request.Type))
        {
            return Problem(title: "Tipo invalido", detail: "Usuario, correo destinatario, asunto y tipo valido son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != request.UserId))
            {
                return NotFound();
            }

            var notification = new NotificationRecord
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                OrderId = request.OrderId,
                Type = request.Type.ToUpperInvariant(),
                RecipientEmail = request.RecipientEmail,
                Subject = request.Subject,
                Status = "PENDING",
                CreatedAt = DateTime.UtcNow
            };

            store.Notifications.Add(notification);
            return Created($"/api/notifications/{notification.Id}", new NotificationIdResponse(notification.Id));
        }
    }

    [HttpPatch("{id:guid}/sent")]
    public IActionResult MarkSent(Guid id)
    {
        lock (store.SyncRoot)
        {
            var notification = store.Notifications.FirstOrDefault(item => item.Id == id);
            if (notification is null)
            {
                return NotFound();
            }

            notification.Status = "SENT";
            notification.SentAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpPatch("{id:guid}/failed")]
    public IActionResult MarkFailed(Guid id)
    {
        lock (store.SyncRoot)
        {
            var notification = store.Notifications.FirstOrDefault(item => item.Id == id);
            if (notification is null)
            {
                return NotFound();
            }

            notification.Status = "FAILED";
            notification.SentAt = null;
            return NoContent();
        }
    }
}
