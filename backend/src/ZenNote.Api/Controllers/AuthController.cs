using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ZenNote.Application.Features.Auth;

namespace ZenNote.Api.Controllers;

public class AuthController : ApiControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult> Login([FromBody] LoginQuery request)
    {
        var result = await Mediator.Send(request);
        return HandleResult(result);
    }
}
