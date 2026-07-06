using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;

    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<(IEnumerable<SalesByPeriodReportDto> Data, bool Success, string? Error)> GetSalesByPeriodAsync(
        DateOnly startDate, DateOnly endDate)
    {
        var validationError = ValidateDateRange(startDate, endDate);
        if (validationError is not null)
            return (Enumerable.Empty<SalesByPeriodReportDto>(), false, validationError);

        var reports = await _reportRepository.GetSalesByPeriodAsync(startDate, endDate);
        return (reports.Select(MapToDto), true, null);
    }

    public async Task<(IEnumerable<SalesByProductReportDto> Data, bool Success, string? Error)> GetSalesByProductAsync(
        DateOnly startDate, DateOnly endDate)
    {
        var validationError = ValidateDateRange(startDate, endDate);
        if (validationError is not null)
            return (Enumerable.Empty<SalesByProductReportDto>(), false, validationError);

        var reports = await _reportRepository.GetSalesByProductAsync(startDate, endDate);
        return (reports.Select(MapToDto), true, null);
    }

    public async Task<(IEnumerable<TopProductReportDto> Data, bool Success, string? Error)> GetTopProductsAsync(
        DateOnly startDate, DateOnly endDate, int top)
    {
        var validationError = ValidateDateRange(startDate, endDate);
        if (validationError is not null)
            return (Enumerable.Empty<TopProductReportDto>(), false, validationError);

        if (top <= 0)
            return (Enumerable.Empty<TopProductReportDto>(), false, "El parámetro top debe ser mayor a cero.");

        var reports = await _reportRepository.GetTopProductsAsync(startDate, endDate, top);
        return (reports.Select(MapToDto), true, null);
    }

    private static string? ValidateDateRange(DateOnly startDate, DateOnly endDate)
    {
        if (endDate < startDate)
            return "La fecha final no puede ser anterior a la fecha inicial.";

        return null;
    }

    private static SalesByPeriodReportDto MapToDto(SalesByPeriodReport report) => new()
    {
        SaleDate = report.SaleDate,
        OrderCount = report.OrderCount,
        Subtotal = report.Subtotal,
        DiscountTotal = report.DiscountTotal,
        Total = report.Total
    };

    private static SalesByProductReportDto MapToDto(SalesByProductReport report) => new()
    {
        ProductId = report.ProductId,
        ProductName = report.ProductName,
        TotalQuantitySold = report.TotalQuantitySold,
        TotalSales = report.TotalSales
    };

    private static TopProductReportDto MapToDto(TopProductReport report) => new()
    {
        ProductId = report.ProductId,
        ProductName = report.ProductName,
        TotalQuantitySold = report.TotalQuantitySold,
        TotalSales = report.TotalSales
    };
}
