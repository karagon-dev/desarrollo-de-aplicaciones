using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class InventoryRepository : IInventoryRepository
{
    private readonly IConfiguration _configuration;

    public InventoryRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<(Guid NewId, int ResultCode)> InsertMovementAsync(InventoryMovement movement)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@ProductId", movement.ProductId, DbType.Guid);
        parameters.Add("@MovementType", movement.MovementType, DbType.String);
        parameters.Add("@Quantity", movement.Quantity, DbType.Int32);
        parameters.Add("@ReferenceOrderId", movement.ReferenceOrderId, DbType.Guid);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_InventoryMovement_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<IEnumerable<InventoryMovement>> GetMovementsByProductIdAsync(Guid productId)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<InventoryMovement>(
            "usp_InventoryMovement_GetByProductId",
            new { ProductId = productId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<LowStockProduct>> GetLowStockAsync()
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<LowStockProduct>(
            "usp_Inventory_GetLowStock",
            commandType: CommandType.StoredProcedure);
    }
}
