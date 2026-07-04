using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpdateUserStatusRequest
{
    [Required]
    public bool IsActive { get; set; }
}
