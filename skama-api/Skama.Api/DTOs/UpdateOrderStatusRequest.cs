using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpdateOrderStatusRequest
{
    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = string.Empty;
}
