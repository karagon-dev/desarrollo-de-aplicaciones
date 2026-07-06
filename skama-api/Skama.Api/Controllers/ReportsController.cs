using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("sales-by-period")]
    [ProducesResponseType(typeof(IEnumerable<SalesByPeriodReportDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<SalesByPeriodReportDto>>> GetSalesByPeriod(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
    {
        var (data, success, error) = await _reportService.GetSalesByPeriodAsync(startDate, endDate);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid report parameters",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return Ok(data);
    }

    [HttpGet("sales-by-product")]
    [ProducesResponseType(typeof(IEnumerable<SalesByProductReportDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<SalesByProductReportDto>>> GetSalesByProduct(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
    {
        var (data, success, error) = await _reportService.GetSalesByProductAsync(startDate, endDate);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid report parameters",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return Ok(data);
    }

    [HttpGet("top-products")]
    [ProducesResponseType(typeof(IEnumerable<TopProductReportDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<TopProductReportDto>>> GetTopProducts(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        [FromQuery] int top = 5)
    {
        var (data, success, error) = await _reportService.GetTopProductsAsync(startDate, endDate, top);

        if (!success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid report parameters",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return Ok(data);
    }
}
