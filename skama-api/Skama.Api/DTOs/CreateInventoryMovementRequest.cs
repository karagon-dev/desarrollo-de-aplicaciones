using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class CreateInventoryMovementRequest
{
    [Required]
    public Guid ProductId { get; set; }

    [Required]
    [RegularExpression("^(SALE|RETURN|MANUAL_ADJUSTMENT)$", ErrorMessage = "El tipo de movimiento debe ser SALE, RETURN o MANUAL_ADJUSTMENT.")]
    public string MovementType { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero.")]
    public int Quantity { get; set; }

    public Guid? ReferenceOrderId { get; set; }
}
