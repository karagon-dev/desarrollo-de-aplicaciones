using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("destacados")]
public sealed class FavoritesController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        return View();
    }
}
