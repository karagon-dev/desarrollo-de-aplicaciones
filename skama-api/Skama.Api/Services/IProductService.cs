using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(string? search, Guid? categoryId, bool includeInactive);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(CreateProductRequest request);
    Task<bool> UpdateAsync(Guid id, UpdateProductRequest request);
    Task<bool> DeleteAsync(Guid id);
}