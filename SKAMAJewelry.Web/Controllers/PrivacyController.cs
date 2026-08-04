using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("privacy")]
public sealed class PrivacyController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        return View();
    }
}
