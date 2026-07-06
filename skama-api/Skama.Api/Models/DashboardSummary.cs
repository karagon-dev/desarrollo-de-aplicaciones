namespace Skama.Api.Models;

public class DashboardSummary
{
    public decimal TotalSales { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int RegisteredCustomers { get; set; }
    public int LowStockProducts { get; set; }
    public List<TopProductReport> TopProducts { get; set; } = [];
}
