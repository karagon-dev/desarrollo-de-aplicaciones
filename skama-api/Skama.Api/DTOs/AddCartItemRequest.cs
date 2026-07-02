using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class AddCartItemRequest
{
    [Required]
    public Guid ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0.")]
    public int Quantity { get; set; }
}