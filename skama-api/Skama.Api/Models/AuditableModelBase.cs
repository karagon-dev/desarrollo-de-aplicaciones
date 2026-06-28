namespace Skama.Api.Models
{
    public class AuditableModelBase : ModelBase
    {
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
