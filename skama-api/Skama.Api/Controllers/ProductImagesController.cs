using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Produces("application/json")]
public class ProductImagesController : ControllerBase
{
    private readonly IProductImageService _productImageService;

    public ProductImagesController(IProductImageService productImageService)
    {
        _productImageService = productImageService;
    }

    [HttpGet("api/products/{productId:guid}/images")]
    [ProducesResponseType(typeof(IEnumerable<ProductImageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductImageDto>>> GetByProductId(Guid productId)
    {
        var images = await _productImageService.GetByProductIdAsync(productId);
        return Ok(images);
    }

    [HttpPost("api/products/{productId:guid}/images")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ProductImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductImageDto>> Create(
        Guid productId,
        IFormFile file,
        [FromForm] bool isMain = false,
        [FromForm] string? altText = null,
        [FromForm] int sortOrder = 0)
    {
        var (data, success, resultCode, error) = await _productImageService.CreateAsync(
            productId, file, isMain, altText, sortOrder);

        if (!success)
        {
            if (resultCode == 20)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not upload product image",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(GetByProductId), new { productId }, data);
    }

    [HttpPut("api/product-images/{id:guid}")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ProductImageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductImageDto>> Update(
        Guid id,
        IFormFile? file,
        [FromForm] bool isMain = false,
        [FromForm] string? altText = null,
        [FromForm] int sortOrder = 0)
    {
        var (data, success, resultCode, error) = await _productImageService.UpdateAsync(
            id, file, isMain, altText, sortOrder);

        if (!success)
        {
            if (resultCode == 20)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product image not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Could not update product image",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return Ok(data);
    }

    [HttpDelete("api/product-images/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var (success, resultCode, error) = await _productImageService.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Product image not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }

    [HttpPatch("api/product-images/{id:guid}/main")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetMain(Guid id)
    {
        var (success, _, error) = await _productImageService.SetMainAsync(id);

        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Product image not found",
                Detail = error,
                Status = StatusCodes.Status404NotFound
            });
        }

        return NoContent();
    }
}
