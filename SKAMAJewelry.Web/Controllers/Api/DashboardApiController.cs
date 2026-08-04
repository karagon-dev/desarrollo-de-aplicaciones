using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("summary")]
    public IActionResult GetSummary([FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate)
    {
        if (startDate.HasValue && endDate.HasValue && endDate.Value < startDate.Value)
        {
            return Problem(title: "Rango invalido", detail: "endDate no puede ser anterior a startDate.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var orders = FilterOrders(startDate, endDate).Where(order => order.Status != "CANCELLED").ToArray();
            var totalOrders = orders.Length;
            var totalSales = orders.Sum(order => order.Total);
            var topProducts = BuildProductSales(orders.Select(order => order.Id).ToHashSet()).Take(5).ToArray();

            var summary = new DashboardSummaryDto(
                totalSales,
                totalOrders,
                totalOrders == 0 ? 0m : decimal.Round(totalSales / totalOrders, 2),
                store.Users.Count(user => user.RoleName == "Customer"),
                store.Products.Count(product => product.IsActive && product.StockQuantity <= product.MinimumStock),
                topProducts);

            return Ok(summary);
        }
    }

    private IEnumerable<OrderRecord> FilterOrders(DateOnly? startDate, DateOnly? endDate)
    {
        return store.Orders.Where(order =>
        {
            var date = DateOnly.FromDateTime(order.CreatedAt);
            return (!startDate.HasValue || date >= startDate.Value) &&
                   (!endDate.HasValue || date <= endDate.Value);
        });
    }

    private IEnumerable<ProductSalesDto> BuildProductSales(HashSet<Guid> orderIds)
    {
        return store.OrderItems
            .Where(item => orderIds.Contains(item.OrderId))
            .GroupBy(item => new { item.ProductId, item.ProductName })
            .Select(group => new ProductSalesDto(
                group.Key.ProductId,
                group.Key.ProductName,
                group.Sum(item => item.Quantity),
                group.Sum(item => item.LineTotal)))
            .OrderByDescending(item => item.TotalQuantitySold);
    }
}
