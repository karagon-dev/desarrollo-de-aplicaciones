using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("catalog/product")]
public sealed class ProductController : Controller
{
    [HttpGet("{slug?}")]
    public IActionResult Details(string? slug = null)
    {
        return View();
    }
}
