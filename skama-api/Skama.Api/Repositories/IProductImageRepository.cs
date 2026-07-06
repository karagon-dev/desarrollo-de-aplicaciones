using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface IProductImageRepository
{
    Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId);
    Task<ProductImage?> GetByIdAsync(Guid id);
    Task<Guid> InsertAsync(ProductImage image);
    Task<int> UpdateAsync(ProductImage image);
    Task<int> DeleteAsync(Guid id);
    Task<int> SetMainAsync(Guid id);
}
