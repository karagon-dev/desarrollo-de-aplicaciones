using Skama.Api.Models;

namespace Skama.Api.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync(bool includeInactive);
    Task<Category?> GetByIdAsync(Guid id);
    Task<Guid> InsertAsync(Category category);
    Task<int> UpdateAsync(Category category);
    Task<int> DeleteAsync(Guid id);
}
