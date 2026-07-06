using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly IConfiguration _configuration;

    public DashboardRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<DashboardSummary> GetSummaryAsync(DateOnly startDate, DateOnly endDate)
    {
        using var connection = CreateConnection();

        using var multi = await connection.QueryMultipleAsync(
            "usp_Dashboard_GetSummary",
            new { StartDate = startDate, EndDate = endDate },
            commandType: CommandType.StoredProcedure);

        var salesMetrics = await multi.ReadSingleOrDefaultAsync<DashboardSalesMetrics>()
            ?? new DashboardSalesMetrics();

        var registeredCustomers = await multi.ReadSingleOrDefaultAsync<DashboardRegisteredCustomersMetric>()
            ?? new DashboardRegisteredCustomersMetric();

        var lowStockProducts = await multi.ReadSingleOrDefaultAsync<DashboardLowStockMetric>()
            ?? new DashboardLowStockMetric();

        var topProducts = (await multi.ReadAsync<TopProductReport>()).ToList();

        return new DashboardSummary
        {
            TotalSales = salesMetrics.TotalSales,
            TotalOrders = salesMetrics.TotalOrders,
            AverageOrderValue = salesMetrics.AverageOrderValue,
            RegisteredCustomers = registeredCustomers.RegisteredCustomers,
            LowStockProducts = lowStockProducts.LowStockProducts,
            TopProducts = topProducts
        };
    }

    private sealed class DashboardSalesMetrics
    {
        public decimal TotalSales { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    private sealed class DashboardRegisteredCustomersMetric
    {
        public int RegisteredCustomers { get; set; }
    }

    private sealed class DashboardLowStockMetric
    {
        public int LowStockProducts { get; set; }
    }
}
