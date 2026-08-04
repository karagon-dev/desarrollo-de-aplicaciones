using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("admin")]
public sealed class AdminController : Controller
{
    [HttpGet("")]
    public IActionResult Index() => View();

    [HttpGet("products")]
    public IActionResult Products()
    {
        ViewData["AdminSection"] = "products";
        return View("Module");
    }

    [HttpGet("categories")]
    public IActionResult Categories()
    {
        ViewData["AdminSection"] = "categories";
        return View("Module");
    }

    [HttpGet("collections")]
    public IActionResult Collections()
    {
        ViewData["AdminSection"] = "collections";
        return View("Module");
    }

    [HttpGet("orders")]
    public IActionResult Orders()
    {
        ViewData["AdminSection"] = "orders";
        return View("Module");
    }

    [HttpGet("customers")]
    public IActionResult Customers()
    {
        ViewData["AdminSection"] = "customers";
        return View("Module");
    }

    [HttpGet("users")]
    public IActionResult Users()
    {
        ViewData["AdminSection"] = "users";
        return View("Module");
    }

    [HttpGet("reports")]
    public IActionResult Reports()
    {
        ViewData["AdminSection"] = "reports";
        return View("Module");
    }

    [HttpGet("settings")]
    public IActionResult Settings()
    {
        ViewData["AdminSection"] = "settings";
        return View("Module");
    }
}
