using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

public sealed class FoundationController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
