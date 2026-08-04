using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/products")]
public sealed class ProductsApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet]
    public IActionResult GetProducts([FromQuery] string? search, [FromQuery] Guid? categoryId, [FromQuery] bool includeInactive = false)
    {
        lock (store.SyncRoot)
        {
            var products = store.Products.AsEnumerable();

            if (!includeInactive)
            {
                products = products.Where(product => product.IsActive);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                products = products.Where(product => product.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            if (categoryId.HasValue)
            {
                products = products.Where(product => product.CategoryId == categoryId.Value);
            }

            return Ok(products.Select(store.ToProductDto).ToArray());
        }
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetProduct(Guid id)
    {
        lock (store.SyncRoot)
        {
            var product = store.Products.FirstOrDefault(item => item.Id == id);
            return product is null ? NotFound() : Ok(store.ToProductDto(product));
        }
    }

    [HttpPost]
    public IActionResult CreateProduct(CreateProductRequest request)
    {
        if (!IsProductRequestValid(request.CategoryId, request.Name, request.Price, request.StockQuantity, request.MinimumStock))
        {
            return Problem(title: "Validación inválida", detail: "Categoría, nombre, precio, inventario y mínimo de inventario son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Categories.All(category => category.Id != request.CategoryId))
            {
                return NotFound();
            }

            var product = new ProductRecord
            {
                Id = Guid.NewGuid(),
                CategoryId = request.CategoryId,
                Name = request.Name.Trim(),
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                MinimumStock = request.MinimumStock,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            store.Products.Add(product);
            return Created($"/api/products/{product.Id}", new ProductIdResponse(product.Id));
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateProduct(Guid id, UpdateProductRequest request)
    {
        if (!IsProductRequestValid(request.CategoryId, request.Name, request.Price, request.StockQuantity, request.MinimumStock))
        {
            return Problem(title: "Validación inválida", detail: "Categoría, nombre, precio, inventario y mínimo de inventario son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var product = store.Products.FirstOrDefault(item => item.Id == id);
            if (product is null || store.Categories.All(category => category.Id != request.CategoryId))
            {
                return NotFound();
            }

            product.CategoryId = request.CategoryId;
            product.Name = request.Name.Trim();
            product.Description = request.Description;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.MinimumStock = request.MinimumStock;
            product.IsActive = request.IsActive;
            product.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteProduct(Guid id)
    {
        lock (store.SyncRoot)
        {
            var product = store.Products.FirstOrDefault(item => item.Id == id);
            if (product is null)
            {
                return NotFound();
            }

            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    private static bool IsProductRequestValid(Guid categoryId, string name, decimal price, int stockQuantity, int minimumStock) =>
        categoryId != Guid.Empty &&
        !string.IsNullOrWhiteSpace(name) &&
        price >= 0 &&
        stockQuantity >= 0 &&
        minimumStock >= 0;
}
