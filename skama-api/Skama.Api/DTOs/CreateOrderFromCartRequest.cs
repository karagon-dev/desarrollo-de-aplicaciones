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

    public List<OrderProductRatingRequest> ProductRatings { get; set; } = [];
}

public class OrderProductRatingRequest
{
    [Required]
    public Guid ProductId { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "La calificacion debe estar entre 1 y 5.")]
    public int Rating { get; set; }
}
