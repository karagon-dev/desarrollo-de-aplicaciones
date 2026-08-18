using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Options;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class AuthService : IAuthService
{
    private const int CustomerRoleId = 2;
    private const int PasswordResetTokenExpirationHours = 1;
    private const string ForgotPasswordMessage =
        "Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.";

    private readonly IAuthRepository _authRepository;
    private readonly INotificationService _notificationService;
    private readonly IHostEnvironment _environment;
    private readonly EmailOptions _emailOptions;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IAuthRepository authRepository,
        INotificationService notificationService,
        IHostEnvironment environment,
        IOptions<EmailOptions> emailOptions,
        ILogger<AuthService> logger)
    {
        _authRepository = authRepository;
        _notificationService = notificationService;
        _environment = environment;
        _emailOptions = emailOptions.Value;
        _logger = logger;
    }

    public async Task<(Guid UserId, bool Success, int ResultCode, string? Error)> RegisterAsync(RegisterRequest request)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var (newId, resultCode) = await _authRepository.RegisterAsync(CustomerRoleId, request.Email, passwordHash);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            1 => (Guid.Empty, false, 11, "El correo ya está registrado."),
            _ => (Guid.Empty, false, resultCode, "Ocurrió un error inesperado.")
        };
    }

    public async Task<(LoginResponse? Response, bool Success, int ResultCode, string? Error)> LoginAsync(LoginRequest request)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, false, 12, "Credenciales inválidas.");
        }

        if (!user.IsActive)
        {
            return (null, false, 12, "Credenciales inválidas.");
        }

        return (MapToLoginResponse(user), true, 0, null);
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _authRepository.GetByIdAsync(id);
        return user is null ? null : MapToUserDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync(int? roleId, bool includeInactive)
    {
        var users = await _authRepository.GetAllAsync(roleId, includeInactive);
        return users.Select(MapToUserDto);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _authRepository.GetByEmailAsync(email);
        return user is null ? null : MapToUserDto(user);
    }

    public async Task<(bool Success, int ResultCode, string? Error)> UpdateStatusAsync(Guid id, UpdateUserStatusRequest request)
    {
        var rowsAffected = await _authRepository.UpdateStatusAsync(id, request.IsActive);

        return rowsAffected switch
        {
            > 0 => (true, 0, null),
            0 => (false, 10, "Usuario no encontrado."),
            _ => (false, 0, "Ocurrió un error inesperado.")
        };
    }

    public async Task<(ForgotPasswordResponse? Response, bool Success, int ResultCode, string? Error)> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email);

        if (user is null || !user.IsActive)
        {
            return (new ForgotPasswordResponse { Message = ForgotPasswordMessage }, true, 0, null);
        }

        var resetToken = Guid.NewGuid().ToString("N");
        var tokenHash = HashToken(resetToken);
        var expiresAt = DateTime.UtcNow.AddHours(PasswordResetTokenExpirationHours);

        await _authRepository.InsertPasswordResetTokenAsync(user.Id, tokenHash, expiresAt);

        var resetUrl = BuildPasswordResetUrl(resetToken);
        var emailSent = false;

        try
        {
            emailSent = await _notificationService.NotifyPasswordResetAsync(user.Id, user.Email, resetUrl);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "No se pudo enviar el correo de recuperación a {Email}.", user.Email);
            emailSent = false;
        }

        return (new ForgotPasswordResponse
        {
            Message = ForgotPasswordMessage,
            ResetToken = ShouldExposeResetToken(emailSent) ? resetToken : null
        }, true, 0, null);
    }

    public async Task<(bool Success, int ResultCode, string? Error)> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var tokenHash = HashToken(request.Token);
        var resetToken = await _authRepository.GetValidResetTokenAsync(tokenHash);

        if (resetToken is null)
        {
            return (false, 1, "Token de restablecimiento inválido o expirado.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        var rowsAffected = await _authRepository.UpdatePasswordAsync(resetToken.UserId, passwordHash);

        if (rowsAffected == 0)
        {
            return (false, 10, "Usuario no encontrado o inactivo.");
        }

        await _authRepository.MarkResetTokenAsUsedAsync(resetToken.Id);

        return (true, 0, null);
    }

    private bool ShouldExposeResetToken(bool emailSent) =>
        !emailSent && _environment.IsDevelopment();

    private string BuildPasswordResetUrl(string token)
    {
        var baseUrl = string.IsNullOrWhiteSpace(_emailOptions.FrontendBaseUrl)
            ? "http://localhost:5173"
            : _emailOptions.FrontendBaseUrl.TrimEnd('/');

        return $"{baseUrl}/auth/reset-password?token={Uri.EscapeDataString(token)}";
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    private static LoginResponse MapToLoginResponse(User user) => new()
    {
        UserId = user.Id,
        Email = user.Email,
        RoleId = user.RoleId,
        RoleName = user.RoleName,
        IsActive = user.IsActive
    };

    private static UserDto MapToUserDto(User user) => new()
    {
        Id = user.Id,
        RoleId = user.RoleId,
        RoleName = user.RoleName,
        Email = user.Email,
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt
    };
}
