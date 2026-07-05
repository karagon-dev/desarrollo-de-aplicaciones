using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<object>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (userId, success, _, error) = await _authService.RegisterAsync(request);

        if (!success)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Registration failed",
                Detail = error,
                Status = StatusCodes.Status409Conflict
            });
        }

        return CreatedAtAction(nameof(GetUserById), new { id = userId }, new { userId });
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (response, success, _, error) = await _authService.LoginAsync(request);

        if (!success)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Login failed",
                Detail = error,
                Status = StatusCodes.Status401Unauthorized
            });
        }

        return Ok(response);
    }

    [HttpGet("users/{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id)
    {
        var user = await _authService.GetUserByIdAsync(id);

        if (user is null)
            return NotFound();

        return Ok(user);
    }

    [HttpGet("users/by-email/{email}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
    {
        var user = await _authService.GetUserByEmailAsync(email);

        if (user is null)
            return NotFound();

        return Ok(user);
    }

    [HttpPatch("users/{id:guid}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateUserStatusRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, resultCode, error) = await _authService.UpdateStatusAsync(id, request);

        if (!success)
        {
            if (resultCode == 10)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Status update failed",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (response, _, _, _) = await _authService.ForgotPasswordAsync(request);

        return Ok(response);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, resultCode, error) = await _authService.ResetPasswordAsync(request);

        if (!success)
        {
            if (resultCode == 1)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Reset token not found",
                    Detail = error,
                    Status = StatusCodes.Status404NotFound
                });
            }

            return BadRequest(new ProblemDetails
            {
                Title = "Password reset failed",
                Detail = error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return NoContent();
    }
}
