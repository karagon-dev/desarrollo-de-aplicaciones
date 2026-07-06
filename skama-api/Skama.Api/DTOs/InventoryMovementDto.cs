namespace Skama.Api.DTOs;

public class InventoryMovementDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string MovementType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int PreviousStock { get; set; }
    public int NewStock { get; set; }
    public Guid? ReferenceOrderId { get; set; }
    public DateTime CreatedAt { get; set; }
}
