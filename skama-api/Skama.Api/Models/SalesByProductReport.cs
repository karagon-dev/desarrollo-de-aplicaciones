namespace Skama.Api.Models;

public class SalesByProductReport
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string BuyerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public int TotalQuantitySold { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSales { get; set; }
}
