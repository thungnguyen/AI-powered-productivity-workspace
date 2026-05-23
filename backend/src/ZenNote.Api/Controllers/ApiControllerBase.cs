using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ZenNote.Application.Common.Models;

namespace ZenNote.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender? _mediator;

    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected ActionResult HandleResult(Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                data = (object?)null,
                success = true,
                message = "Operation completed successfully.",
                errors = (object?)null
            });
        }

        return BadRequest(new
        {
            data = (object?)null,
            success = false,
            message = result.Error.Message,
            errors = new { code = result.Error.Code }
        });
    }

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                data = result.Value,
                success = true,
                message = (string?)null,
                errors = (object?)null
            });
        }

        return BadRequest(new
        {
            data = (object?)null,
            success = false,
            message = result.Error.Message,
            errors = new { code = result.Error.Code }
        });
    }
}
