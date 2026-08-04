using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/auth")]
public sealed class AuthApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.ConfirmPassword) ||
            request.Password != request.ConfirmPassword)
        {
            return Problem(title: "Validación inválida", detail: "Correo, contraseña y confirmación son requeridos y deben coincidir.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.Any(user => string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase)))
            {
                return Problem(title: "Correo ya registrado", detail: "El correo ya está registrado.", statusCode: StatusCodes.Status409Conflict);
            }

            var user = new UserRecord
            {
                Id = Guid.NewGuid(),
                RoleId = 2,
                RoleName = "Customer",
                Email = request.Email.Trim(),
                Password = request.Password,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            store.Users.Add(user);
            return Created($"/api/auth/users/{user.Id}", new RegisterResponse(user.Id));
        }
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Problem(title: "Validación inválida", detail: "Correo y contraseña son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(item =>
                string.Equals(item.Email, request.Email, StringComparison.OrdinalIgnoreCase) &&
                item.Password == request.Password &&
                item.IsActive);

            if (user is null)
            {
                return Problem(title: "Credenciales inválidas", detail: "Correo o contraseña inválidos.", statusCode: StatusCodes.Status401Unauthorized);
            }

            return Ok(new LoginResponse(user.Id, user.Email, user.RoleId, user.RoleName, user.IsActive));
        }
    }

    [HttpGet("users/{id:guid}")]
    public IActionResult GetUser(Guid id)
    {
        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(item => item.Id == id);
            return user is null ? NotFound() : Ok(store.ToUserDto(user));
        }
    }

    [HttpGet("users/by-email/{email}")]
    public IActionResult GetUserByEmail(string email)
    {
        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(item => string.Equals(item.Email, email, StringComparison.OrdinalIgnoreCase));
            return user is null ? NotFound() : Ok(store.ToUserDto(user));
        }
    }

    [HttpPatch("users/{id:guid}/status")]
    public IActionResult UpdateStatus(Guid id, UpdateUserStatusRequest request)
    {
        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(item => item.Id == id);
            if (user is null)
            {
                return NotFound();
            }

            user.IsActive = request.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            return NoContent();
        }
    }

    [HttpPost("forgot-password")]
    public IActionResult ForgotPassword(ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Problem(title: "Validación inválida", detail: "El correo es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        const string message = "Si el correo existe, se enviará un enlace de recuperación.";

        lock (store.SyncRoot)
        {
            var user = store.Users.FirstOrDefault(item => string.Equals(item.Email, request.Email, StringComparison.OrdinalIgnoreCase));
            if (user is null)
            {
                return Ok(new ForgotPasswordResponse(message, null));
            }

            var token = $"reset-{Guid.NewGuid():N}";
            store.PasswordResets.Add(new PasswordResetRecord
            {
                Token = token,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddHours(2)
            });

            return Ok(new ForgotPasswordResponse(message, token));
        }
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token) ||
            string.IsNullOrWhiteSpace(request.NewPassword) ||
            string.IsNullOrWhiteSpace(request.ConfirmPassword) ||
            request.NewPassword != request.ConfirmPassword)
        {
            return Problem(title: "Validación inválida", detail: "Token, contraseña y confirmación son requeridos y deben coincidir.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            var reset = store.PasswordResets.FirstOrDefault(item => item.Token == request.Token);
            if (reset is null)
            {
                return NotFound();
            }

            if (reset.ExpiresAt < DateTime.UtcNow)
            {
                return Problem(title: "Token inválido", detail: "El token expiró.", statusCode: StatusCodes.Status400BadRequest);
            }

            var user = store.Users.FirstOrDefault(item => item.Id == reset.UserId);
            if (user is null)
            {
                return NotFound();
            }

            user.Password = request.NewPassword;
            user.UpdatedAt = DateTime.UtcNow;
            store.PasswordResets.Remove(reset);
            return NoContent();
        }
    }
}
