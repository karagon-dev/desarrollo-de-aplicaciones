using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardService(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<(DashboardSummaryDto? Data, bool Success, string? Error)> GetSummaryAsync(
        DateOnly startDate, DateOnly endDate)
    {
        if (endDate < startDate)
            return (null, false, "La fecha final no puede ser anterior a la fecha inicial.");

        var summary = await _dashboardRepository.GetSummaryAsync(startDate, endDate);
        return (MapToDto(summary), true, null);
    }

    private static DashboardSummaryDto MapToDto(DashboardSummary summary) => new()
    {
        TotalSales = summary.TotalSales,
        TotalOrders = summary.TotalOrders,
        AverageOrderValue = summary.AverageOrderValue,
        RegisteredCustomers = summary.RegisteredCustomers,
        LowStockProducts = summary.LowStockProducts,
        TopProducts = summary.TopProducts.Select(product => new TopProductReportDto
        {
            ProductId = product.ProductId,
            ProductName = product.ProductName,
            TotalQuantitySold = product.TotalQuantitySold,
            TotalSales = product.TotalSales
        })
    };
}
