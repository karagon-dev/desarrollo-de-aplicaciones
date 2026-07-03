using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpdatePromotionRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, 100, ErrorMessage = "El descuento debe estar entre 0.01 y 100.")]
    public decimal DiscountPercentage { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [Required]
    public bool IsActive { get; set; }
}