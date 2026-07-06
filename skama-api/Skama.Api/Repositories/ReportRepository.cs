using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Skama.Api.Models;

namespace Skama.Api.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly IConfiguration _configuration;

    public ReportRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection CreateConnection() =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<SalesByPeriodReport>> GetSalesByPeriodAsync(DateOnly startDate, DateOnly endDate)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<SalesByPeriodReport>(
            "usp_Report_SalesByPeriod",
            new { StartDate = startDate, EndDate = endDate },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<SalesByProductReport>> GetSalesByProductAsync(DateOnly startDate, DateOnly endDate)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<SalesByProductReport>(
            "usp_Report_SalesByProduct",
            new { StartDate = startDate, EndDate = endDate },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<TopProductReport>> GetTopProductsAsync(DateOnly startDate, DateOnly endDate, int top)
    {
        using var connection = CreateConnection();

        return await connection.QueryAsync<TopProductReport>(
            "usp_Report_TopProducts",
            new { StartDate = startDate, EndDate = endDate, Top = top },
            commandType: CommandType.StoredProcedure);
    }
}
