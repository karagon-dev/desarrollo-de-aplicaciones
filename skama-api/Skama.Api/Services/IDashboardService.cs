using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IDashboardService
{
    Task<(DashboardSummaryDto? Data, bool Success, string? Error)> GetSummaryAsync(
        DateOnly startDate, DateOnly endDate);
}
