using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IConfiguration _configuration;

    public CategoryRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<Category>> GetAllAsync(bool includeInactive)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Category>(
            "usp_Category_GetAll",
            new { IncludeInactive = includeInactive },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<Category>(
            "usp_Category_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Guid> InsertAsync(Category category)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Name", category.Name, DbType.String);
        parameters.Add("@Description", category.Description, DbType.String);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Category_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<Guid>("@NewId");
    }

    public async Task<int> UpdateAsync(Category category)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", category.Id, DbType.Guid);
        parameters.Add("@Name", category.Name, DbType.String);
        parameters.Add("@Description", category.Description, DbType.String);
        parameters.Add("@IsActive", category.IsActive, DbType.Boolean);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Category_Update",
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
            "usp_Category_Delete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }
}
