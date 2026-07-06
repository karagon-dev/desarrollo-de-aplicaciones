using Skama.Api.DTOs;
using Microsoft.AspNetCore.Http;

namespace Skama.Api.Services;

public interface IProductImageService
{
    Task<IEnumerable<ProductImageDto>> GetByProductIdAsync(Guid productId);
    Task<(ProductImageDto? Data, bool Success, int ResultCode, string? Error)> CreateAsync(
        Guid productId, IFormFile file, bool isMain, string? altText, int sortOrder);
    Task<(ProductImageDto? Data, bool Success, int ResultCode, string? Error)> UpdateAsync(
        Guid id, IFormFile? file, bool isMain, string? altText, int sortOrder);
    Task<(bool Success, int ResultCode, string? Error)> DeleteAsync(Guid id);
    Task<(bool Success, int ResultCode, string? Error)> SetMainAsync(Guid id);
}
