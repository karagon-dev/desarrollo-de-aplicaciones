using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface INotificationRepository
{
    Task<IEnumerable<EmailNotification>> GetPendingAsync();
    Task<(Guid NewId, int ResultCode)> InsertAsync(EmailNotification notification);
    Task<int> MarkAsSentAsync(Guid id);
    Task<int> MarkAsFailedAsync(Guid id);
}
