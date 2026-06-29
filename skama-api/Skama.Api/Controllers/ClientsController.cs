using Microsoft.AspNetCore.Mvc;
using Skama.Api.DTOs;
using Skama.Api.Services;

namespace Skama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
 [Produces("application/json")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet("{userId:guid}/profile")]
    [ProducesResponseType(typeof(CustomerProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerProfileDto>> GetProfile(Guid userId)
    {
        var profile = await _clientService.GetProfileAsync(userId);

        if (profile is null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut("{userId:guid}/profile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<object>> UpsertProfile(Guid userId, [FromBody] UpsertCustomerProfileRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (profileId, success, error) = await _clientService.UpsertProfileAsync(userId, request);

        if (!success)
            return Conflict(new ProblemDetails
            {
                Title = "Profile upsert conflict",
                Detail = error,
                Status = StatusCodes.Status409Conflict
            });

        return Ok(new { profileId });
    }
}
