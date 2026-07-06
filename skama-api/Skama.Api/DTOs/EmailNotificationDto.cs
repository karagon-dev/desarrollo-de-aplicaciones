namespace Skama.Api.DTOs;

public class EmailNotificationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? OrderId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
