using Skama.Api.DTOs;
using Skama.Api.Models;
using Skama.Api.Repositories;

namespace Skama.Api.Services;

public class ProductImageService : IProductImageService
{
    private const string PublicImagePathPrefix = "/images/products";
    private const string StorageRelativeFolder = "images/products";
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductRepository _productRepository;
    private readonly IWebHostEnvironment _environment;

    public ProductImageService(
        IProductImageRepository productImageRepository,
        IProductRepository productRepository,
        IWebHostEnvironment environment)
    {
        _productImageRepository = productImageRepository;
        _productRepository = productRepository;
        _environment = environment;
    }

    public async Task<IEnumerable<ProductImageDto>> GetByProductIdAsync(Guid productId)
    {
        var images = await _productImageRepository.GetByProductIdAsync(productId);
        return images.Select(MapToDto);
    }

    public async Task<(ProductImageDto? Data, bool Success, int ResultCode, string? Error)> CreateAsync(
        Guid productId, IFormFile file, bool isMain, string? altText, int sortOrder)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
            return (null, false, 20, "No se encontró el producto.");

        var fileValidation = ValidateImageFile(file);
        if (!fileValidation.IsValid)
            return (null, false, 2, fileValidation.Error);

        var imageName = GenerateUniqueFileName(file.FileName);
        var saved = await TrySaveFileAsync(file, imageName);
        if (!saved.Success)
            return (null, false, 2, saved.Error);

        try
        {
            var image = new ProductImage
            {
                ProductId = productId,
                ImageName = imageName,
                AltText = altText,
                IsMain = isMain,
                SortOrder = sortOrder
            };

            var newId = await _productImageRepository.InsertAsync(image);
            image.Id = newId;

            return (MapToDto(image), true, 0, null);
        }
        catch
        {
            await TryDeleteFileAsync(imageName);
            throw;
        }
    }

    public async Task<(ProductImageDto? Data, bool Success, int ResultCode, string? Error)> UpdateAsync(
        Guid id, IFormFile? file, bool isMain, string? altText, int sortOrder)
    {
        var existing = await _productImageRepository.GetByIdAsync(id);
        if (existing is null)
            return (null, false, 20, "No se encontró la imagen del producto.");

        string imageName = existing.ImageName;
        string? previousImageName = null;

        if (file is not null)
        {
            var fileValidation = ValidateImageFile(file);
            if (!fileValidation.IsValid)
                return (null, false, 2, fileValidation.Error);

            imageName = GenerateUniqueFileName(file.FileName);
            var saved = await TrySaveFileAsync(file, imageName);
            if (!saved.Success)
                return (null, false, 2, saved.Error);

            previousImageName = existing.ImageName;
        }

        try
        {
            var image = new ProductImage
            {
                Id = id,
                ProductId = existing.ProductId,
                ImageName = imageName,
                AltText = altText,
                IsMain = isMain,
                SortOrder = sortOrder
            };

            var rowsAffected = await _productImageRepository.UpdateAsync(image);
            if (rowsAffected == 0)
            {
                if (previousImageName is not null)
                    await TryDeleteFileAsync(imageName);

                return (null, false, 20, "No se encontró la imagen del producto.");
            }

            if (previousImageName is not null)
                await TryDeleteFileAsync(previousImageName);

            return (MapToDto(image), true, 0, null);
        }
        catch
        {
            if (previousImageName is not null)
                await TryDeleteFileAsync(imageName);

            throw;
        }
    }

    public async Task<(bool Success, int ResultCode, string? Error)> DeleteAsync(Guid id)
    {
        var existing = await _productImageRepository.GetByIdAsync(id);
        if (existing is null)
            return (false, 20, "No se encontró la imagen del producto.");

        var rowsAffected = await _productImageRepository.DeleteAsync(id);
        if (rowsAffected == 0)
            return (false, 20, "No se encontró la imagen del producto.");

        await TryDeleteFileAsync(existing.ImageName);
        return (true, 0, null);
    }

    public async Task<(bool Success, int ResultCode, string? Error)> SetMainAsync(Guid id)
    {
        var rowsAffected = await _productImageRepository.SetMainAsync(id);

        return rowsAffected > 0
            ? (true, 0, null)
            : (false, 20, "No se encontró la imagen del producto.");
    }

    private ProductImageDto MapToDto(ProductImage image) => new()
    {
        Id = image.Id,
        ProductId = image.ProductId,
        ImageName = image.ImageName,
        ImageUrl = BuildImageUrl(image.ImageName),
        IsMain = image.IsMain,
        CreatedAt = null
    };

    private static string BuildImageUrl(string imageName) =>
        $"{PublicImagePathPrefix}/{imageName}";

    private static (bool IsValid, string? Error) ValidateImageFile(IFormFile? file)
    {
        if (file is null || file.Length == 0)
            return (false, "Debe adjuntar un archivo de imagen.");

        if (file.Length > MaxFileSizeBytes)
            return (false, "El archivo excede el tamaño máximo permitido (5 MB).");

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            return (false, "Formato no permitido. Use .jpg, .jpeg, .png o .webp.");

        return (true, null);
    }

    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        return $"{Guid.NewGuid():N}{extension}";
    }

    private string GetStorageDirectory()
    {
        var directory = Path.Combine(_environment.WebRootPath, StorageRelativeFolder);
        Directory.CreateDirectory(directory);
        return directory;
    }

    private async Task<(bool Success, string? Error)> TrySaveFileAsync(IFormFile file, string imageName)
    {
        try
        {
            var filePath = Path.Combine(GetStorageDirectory(), imageName);
            await using var stream = new FileStream(filePath, FileMode.CreateNew);
            await file.CopyToAsync(stream);
            return (true, null);
        }
        catch (Exception)
        {
            return (false, "No se pudo guardar la imagen en el servidor.");
        }
    }

    private Task TryDeleteFileAsync(string imageName)
    {
        var filePath = Path.Combine(GetStorageDirectory(), imageName);

        if (File.Exists(filePath))
            File.Delete(filePath);

        return Task.CompletedTask;
    }
}
