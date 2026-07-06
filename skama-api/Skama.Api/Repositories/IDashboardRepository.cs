using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IDashboardRepository
{
    Task<DashboardSummary> GetSummaryAsync(DateOnly startDate, DateOnly endDate);
}
