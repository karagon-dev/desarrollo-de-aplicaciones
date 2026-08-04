using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/wishlist")]
public sealed class WishlistApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("user/{userId:guid}")]
    public IActionResult GetUserWishlist(Guid userId)
    {
        lock (store.SyncRoot)
        {
            return Ok(store.WishlistItems
                .Where(item => item.UserId == userId)
                .OrderByDescending(item => item.CreatedAt)
                .Select(store.ToWishlistItemDto)
                .ToArray());
        }
    }

    [HttpPost("user/{userId:guid}")]
    public IActionResult Add(Guid userId, WishlistProductRequest request)
    {
        if (request.ProductId == Guid.Empty)
        {
            return Problem(title: "Validación inválida", detail: "El producto es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != userId) ||
                store.Products.All(product => product.Id != request.ProductId))
            {
                return NotFound();
            }

            if (store.WishlistItems.Any(item => item.UserId == userId && item.ProductId == request.ProductId))
            {
                return Problem(title: "Producto ya en favoritos", detail: "El producto ya está en favoritos.", statusCode: StatusCodes.Status409Conflict);
            }

            var item = new WishlistItemRecord
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = request.ProductId,
                CreatedAt = DateTime.UtcNow
            };

            store.WishlistItems.Add(item);
            return Created($"/api/wishlist/user/{userId}", new WishlistItemResponse(item.Id));
        }
    }

    [HttpDelete("user/{userId:guid}/product/{productId:guid}")]
    public IActionResult Delete(Guid userId, Guid productId)
    {
        lock (store.SyncRoot)
        {
            var item = store.WishlistItems.FirstOrDefault(item => item.UserId == userId && item.ProductId == productId);
            if (item is null)
            {
                return NotFound();
            }

            store.WishlistItems.Remove(item);
            return NoContent();
        }
    }

    [HttpPost("user/{userId:guid}/toggle")]
    public IActionResult Toggle(Guid userId, WishlistProductRequest request)
    {
        if (request.ProductId == Guid.Empty)
        {
            return Problem(title: "Validación inválida", detail: "El producto es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != userId) ||
                store.Products.All(product => product.Id != request.ProductId))
            {
                return NotFound();
            }

            var existing = store.WishlistItems.FirstOrDefault(item => item.UserId == userId && item.ProductId == request.ProductId);
            if (existing is not null)
            {
                store.WishlistItems.Remove(existing);
                return Ok(new ToggleWishlistResponse(false));
            }

            store.WishlistItems.Add(new WishlistItemRecord
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = request.ProductId,
                CreatedAt = DateTime.UtcNow
            });

            return Ok(new ToggleWishlistResponse(true));
        }
    }
}
