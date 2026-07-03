using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpdateProductRequest
{
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo.")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo.")]
    public int StockQuantity { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "El stock mínimo no puede ser negativo.")]
    public int MinimumStock { get; set; }

    [Required]
    public bool IsActive { get; set; }
}