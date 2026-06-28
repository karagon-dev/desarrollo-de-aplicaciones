namespace Skama.Api.Models
{
    public class Cart : AuditableModelBase
    {
        public Guid UserId { get; set; }
        public string Status { get; set; } = "ACTIVE";
    }
}
