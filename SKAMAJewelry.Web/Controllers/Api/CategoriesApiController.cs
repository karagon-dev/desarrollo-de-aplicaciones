using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/categories")]
public sealed class CategoriesApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet]
    public IActionResult GetCategories([FromQuery] bool includeInactive = false)
    {
        lock (store.SyncRoot)
        {
            var categories = store.Categories
                .Where(category => includeInactive || category.IsActive)
                .Select(store.ToCategoryDto)
                .ToArray();

            return Ok(categories);
        }
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetCategory(Guid id)
    {
        lock (store.SyncRoot)
        {
            var category = store.Categories.FirstOrDefault(item => item.Id == id);
            return category is null ? NotFound() : Ok(store.ToCategoryDto(category));
        }
    }

    [HttpPost]
    public IActionResult CreateCategory(CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Problem(title: "Validación inválida", detail: "El nombre es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var category = new CategoryRecord
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Description = request.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            store.Categories.Add(category);
            return Created($"/api/categories/{category.Id}", new CategoryIdResponse(category.Id));
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateCategory(Guid id, UpdateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Problem(title: "Validación inválida", detail: "El nombre es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var category = store.Categories.FirstOrDefault(item => item.Id == id);
            if (category is null)
            {
                return NotFound();
            }

            category.Name = request.Name.Trim();
            category.Description = request.Description;
            category.IsActive = request.IsActive;
            category.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteCategory(Guid id)
    {
        lock (store.SyncRoot)
        {
            var category = store.Categories.FirstOrDefault(item => item.Id == id);
            if (category is null)
            {
                return NotFound();
            }

            category.IsActive = false;
            category.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }
}
