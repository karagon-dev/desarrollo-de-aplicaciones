using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("order")]
public sealed class OrderController : Controller
{
    [HttpGet("confirmation")]
    public IActionResult Confirmation()
    {
        return View();
    }
}
