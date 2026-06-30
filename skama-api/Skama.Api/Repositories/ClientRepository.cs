using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly IConfiguration _configuration;

    public ClientRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<CustomerProfile?> GetByUserIdAsync(Guid userId)
    {
        using var connection = CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<CustomerProfile>(
            "usp_CustomerProfile_GetByUserId",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<(Guid ProfileId, int ResultCode)> UpsertAsync(CustomerProfile profile)
    {
        using var connection = CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@UserId", profile.UserId, DbType.Guid);
        parameters.Add("@IdentificationNumber", profile.IdentificationNumber, DbType.String);
        parameters.Add("@FirstName", profile.FirstName, DbType.String);
        parameters.Add("@LastName", profile.LastName, DbType.String);
        parameters.Add("@BirthDate", profile.BirthDate?.ToDateTime(TimeOnly.MinValue), DbType.Date);
        parameters.Add("@Phone", profile.Phone, DbType.String);
        parameters.Add("@ProfileId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        parameters.Add("@ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "usp_CustomerProfile_InsertOrUpdate",
            parameters,
            commandType: CommandType.StoredProcedure);

        var profileId = parameters.Get<Guid>("@ProfileId");
        var resultCode = parameters.Get<int>("@ResultCode");

        return (profileId, resultCode);
    }
}
