using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet("{userId:guid}/profile")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var profile = await _clientService.GetProfileAsync(userId);

        if (profile is null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut("{userId:guid}/profile")]
    public async Task<IActionResult> UpsertProfile(Guid userId, [FromBody] UpsertCustomerProfileRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (profileId, success, error) = await _clientService.UpsertProfileAsync(userId, request);

        if (!success)
            return Conflict(new { message = error });

        return Ok(new { profileId });
    }
}
