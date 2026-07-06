using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class ProductImageRepository : IProductImageRepository
{
    private readonly IConfiguration _configuration;

    public ProductImageRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId)
    {
        using var connection = CreateConnection();

        var rows = await connection.QueryAsync<ProductImageRecord>(
            "usp_ProductImage_GetByProductId",
            new { ProductId = productId },
            commandType: CommandType.StoredProcedure);

        return rows.Select(MapToModel);
    }

    public async Task<ProductImage?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();

        var row = await connection.QuerySingleOrDefaultAsync<ProductImageRecord>(
            "usp_ProductImage_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure);

        return row is null ? null : MapToModel(row);
    }

    public async Task<Guid> InsertAsync(ProductImage image)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@ProductId", image.ProductId, DbType.Guid);
        parameters.Add("@ImageUrl", image.ImageName, DbType.String);
        parameters.Add("@AltText", image.AltText, DbType.String);
        parameters.Add("@IsMain", image.IsMain, DbType.Boolean);
        parameters.Add("@SortOrder", image.SortOrder, DbType.Int32);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_ProductImage_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<Guid>("@NewId");
    }

    public async Task<int> UpdateAsync(ProductImage image)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", image.Id, DbType.Guid);
        parameters.Add("@ImageUrl", image.ImageName, DbType.String);
        parameters.Add("@AltText", image.AltText, DbType.String);
        parameters.Add("@IsMain", image.IsMain, DbType.Boolean);
        parameters.Add("@SortOrder", image.SortOrder, DbType.Int32);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_ProductImage_Update",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_ProductImage_Delete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<int> SetMainAsync(Guid id)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_ProductImage_SetMain",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    private static ProductImage MapToModel(ProductImageRecord row) => new()
    {
        Id = row.Id,
        ProductId = row.ProductId,
        ImageName = row.ImageUrl,
        AltText = row.AltText,
        IsMain = row.IsMain,
        SortOrder = row.SortOrder
    };

    private sealed class ProductImageRecord
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? AltText { get; set; }
        public bool IsMain { get; set; }
        public int SortOrder { get; set; }
    }
}
