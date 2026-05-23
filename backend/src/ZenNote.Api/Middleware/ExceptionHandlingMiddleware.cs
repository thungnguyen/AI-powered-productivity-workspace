using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using ZenNote.Application.Common.Exceptions;

namespace ZenNote.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = StatusCodes.Status500InternalServerError;
        string message = "An internal server error occurred.";
        object? errors = null;

        switch (exception)
        {
            case ValidationException valEx:
                statusCode = StatusCodes.Status400BadRequest;
                message = valEx.Message;
                errors = valEx.Errors;
                break;
            case NotFoundException nfEx:
                statusCode = StatusCodes.Status404NotFound;
                message = nfEx.Message;
                break;
            case UnauthorizedException unEx:
                statusCode = StatusCodes.Status401Unauthorized;
                message = unEx.Message;
                break;
            case ForbiddenException fbEx:
                statusCode = StatusCodes.Status403Forbidden;
                message = fbEx.Message;
                break;
        }

        context.Response.StatusCode = statusCode;

        var response = new
        {
            data = (object?)null,
            success = false,
            message = _env.IsDevelopment() && statusCode == StatusCodes.Status500InternalServerError ? exception.ToString() : message,
            errors = errors
        };

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}
