using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IAuthService
{
    Task<(Guid UserId, bool Success, int ResultCode, string? Error)> RegisterAsync(RegisterRequest request);
    Task<(LoginResponse? Response, bool Success, int ResultCode, string? Error)> LoginAsync(LoginRequest request);
    Task<UserDto?> GetUserByIdAsync(Guid id);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<(bool Success, int ResultCode, string? Error)> UpdateStatusAsync(Guid id, UpdateUserStatusRequest request);
    Task<(ForgotPasswordResponse? Response, bool Success, int ResultCode, string? Error)> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<(bool Success, int ResultCode, string? Error)> ResetPasswordAsync(ResetPasswordRequest request);
}
