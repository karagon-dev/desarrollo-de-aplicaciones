using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
public sealed class ProductImagesApiController(SkamaApiDataStore store, IWebHostEnvironment environment) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    [HttpGet("api/products/{productId:guid}/images")]
    public IActionResult GetProductImages(Guid productId)
    {
        lock (store.SyncRoot)
        {
            if (store.Products.All(product => product.Id != productId))
            {
                return NotFound();
            }

            return Ok(store.ProductImages
                .Where(image => image.ProductId == productId)
                .OrderByDescending(image => image.IsMain)
                .ThenBy(image => image.SortOrder)
                .Select(store.ToProductImageDto)
                .ToArray());
        }
    }

    [HttpPost("api/products/{productId:guid}/images")]
    [RequestSizeLimit(5_242_880)]
    public async Task<IActionResult> CreateImage(Guid productId, IFormFile file, [FromForm] bool isMain = false, [FromForm] string? altText = null, [FromForm] int sortOrder = 0)
    {
        if (!IsValidFile(file))
        {
            return Problem(title: "Archivo inválido", detail: "El archivo debe ser JPG, JPEG, PNG o WEBP y pesar máximo 5 MB.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Products.All(product => product.Id != productId))
            {
                return NotFound();
            }
        }

        var image = await SaveImageAsync(productId, file, isMain, altText, sortOrder);
        return Created($"/api/product-images/{image.Id}", store.ToProductImageDto(image));
    }

    [HttpPut("api/product-images/{id:guid}")]
    [RequestSizeLimit(5_242_880)]
    public async Task<IActionResult> UpdateImage(Guid id, IFormFile? file = null, [FromForm] bool isMain = false, [FromForm] string? altText = null, [FromForm] int sortOrder = 0)
    {
        ProductImageRecord? image;
        lock (store.SyncRoot)
        {
            image = store.ProductImages.FirstOrDefault(item => item.Id == id);
            if (image is null)
            {
                return NotFound();
            }
        }

        if (file is not null)
        {
            if (!IsValidFile(file))
            {
            return Problem(title: "Archivo inválido", detail: "El archivo debe ser JPG, JPEG, PNG o WEBP y pesar máximo 5 MB.", statusCode: StatusCodes.Status400BadRequest);
            }

            var replacement = await SaveImageFileAsync(file);
            image.ImageName = replacement.ImageName;
            image.ImageUrl = replacement.ImageUrl;
        }

        lock (store.SyncRoot)
        {
            if (isMain)
            {
                foreach (var existing in store.ProductImages.Where(item => item.ProductId == image.ProductId))
                {
                    existing.IsMain = false;
                }
            }

            image.IsMain = isMain || image.IsMain;
            image.AltText = altText;
            image.SortOrder = sortOrder;
            return Ok(store.ToProductImageDto(image));
        }
    }

    [HttpDelete("api/product-images/{id:guid}")]
    public IActionResult DeleteImage(Guid id)
    {
        lock (store.SyncRoot)
        {
            var image = store.ProductImages.FirstOrDefault(item => item.Id == id);
            if (image is null)
            {
                return NotFound();
            }

            store.ProductImages.Remove(image);
            return NoContent();
        }
    }

    [HttpPatch("api/product-images/{id:guid}/main")]
    public IActionResult MarkMain(Guid id)
    {
        lock (store.SyncRoot)
        {
            var image = store.ProductImages.FirstOrDefault(item => item.Id == id);
            if (image is null)
            {
                return NotFound();
            }

            foreach (var existing in store.ProductImages.Where(item => item.ProductId == image.ProductId))
            {
                existing.IsMain = false;
            }

            image.IsMain = true;
            return NoContent();
        }
    }

    private async Task<ProductImageRecord> SaveImageAsync(Guid productId, IFormFile file, bool isMain, string? altText, int sortOrder)
    {
        var saved = await SaveImageFileAsync(file);
        var image = new ProductImageRecord
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            ImageName = saved.ImageName,
            ImageUrl = saved.ImageUrl,
            IsMain = isMain,
            AltText = altText,
            SortOrder = sortOrder,
            CreatedAt = DateTime.UtcNow
        };

        lock (store.SyncRoot)
        {
            if (isMain)
            {
                foreach (var existing in store.ProductImages.Where(item => item.ProductId == productId))
                {
                    existing.IsMain = false;
                }
            }

            store.ProductImages.Add(image);
        }

        return image;
    }

    private async Task<(string ImageName, string ImageUrl)> SaveImageFileAsync(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var imageName = $"{Guid.NewGuid():N}{extension}";
        var directory = Path.Combine(environment.WebRootPath, "images", "products");
        Directory.CreateDirectory(directory);
        var path = Path.Combine(directory, imageName);

        await using var stream = System.IO.File.Create(path);
        await file.CopyToAsync(stream);

        return (imageName, $"/images/products/{imageName}");
    }

    private static bool IsValidFile(IFormFile? file)
    {
        if (file is null || file.Length <= 0 || file.Length > 5_242_880)
        {
            return false;
        }

        return AllowedExtensions.Contains(Path.GetExtension(file.FileName));
    }
}
