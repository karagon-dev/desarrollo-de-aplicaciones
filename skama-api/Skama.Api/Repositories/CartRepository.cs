using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class CartRepository : ICartRepository
{
    private readonly IConfiguration _configuration;

    public CartRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<Guid> GetOrCreateActiveAsync(Guid userId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@CartId", dbType: DbType.Guid, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Cart_GetOrCreateActive",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<Guid>("@CartId");
    }

    public async Task<Cart?> GetActiveByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<Cart>(
            "usp_Cart_GetActiveByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<CartDetail?> GetDetailAsync(Guid cartId)
    {
        using var connection = CreateConnection();

        using var multi = await connection.QueryMultipleAsync(
            "usp_Cart_GetDetail",
            new { CartId = cartId },
            commandType: CommandType.StoredProcedure);

        var cart = await multi.ReadSingleOrDefaultAsync<Cart>();

        if (cart is null)
            return null;

        var items = (await multi.ReadAsync<CartItemDetail>()).ToList();
        var total = await multi.ReadSingleOrDefaultAsync<decimal?>() ?? 0;

        return new CartDetail
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Status = cart.Status,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt,
            Items = items,
            Total = total
        };
    }

    public async Task<(Guid CartItemId, int ResultCode)> AddItemAsync(Guid cartId, Guid productId, int quantity)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@CartId", cartId, DbType.Guid);
        parameters.Add("@ProductId", productId, DbType.Guid);
        parameters.Add("@Quantity", quantity, DbType.Int32);
        parameters.Add("@CartItemId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_CartItem_Add",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@CartItemId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<(int RowsAffected, int ResultCode)> UpdateItemQuantityAsync(Guid cartItemId, int quantity)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@CartItemId", cartItemId, DbType.Guid);
        parameters.Add("@Quantity", quantity, DbType.Int32);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_CartItem_UpdateQuantity",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<int>("@RowsAffected"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<(int RowsAffected, int ResultCode)> RemoveItemAsync(Guid cartItemId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@CartItemId", cartItemId, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_CartItem_Remove",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<int>("@RowsAffected"), parameters.Get<int>("@ResultCode"));
    }
}