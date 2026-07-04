namespace Skama.Api.Models
{
    public class User : AuditableModelBase
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
