namespace Skama.Api.DTOs;

public class SalesByPeriodReportDto
{
    public DateOnly SaleDate { get; set; }
    public int OrderCount { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public decimal Total { get; set; }
}
