using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly IConfiguration _configuration;

    public AuthRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<(Guid NewId, int ResultCode)> RegisterAsync(int roleId, string email, string passwordHash)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@RoleId", roleId, DbType.Int32);
        parameters.Add("@Email", email, DbType.String);
        parameters.Add("@PasswordHash", passwordHash, DbType.String);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_User_Register",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (parameters.Get<Guid>("@NewId"), parameters.Get<int>("@ResultCode"));
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<User>(
            "usp_User_GetByEmail",
            new { Email = email },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<User>(
            "usp_User_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> UpdatePasswordAsync(Guid userId, string passwordHash)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@PasswordHash", passwordHash, DbType.String);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_User_UpdatePassword",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<int> UpdateStatusAsync(Guid id, bool isActive)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@IsActive", isActive, DbType.Boolean);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_User_UpdateStatus",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }

    public async Task<Guid> InsertPasswordResetTokenAsync(Guid userId, string tokenHash, DateTime expiresAt)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@TokenHash", tokenHash, DbType.String);
        parameters.Add("@ExpiresAt", expiresAt, DbType.DateTime2);
        parameters.Add("@NewId", dbType: DbType.Guid, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_PasswordResetToken_Insert",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<Guid>("@NewId");
    }

    public async Task<PasswordResetToken?> GetValidResetTokenAsync(string tokenHash)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<PasswordResetToken>(
            "usp_PasswordResetToken_GetValid",
            new { TokenHash = tokenHash },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> MarkResetTokenAsUsedAsync(Guid id)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_PasswordResetToken_MarkAsUsed",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@RowsAffected");
    }
}
