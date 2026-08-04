using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/reports")]
public sealed class ReportsApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("sales-by-period")]
    public IActionResult GetSalesByPeriod([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
    {
        if (endDate < startDate)
        {
            return Problem(title: "Rango invalido", detail: "endDate no puede ser anterior a startDate.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var rows = FilterOrders(startDate, endDate)
                .GroupBy(order => DateOnly.FromDateTime(order.CreatedAt))
                .Select(group => new SalesByPeriodDto(
                    group.Key,
                    group.Count(),
                    group.Sum(order => order.Subtotal),
                    group.Sum(order => order.DiscountTotal),
                    group.Sum(order => order.Total)))
                .OrderBy(row => row.SaleDate)
                .ToArray();

            return Ok(rows);
        }
    }

    [HttpGet("sales-by-product")]
    public IActionResult GetSalesByProduct([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
    {
        if (endDate < startDate)
        {
            return Problem(title: "Rango invalido", detail: "endDate no puede ser anterior a startDate.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            return Ok(BuildProductSales(startDate, endDate).ToArray());
        }
    }

    [HttpGet("top-products")]
    public IActionResult GetTopProducts([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate, [FromQuery] int top = 5)
    {
        if (endDate < startDate || top <= 0)
        {
            return Problem(title: "Parametros invalidos", detail: "Rango de fechas valido y top mayor a cero son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            return Ok(BuildProductSales(startDate, endDate).Take(top).ToArray());
        }
    }

    private IEnumerable<OrderRecord> FilterOrders(DateOnly startDate, DateOnly endDate)
    {
        return store.Orders.Where(order =>
        {
            var date = DateOnly.FromDateTime(order.CreatedAt);
            return order.Status != "CANCELLED" && date >= startDate && date <= endDate;
        });
    }

    private IEnumerable<ProductSalesDto> BuildProductSales(DateOnly startDate, DateOnly endDate)
    {
        var orderIds = FilterOrders(startDate, endDate).Select(order => order.Id).ToHashSet();
        return store.OrderItems
            .Where(item => orderIds.Contains(item.OrderId))
            .GroupBy(item => new { item.ProductId, item.ProductName })
            .Select(group => new ProductSalesDto(
                group.Key.ProductId,
                group.Key.ProductName,
                group.Sum(item => item.Quantity),
                group.Sum(item => item.LineTotal)))
            .OrderByDescending(row => row.TotalQuantitySold);
    }
}
