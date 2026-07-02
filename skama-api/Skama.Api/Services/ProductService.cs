using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(string? search, Guid? categoryId, bool includeInactive)
    {
        var products = await _productRepository.GetAllAsync(search, categoryId, includeInactive);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product is null ? null : MapToDto(product);
    }

    public async Task<Guid> CreateAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            MinimumStock = request.MinimumStock
        };

        return await _productRepository.InsertAsync(product);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProductRequest request)
    {
        var product = new Product
        {
            Id = id,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            MinimumStock = request.MinimumStock,
            IsActive = request.IsActive
        };

        var rowsAffected = await _productRepository.UpdateAsync(product);
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var rowsAffected = await _productRepository.DeleteAsync(id);
        return rowsAffected > 0;
    }

    private static ProductDto MapToDto(Product product) => new()
    {
        Id = product.Id,
        CategoryId = product.CategoryId,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        StockQuantity = product.StockQuantity,
        MinimumStock = product.MinimumStock,
        IsActive = product.IsActive,
        CreatedAt = product.CreatedAt,
        UpdatedAt = product.UpdatedAt
    };
}