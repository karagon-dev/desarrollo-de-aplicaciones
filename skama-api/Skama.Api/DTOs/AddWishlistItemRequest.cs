using System.ComponentModel.DataAnnotations;

namespace Skama.Api.DTOs;

public class AddWishlistItemRequest
{
    [Required]
    public Guid ProductId { get; set; }
}
