using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/promotions")]
public sealed class PromotionsApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("active")]
    public IActionResult GetActive()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        lock (store.SyncRoot)
        {
            return Ok(store.Promotions
                .Where(promotion => promotion.IsActive && promotion.StartDate <= today && promotion.EndDate >= today)
                .Select(store.ToPromotionDto)
                .ToArray());
        }
    }

    [HttpPost]
    public IActionResult Create(CreatePromotionRequest request)
    {
        if (!IsPromotionValid(request.Name, request.DiscountPercentage, request.StartDate, request.EndDate))
        {
            return Problem(title: "Validación inválida", detail: "Nombre, porcentaje de descuento y rango de fechas válido son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var promotion = new PromotionRecord
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Description = request.Description,
                DiscountPercentage = request.DiscountPercentage,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            store.Promotions.Add(promotion);
            return Created("/api/promotions/active", null);
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, UpdatePromotionRequest request)
    {
        if (!IsPromotionValid(request.Name, request.DiscountPercentage, request.StartDate, request.EndDate))
        {
            return Problem(title: "Validación inválida", detail: "Nombre, porcentaje de descuento y rango de fechas válido son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var promotion = store.Promotions.FirstOrDefault(item => item.Id == id);
            if (promotion is null)
            {
                return NotFound();
            }

            promotion.Name = request.Name.Trim();
            promotion.Description = request.Description;
            promotion.DiscountPercentage = request.DiscountPercentage;
            promotion.StartDate = request.StartDate;
            promotion.EndDate = request.EndDate;
            promotion.IsActive = request.IsActive;
            promotion.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpPost("{promotionId:guid}/products/{productId:guid}")]
    public IActionResult AssignProduct(Guid promotionId, Guid productId)
    {
        lock (store.SyncRoot)
        {
            if (store.Promotions.All(promotion => promotion.Id != promotionId) ||
                store.Products.All(product => product.Id != productId))
            {
                return NotFound();
            }

            if (store.PromotionProducts.Any(item => item.PromotionId == promotionId && item.ProductId == productId))
            {
                return Problem(title: "Producto ya asignado", detail: "El producto ya está asignado a esta promoción.", statusCode: StatusCodes.Status409Conflict);
            }

            store.PromotionProducts.Add(new PromotionProductRecord
            {
                PromotionId = promotionId,
                ProductId = productId
            });

            return Created($"/api/promotions/{promotionId}/products/{productId}", null);
        }
    }

    [HttpDelete("{promotionId:guid}/products/{productId:guid}")]
    public IActionResult UnassignProduct(Guid promotionId, Guid productId)
    {
        lock (store.SyncRoot)
        {
            var assignment = store.PromotionProducts.FirstOrDefault(item => item.PromotionId == promotionId && item.ProductId == productId);
            if (assignment is null)
            {
                return NotFound();
            }

            store.PromotionProducts.Remove(assignment);
            return NoContent();
        }
    }

    private static bool IsPromotionValid(string name, decimal discountPercentage, DateOnly startDate, DateOnly endDate) =>
        !string.IsNullOrWhiteSpace(name) &&
        discountPercentage > 0 &&
        discountPercentage <= 100 &&
        endDate >= startDate;
}
