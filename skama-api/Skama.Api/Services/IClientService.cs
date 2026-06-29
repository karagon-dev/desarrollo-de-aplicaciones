using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IClientService
{
    Task<CustomerProfileDto?> GetProfileAsync(Guid userId);
    Task<(Guid ProfileId, bool Success, string? Error)> UpsertProfileAsync(Guid userId, UpsertCustomerProfileRequest request);
}
