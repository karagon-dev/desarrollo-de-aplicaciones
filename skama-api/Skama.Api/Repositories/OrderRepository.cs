using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly IConfiguration _configuration;

    public OrderRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<(Guid OrderId, string OrderNumber, int ResultCode)> CreateFromCartAsync(
        Guid cartId, string paymentMethod, string shippingAddress)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@CartId", cartId, DbType.Guid);
        parameters.Add("@PaymentMethod", paymentMethod, DbType.String);
        parameters.Add("@ShippingAddress", shippingAddress, DbType.String);
        parameters.Add("@OrderId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@OrderNumber", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Order_CreateFromCart",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (
            parameters.Get<Guid>("@OrderId"),
            parameters.Get<string>("@OrderNumber") ?? string.Empty,
            parameters.Get<int>("@ResultCode"));
    }

    public async Task<Order?> GetByIdAsync(Guid orderId)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<Order>(
            "usp_Order_GetById",
            new { OrderId = orderId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<Order>(
            "usp_Order_GetByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<OrderDetail?> GetDetailAsync(Guid orderId)
    {
        using var connection = CreateConnection();

        using var multi = await connection.QueryMultipleAsync(
            "usp_Order_GetDetail",
            new { OrderId = orderId },
            commandType: CommandType.StoredProcedure);

        var order = await multi.ReadSingleOrDefaultAsync<Order>();

        if (order is null)
            return null;

        var items = (await multi.ReadAsync<OrderItem>()).ToList();

        return new OrderDetail
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            ShippingAddress = order.ShippingAddress,
            Subtotal = order.Subtotal,
            DiscountTotal = order.DiscountTotal,
            Total = order.Total,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Items = items
        };
    }

    public async Task<(int RowsAffected, int ResultCode)> UpdateStatusAsync(Guid orderId, string status)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@OrderId", orderId, DbType.Guid);
        parameters.Add("@Status", status, DbType.String);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Order_UpdateStatus",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<int>("@RowsAffected"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<(int RowsAffected, int ResultCode)> CancelAsync(Guid orderId)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@OrderId", orderId, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_Order_Cancel",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<int>("@RowsAffected"), parameters.Get<int>("@ResultCode"));
    }
}
