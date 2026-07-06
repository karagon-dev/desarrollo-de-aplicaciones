using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(DashboardSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
    {
        var (data, success, error) = await _dashboardService.GetSummaryAsync(startDate, endDate);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid dashboard parameters",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return Ok(data);
    }
}
