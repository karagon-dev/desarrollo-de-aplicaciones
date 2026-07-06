using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly IConfiguration _configuration;

    public WishlistRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<(Guid NewId, int ResultCode)> AddAsync(Guid userId, Guid productId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Wishlist_Add",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<IEnumerable<WishlistItemDetail>> GetByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<WishlistItemDetail>(
            "usp_Wishlist_GetByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> RemoveAsync(Guid userId, Guid productId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Wishlist_Remove",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<bool> ToggleAsync(Guid userId, Guid productId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@IsFavorite", dbType: DbType.Boolean, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Wishlist_Toggle",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<bool>("@IsFavorite");
    }
}
