using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ZenNote.Api.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var request = context.Request;

        _logger.LogInformation("HTTP Request Started: {Method} {Path}", request.Method, request.Path);

        try
        {
            await _next(context);
            stopwatch.Stop();

            _logger.LogInformation("HTTP Request Finished: {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds}ms",
                request.Method, request.Path, context.Response.StatusCode, stopwatch.ElapsedMilliseconds);
        }
        catch
        {
            stopwatch.Stop();
            _logger.LogInformation("HTTP Request Failed: {Method} {Path} in {ElapsedMilliseconds}ms",
                request.Method, request.Path, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
