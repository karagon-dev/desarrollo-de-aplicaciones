using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync(bool includeInactive)
    {
        var categories = await _categoryRepository.GetAllAsync(includeInactive);
        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetByIdAsync(Guid id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category is null ? null : MapToDto(category);
    }

    public async Task<Guid> CreateAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Description = request.Description
        };

        return await _categoryRepository.InsertAsync(category);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateCategoryRequest request)
    {
        var category = new Category
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive
        };

        var rowsAffected = await _categoryRepository.UpdateAsync(category);
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var rowsAffected = await _categoryRepository.DeleteAsync(id);
        return rowsAffected > 0;
    }

    private static CategoryDto MapToDto(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Description = category.Description,
        IsActive = category.IsActive,
        CreatedAt = category.CreatedAt,
        UpdatedAt = category.UpdatedAt
    };
}
