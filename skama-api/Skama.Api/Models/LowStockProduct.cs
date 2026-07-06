namespace Skama.Api.Models;

public class LowStockProduct
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public int MinimumStock { get; set; }
    public bool IsActive { get; set; }
}
