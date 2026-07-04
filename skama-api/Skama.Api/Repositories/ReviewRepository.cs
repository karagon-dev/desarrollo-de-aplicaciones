using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly IConfiguration _configuration;

    public ReviewRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<Review>> GetByProductIdAsync(Guid productId)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Review>(
            "usp_Review_GetByProductId",
            new { ProductId = productId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Review>> GetByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Review>(
            "usp_Review_GetByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<(Guid NewId, int ResultCode)> InsertAsync(Review review)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", review.UserId, DbType.Guid);
        parameters.Add("@ProductId", review.ProductId, DbType.Guid);
        parameters.Add("@OrderId", review.OrderId, DbType.Guid);
        parameters.Add("@Rating", review.Rating, DbType.Int32);
        parameters.Add("@Comment", review.Comment, DbType.String);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Review_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        var newId = parameters.Get<Guid>("@NewId");
        var resultCode = parameters.Get<int>("@ResultCode");

        return (newId, resultCode);
    }
} 