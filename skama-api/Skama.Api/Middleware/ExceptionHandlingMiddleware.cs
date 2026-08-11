using System.Net.Mime;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Skama.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);

        var (statusCode, title, detail) = MapException(exception);

        context.Response.Clear();
        context.Response.ContentType = MediaTypeNames.Application.Json;
        context.Response.StatusCode = statusCode;

        var problem = new ProblemDetails
        {
            Title = title,
            Detail = detail,
            Status = statusCode,
            Instance = context.Request.Path
        };

        if (_environment.IsDevelopment() && exception is not SqlException)
        {
            problem.Extensions["exception"] = exception.GetType().Name;
            problem.Extensions["message"] = exception.Message;
        }

        await context.Response.WriteAsync(JsonSerializer.Serialize(problem, JsonOptions));
    }

    private static (int StatusCode, string Title, string Detail) MapException(Exception exception)
    {
        if (exception is SqlException sqlException)
        {
            return sqlException.Number switch
            {
                4060 => (
                    StatusCodes.Status503ServiceUnavailable,
                    "Error de base de datos",
                    "No se pudo abrir la base de datos \"skama-db\". Verifica que exista en la instancia configurada y que tu usuario de Windows tenga permiso."),
                18456 or 18452 => (
                    StatusCodes.Status503ServiceUnavailable,
                    "Error de autenticación a la base de datos",
                    "El inicio de sesión en SQL Server falló. Revisa la cadena de conexión y los permisos del usuario."),
                53 or -1 or 2 or 40 => (
                    StatusCodes.Status503ServiceUnavailable,
                    "Error de conexión a la base de datos",
                    "No se pudo conectar a SQL Server. Verifica que el servicio esté en ejecución y que el nombre de la instancia en appsettings sea correcto."),
                _ => (
                    StatusCodes.Status503ServiceUnavailable,
                    "Error de base de datos",
                    $"No se pudo completar la operación en la base de datos (código SQL {sqlException.Number}).")
            };
        }

        return (
            StatusCodes.Status500InternalServerError,
            "Error interno del servidor",
            "Ocurrió un error inesperado. Intenta de nuevo más tarde.");
    }
}
