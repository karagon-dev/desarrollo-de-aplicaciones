using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("checkout")]
public sealed class CheckoutController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        return View();
    }
}
