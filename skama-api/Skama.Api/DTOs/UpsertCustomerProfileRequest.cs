using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpsertCustomerProfileRequest
{
    [Required]
    [MaxLength(30)]
    public string IdentificationNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;

    public DateOnly? BirthDate { get; set; }

    [MaxLength(30)]
    public string? Phone { get; set; }
}
