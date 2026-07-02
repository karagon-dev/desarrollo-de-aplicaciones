using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class UpdateCartItemQuantityRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0.")]
    public int Quantity { get; set; }
}
