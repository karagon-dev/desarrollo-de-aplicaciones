using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class ClientService : IClientService
{
    private readonly IClientRepository _clientRepository;

    public ClientService(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    public async Task<CustomerProfileDto?> GetProfileAsync(Guid userId)
    {
        var profile = await _clientRepository.GetByUserIdAsync(userId);

        if (profile is null)
            return null;

        return new CustomerProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            IdentificationNumber = profile.IdentificationNumber,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            BirthDate = profile.BirthDate,
            Phone = profile.Phone,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }

    public async Task<(Guid ProfileId, bool Success, string? Error)> UpsertProfileAsync(Guid userId, UpsertCustomerProfileRequest request)
    {
        var profile = new CustomerProfile
        {
            UserId = userId,
            IdentificationNumber = request.IdentificationNumber,
            FirstName = request.FirstName,
            LastName = request.LastName,
            BirthDate = request.BirthDate,
            Phone = request.Phone
        };

        var (profileId, resultCode) = await _clientRepository.UpsertAsync(profile);

        return resultCode switch
        {
            0 => (profileId, true, null),
            1 => (Guid.Empty, false, "The identification number is already registered by another user."),
            _ => (Guid.Empty, false, "An unexpected error occurred.")
        };
    }
}
