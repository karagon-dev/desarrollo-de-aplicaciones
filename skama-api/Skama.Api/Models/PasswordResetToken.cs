namespace Skama.Api.Models
{
    public class PasswordResetToken : CreatedAtModelBase
    {
        public Guid UserId { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime? UsedAt { get; set; }
    }
}
