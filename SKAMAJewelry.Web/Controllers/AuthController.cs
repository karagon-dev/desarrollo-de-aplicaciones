using Microsoft.AspNetCore.Mvc;

namespace SKAMAJewelry.Web.Controllers;

[Route("auth")]
public sealed class AuthController : Controller
{
    [HttpGet("login")]
    public IActionResult Login()
    {
        return View();
    }

    [HttpGet("register")]
    public IActionResult Register()
    {
        return View();
    }

    [HttpGet("forgot-password")]
    public IActionResult ForgotPassword()
    {
        return View();
    }

    [HttpGet("reset-password")]
    public IActionResult ResetPassword()
    {
        return View();
    }
}
