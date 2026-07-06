using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<IEnumerable<EmailNotificationDto>> GetPendingAsync()
    {
        var notifications = await _notificationRepository.GetPendingAsync();
        return notifications.Select(MapToDto);
    }

    public async Task<(Guid NotificationId, bool Success, int ResultCode, string? Error)> CreateAsync(
        CreateEmailNotificationRequest request)
    {
        var notification = new EmailNotification
        {
            UserId = request.UserId,
            OrderId = request.OrderId,
            Type = request.Type,
            RecipientEmail = request.RecipientEmail,
            Subject = request.Subject
        };

        var (newId, resultCode) = await _notificationRepository.InsertAsync(notification);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            2 => (Guid.Empty, false, resultCode, "El tipo de notificación no es válido."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado al registrar la notificación.")
        };
    }

    public async Task<(bool Success, string? Error)> MarkAsSentAsync(Guid id)
    {
        var rowsAffected = await _notificationRepository.MarkAsSentAsync(id);

        return rowsAffected > 0
            ? (true, null)
            : (false, "No se encontró la notificación de correo.");
    }

    public async Task<(bool Success, string? Error)> MarkAsFailedAsync(Guid id)
    {
        var rowsAffected = await _notificationRepository.MarkAsFailedAsync(id);

        return rowsAffected > 0
            ? (true, null)
            : (false, "No se encontró la notificación de correo.");
    }

    private static EmailNotificationDto MapToDto(EmailNotification notification) => new()
    {
        Id = notification.Id,
        UserId = notification.UserId,
        OrderId = notification.OrderId,
        Type = notification.Type,
        RecipientEmail = notification.RecipientEmail,
        Subject = notification.Subject,
        Status = notification.Status,
        SentAt = notification.SentAt,
        CreatedAt = notification.CreatedAt
    };
}
