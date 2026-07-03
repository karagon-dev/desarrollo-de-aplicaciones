namespace Skama.Api.DTOs;

public class CartDetailDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<CartItemDetailDto> Items { get; set; } = new();
    public decimal Total { get; set; }
}
