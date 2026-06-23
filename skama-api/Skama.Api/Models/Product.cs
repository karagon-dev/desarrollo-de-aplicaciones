namespace Skama.Api.Models
{
    public class Product : ModelBase
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumStock { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
