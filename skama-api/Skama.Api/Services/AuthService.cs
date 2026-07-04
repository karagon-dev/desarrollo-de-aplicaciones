using System.Security.Cryptography;
using System.Text;
using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class AuthService : IAuthService
{
    private const int CustomerRoleId = 2;
    private const int PasswordResetTokenExpirationHours = 1;

    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }

    public async Task<(Guid UserId, bool Success, int ResultCode, string? Error)> RegisterAsync(RegisterRequest request)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var (newId, resultCode) = await _authRepository.RegisterAsync(CustomerRoleId, request.Email, passwordHash);

        return resultCode switch
        {
            0 => (newId, true, resultCode, null),
            1 => (Guid.Empty, false, 11, "Email already exists."),
            _ => (Guid.Empty, false, resultCode, "An unexpected error occurred.")
        };
    }

    public async Task<(LoginResponse? Response, bool Success, int ResultCode, string? Error)> LoginAsync(LoginRequest request)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, false, 12, "Invalid credentials.");
        }

        if (!user.IsActive)
        {
            return (null, false, 12, "Invalid credentials.");
        }

        return (MapToLoginResponse(user), true, 0, null);
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _authRepository.GetByIdAsync(id);
        return user is null ? null : MapToUserDto(user);
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
            0 => (false, 10, "User was not found."),
            _ => (false, 0, "An unexpected error occurred.")
        };
    }

    public async Task<(ForgotPasswordResponse? Response, bool Success, int ResultCode, string? Error)> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email);

        if (user is null)
        {
            return (new ForgotPasswordResponse
            {
                Message = "If the email is registered, a reset token has been generated."
            }, true, 0, null);
        }

        var resetToken = Guid.NewGuid().ToString("N");
        var tokenHash = HashToken(resetToken);
        var expiresAt = DateTime.UtcNow.AddHours(PasswordResetTokenExpirationHours);

        await _authRepository.InsertPasswordResetTokenAsync(user.Id, tokenHash, expiresAt);

        return (new ForgotPasswordResponse
        {
            Message = "If the email is registered, a reset token has been generated.",
            ResetToken = resetToken
        }, true, 0, null);
    }

    public async Task<(bool Success, int ResultCode, string? Error)> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var tokenHash = HashToken(request.Token);
        var resetToken = await _authRepository.GetValidResetTokenAsync(tokenHash);

        if (resetToken is null)
        {
            return (false, 1, "Invalid or expired reset token.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        var rowsAffected = await _authRepository.UpdatePasswordAsync(resetToken.UserId, passwordHash);

        if (rowsAffected == 0)
        {
            return (false, 10, "User was not found or is inactive.");
        }

        await _authRepository.MarkResetTokenAsUsedAsync(resetToken.Id);

        return (true, 0, null);
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
