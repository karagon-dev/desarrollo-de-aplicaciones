using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly IConfiguration _configuration;

    public NotificationRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<EmailNotification>> GetPendingAsync()
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<EmailNotification>(
            "usp_EmailNotification_GetPending",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<(Guid NewId, int ResultCode)> InsertAsync(EmailNotification notification)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", notification.UserId, DbType.Guid);
        parameters.Add("@OrderId", notification.OrderId, DbType.Guid);
        parameters.Add("@Type", notification.Type, DbType.String);
        parameters.Add("@RecipientEmail", notification.RecipientEmail, DbType.String);
        parameters.Add("@Subject", notification.Subject, DbType.String);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_EmailNotification_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<int> MarkAsSentAsync(Guid id)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_EmailNotification_MarkAsSent",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<int> MarkAsFailedAsync(Guid id)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_EmailNotification_MarkAsFailed",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }
}
