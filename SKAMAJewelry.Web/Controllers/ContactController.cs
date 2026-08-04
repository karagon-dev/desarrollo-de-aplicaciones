using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("contact")]
public sealed class ContactController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        return View();
    }
}
