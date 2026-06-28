namespace Skama.Api.Models
{
    public class CustomerProfile : AuditableModelBase
    {
        public Guid UserId { get; set; }
        public string IdentificationNumber { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateOnly? BirthDate { get; set; }
        public string? Phone { get; set; }
    }
}
