using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IReportRepository
{
    Task<IEnumerable<SalesByPeriodReport>> GetSalesByPeriodAsync(DateOnly startDate, DateOnly endDate);
    Task<IEnumerable<SalesByProductReport>> GetSalesByProductAsync(DateOnly startDate, DateOnly endDate);
    Task<IEnumerable<TopProductReport>> GetTopProductsAsync(DateOnly startDate, DateOnly endDate, int top);
}
