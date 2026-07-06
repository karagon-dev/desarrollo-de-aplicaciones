using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface INotificationService
{
    Task<IEnumerable<EmailNotificationDto>> GetPendingAsync();
    Task<(Guid NotificationId, bool Success, int ResultCode, string? Error)> CreateAsync(
        CreateEmailNotificationRequest request);
    Task<(bool Success, string? Error)> MarkAsSentAsync(Guid id);
    Task<(bool Success, string? Error)> MarkAsFailedAsync(Guid id);
}
