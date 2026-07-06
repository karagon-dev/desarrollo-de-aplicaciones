using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IReportService
{
    Task<(IEnumerable<SalesByPeriodReportDto> Data, bool Success, string? Error)> GetSalesByPeriodAsync(
        DateOnly startDate, DateOnly endDate);
    Task<(IEnumerable<SalesByProductReportDto> Data, bool Success, string? Error)> GetSalesByProductAsync(
        DateOnly startDate, DateOnly endDate);
    Task<(IEnumerable<TopProductReportDto> Data, bool Success, string? Error)> GetTopProductsAsync(
        DateOnly startDate, DateOnly endDate, int top);
}
