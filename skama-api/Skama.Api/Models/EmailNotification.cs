namespace Skama.Api.Models
{
    public class EmailNotification : CreatedAtModelBase
    {
        public Guid UserId { get; set; }
        public Guid? OrderId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string RecipientEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = "PENDING";
        public DateTime? SentAt { get; set; }
    }
}
