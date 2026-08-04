using Microsoft.AspNetCore.Mvc;
using SKAMAJewelry.Web.Contracts.Api;
using SKAMAJewelry.Web.Services.Api;

namespace SKAMAJewelry.Web.Controllers.Api;

[ApiController]
[Route("api/clients")]
public sealed class ClientsApiController(SkamaApiDataStore store) : ControllerBase
{
    [HttpGet("{userId:guid}/profile")]
    public IActionResult GetProfile(Guid userId)
    {
        lock (store.SyncRoot)
        {
            var profile = store.ClientProfiles.FirstOrDefault(item => item.UserId == userId);
            return profile is null ? NotFound() : Ok(store.ToClientProfileDto(profile));
        }
    }

    [HttpPut("{userId:guid}/profile")]
    public IActionResult UpsertProfile(Guid userId, UpsertClientProfileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdentificationNumber) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.Phone))
        {
            return Problem(title: "Validación inválida", detail: "Identificación, nombre, apellidos y teléfono son requeridos.", statusCode: StatusCodes.Status400BadRequest);
        }

        lock (store.SyncRoot)
        {
            if (store.Users.All(user => user.Id != userId))
            {
                return NotFound();
            }

            var duplicated = store.ClientProfiles.Any(item =>
                item.UserId != userId &&
                string.Equals(item.IdentificationNumber, request.IdentificationNumber, StringComparison.OrdinalIgnoreCase));

            if (duplicated)
            {
                return Problem(title: "Identificación duplicada", detail: "Ya existe un cliente con esta identificación.", statusCode: StatusCodes.Status409Conflict);
            }

            var profile = store.ClientProfiles.FirstOrDefault(item => item.UserId == userId);
            if (profile is null)
            {
                profile = new ClientProfileRecord
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                store.ClientProfiles.Add(profile);
            }

            profile.IdentificationNumber = request.IdentificationNumber.Trim();
            profile.FirstName = request.FirstName.Trim();
            profile.LastName = request.LastName.Trim();
            profile.BirthDate = request.BirthDate;
            profile.Phone = request.Phone.Trim();
            profile.UpdatedAt = DateTime.UtcNow;

            return Ok(new ClientProfileResponse(profile.Id));
        }
    }
}
