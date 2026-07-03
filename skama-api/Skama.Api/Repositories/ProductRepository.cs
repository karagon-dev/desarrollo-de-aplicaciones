using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IConfiguration _configuration;

    public ProductRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<Product>> GetAllAsync(string? search, Guid? categoryId, bool includeInactive)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Product>(
            "usp_Product_GetAll",
            new
            {
                Search = search,
                CategoryId = categoryId,
                IncludeInactive = includeInactive
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<Product>(
            "usp_Product_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Guid> InsertAsync(Product product)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@CategoryId", product.CategoryId, DbType.Guid);
        parameters.Add("@Name", product.Name, DbType.String);
        parameters.Add("@Description", product.Description, DbType.String);
        parameters.Add("@Price", product.Price, DbType.Decimal);
        parameters.Add("@StockQuantity", product.StockQuantity, DbType.Int32);
        parameters.Add("@MinimumStock", product.MinimumStock, DbType.Int32);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Product_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<Guid>("@NewId");
    }

    public async Task<int> UpdateAsync(Product product)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", product.Id, DbType.Guid);
        parameters.Add("@CategoryId", product.CategoryId, DbType.Guid);
        parameters.Add("@Name", product.Name, DbType.String);
        parameters.Add("@Description", product.Description, DbType.String);
        parameters.Add("@Price", product.Price, DbType.Decimal);
        parameters.Add("@StockQuantity", product.StockQuantity, DbType.Int32);
        parameters.Add("@MinimumStock", product.MinimumStock, DbType.Int32);
        parameters.Add("@IsActive", product.IsActive, DbType.Boolean);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Product_Update",
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
            "usp_Product_Delete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }
}