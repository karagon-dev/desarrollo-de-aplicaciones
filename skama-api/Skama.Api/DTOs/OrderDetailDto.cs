namespace Skama.Api.DTOs;

public class OrderDetailDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
