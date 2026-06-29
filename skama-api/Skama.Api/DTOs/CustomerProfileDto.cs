namespace Skama.Api.DTOs;

public class CustomerProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
