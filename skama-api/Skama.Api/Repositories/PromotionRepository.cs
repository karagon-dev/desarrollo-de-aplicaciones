using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class PromotionRepository : IPromotionRepository
{
    private readonly IConfiguration _configuration;

    public PromotionRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<Promotion>> GetActiveAsync()
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Promotion>(
            "usp_Promotion_GetActive",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<(Guid NewId, int ResultCode)> InsertAsync(Promotion promotion)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Name", promotion.Name, DbType.String);
        parameters.Add("@Description", promotion.Description, DbType.String);
        parameters.Add("@DiscountPercentage", promotion.DiscountPercentage, DbType.Decimal);
        parameters.Add("@StartDate", promotion.StartDate.ToDateTime(TimeOnly.MinValue), DbType.Date);
        parameters.Add("@EndDate", promotion.EndDate.ToDateTime(TimeOnly.MinValue), DbType.Date);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Promotion_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<(int RowsAffected, int ResultCode)> UpdateAsync(Promotion promotion)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", promotion.Id, DbType.Guid);
        parameters.Add("@Name", promotion.Name, DbType.String);
        parameters.Add("@Description", promotion.Description, DbType.String);
        parameters.Add("@DiscountPercentage", promotion.DiscountPercentage, DbType.Decimal);
        parameters.Add("@StartDate", promotion.StartDate.ToDateTime(TimeOnly.MinValue), DbType.Date);
        parameters.Add("@EndDate", promotion.EndDate.ToDateTime(TimeOnly.MinValue), DbType.Date);
        parameters.Add("@IsActive", promotion.IsActive, DbType.Boolean);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Promotion_Update",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<int>("@RowsAffected"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<(Guid NewId, int ResultCode)> AssignProductAsync(Guid promotionId, Guid productId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@PromotionId", promotionId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_PromotionProduct_Assign",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<int> RemoveProductAsync(Guid promotionId, Guid productId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@PromotionId", promotionId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_PromotionProduct_Remove",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }
}