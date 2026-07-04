namespace Skama.Api.DTOs;

public class LoginResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
