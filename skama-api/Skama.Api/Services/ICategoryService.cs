using Skama.Api.DTOs;

namespace Skama.Api.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync(bool includeInactive);
    Task<CategoryDto?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(CreateCategoryRequest request);
    Task<bool> UpdateAsync(Guid id, UpdateCategoryRequest request);
    Task<bool> DeleteAsync(Guid id);
}
