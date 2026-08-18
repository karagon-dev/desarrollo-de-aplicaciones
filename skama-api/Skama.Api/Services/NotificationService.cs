using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        INotificationRepository notificationRepository,
        IEmailSender emailSender,
        ILogger<NotificationService> logger)
    {
        _notificationRepository = notificationRepository;
        _emailSender = emailSender;
        _logger = logger;
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

    public Task<bool> NotifyOrderConfirmationAsync(OrderDetailDto order, string recipientEmail)
    {
        var (subject, htmlBody) = EmailTemplateBuilder.BuildOrderConfirmation(order);
        return EnqueueAndSendAsync(
            order.UserId,
            order.Id,
            EmailNotificationType.OrderConfirmation,
            recipientEmail,
            subject,
            htmlBody);
    }

    public Task<bool> NotifyOrderStatusUpdateAsync(OrderDetailDto order, string recipientEmail)
    {
        var (subject, htmlBody) = EmailTemplateBuilder.BuildOrderStatusUpdate(order);
        return EnqueueAndSendAsync(
            order.UserId,
            order.Id,
            EmailNotificationType.OrderStatusUpdate,
            recipientEmail,
            subject,
            htmlBody);
    }

    public Task<bool> NotifyPasswordResetAsync(Guid userId, string recipientEmail, string resetUrl)
    {
        var (subject, htmlBody) = EmailTemplateBuilder.BuildPasswordReset(resetUrl);
        return EnqueueAndSendAsync(
            userId,
            null,
            EmailNotificationType.PasswordReset,
            recipientEmail,
            subject,
            htmlBody);
    }

    private async Task<bool> EnqueueAndSendAsync(
        Guid userId,
        Guid? orderId,
        string type,
        string recipientEmail,
        string subject,
        string htmlBody)
    {
        Guid notificationId = Guid.Empty;

        try
        {
            var (newId, resultCode) = await _notificationRepository.InsertAsync(new EmailNotification
            {
                UserId = userId,
                OrderId = orderId,
                Type = type,
                RecipientEmail = recipientEmail,
                Subject = subject
            });

            notificationId = newId;

            if (resultCode != 0)
            {
                _logger.LogWarning(
                    "No se pudo registrar la notificación {Type} para {Recipient}. Código {ResultCode}. Se intentará enviar el correo de todas formas.",
                    type,
                    recipientEmail,
                    resultCode);
            }
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "No se pudo registrar la notificación {Type} para {Recipient}. Se intentará enviar el correo de todas formas.",
                type,
                recipientEmail);
        }

        if (!_emailSender.IsConfigured)
        {
            _logger.LogWarning(
                "SMTP no configurado. La notificación {NotificationId} ({Type}) para {Recipient} no se envió.",
                notificationId,
                type,
                recipientEmail);
            return false;
        }

        try
        {
            await _emailSender.SendAsync(recipientEmail, subject, htmlBody);

            if (notificationId != Guid.Empty)
                await _notificationRepository.MarkAsSentAsync(notificationId);

            return true;
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Error al enviar la notificación {NotificationId} ({Type}) a {Recipient}.",
                notificationId,
                type,
                recipientEmail);

            if (notificationId != Guid.Empty)
                await _notificationRepository.MarkAsFailedAsync(notificationId);

            return false;
        }
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
