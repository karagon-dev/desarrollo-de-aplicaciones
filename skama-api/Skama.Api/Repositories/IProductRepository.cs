using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(string? search, Guid? categoryId, bool includeInactive);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Guid> InsertAsync(Product product);
    Task<int> UpdateAsync(Product product);
    Task<int> DeleteAsync(Guid id);
}