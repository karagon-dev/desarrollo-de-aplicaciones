namespace Skama.Api.DTOs;

public class DashboardSummaryDto
{
    public decimal TotalSales { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int RegisteredCustomers { get; set; }
    public int LowStockProducts { get; set; }
    public IEnumerable<TopProductReportDto> TopProducts { get; set; } = [];
}
