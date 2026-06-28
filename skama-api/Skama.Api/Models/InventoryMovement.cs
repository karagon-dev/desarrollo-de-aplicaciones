namespace Skama.Api.Models
{
    public class InventoryMovement : CreatedAtModelBase
    {
        public Guid ProductId { get; set; }
        public string MovementType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int PreviousStock { get; set; }
        public int NewStock { get; set; }
        public Guid? ReferenceOrderId { get; set; }
    }
}
