using Skama.Api.Models;

namespace Skama.Api.Repositories.Interfaces;

public interface IProductRepository
{
    Task<Guid> AddAsync(Product product);
}