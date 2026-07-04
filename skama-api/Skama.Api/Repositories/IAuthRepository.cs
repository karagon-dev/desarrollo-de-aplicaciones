using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IAuthRepository
{
    Task<(Guid NewId, int ResultCode)> RegisterAsync(int roleId, string email, string passwordHash);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<int> UpdatePasswordAsync(Guid userId, string passwordHash);
    Task<int> UpdateStatusAsync(Guid id, bool isActive);
    Task<Guid> InsertPasswordResetTokenAsync(Guid userId, string tokenHash, DateTime expiresAt);
    Task<PasswordResetToken?> GetValidResetTokenAsync(string tokenHash);
    Task<int> MarkResetTokenAsUsedAsync(Guid id);
}
