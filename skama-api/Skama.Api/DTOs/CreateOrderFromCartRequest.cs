using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class CreateOrderFromCartRequest
{
    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ShippingAddress { get; set; } = string.Empty;
}
