namespace Skama.Api.Models;

public class TopProductReport
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int TotalQuantitySold { get; set; }
    public decimal TotalSales { get; set; }
}
