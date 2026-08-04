using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("")]
public sealed class CatalogController : Controller
{
    [HttpGet("collections")]
    [HttpGet("catalog")]
    public IActionResult Index()
    {
        return View();
    }
}
