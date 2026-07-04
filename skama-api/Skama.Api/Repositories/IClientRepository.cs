using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IClientRepository
{
    Task<CustomerProfile?> GetByUserIdAsync(Guid userId);
    Task<(Guid ProfileId, int ResultCode)> UpsertAsync(CustomerProfile profile);
}
