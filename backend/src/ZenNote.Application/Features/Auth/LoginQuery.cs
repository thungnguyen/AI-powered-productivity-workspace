using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using ZenNote.Application.Common.Interfaces;
using ZenNote.Application.Common.Models;
using ZenNote.Domain.Entities;

namespace ZenNote.Application.Features.Auth;

public record LoginQuery(string Email, string Password) : IRequest<Result<string>>;

public class LoginQueryValidator : AbstractValidator<LoginQuery>
{
    public LoginQueryValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
    }
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, Result<string>>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginQueryHandler(IJwtTokenGenerator jwtTokenGenerator)
    {
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<string>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        if (request.Email == "admin@zennote.com" && request.Password == "admin123")
        {
            var user = new User
            {
                Email = request.Email,
                DisplayName = "ZenNote Admin",
                PasswordHash = "hashed_admin_pwd",
                IsActive = true
            };

            var token = _jwtTokenGenerator.GenerateToken(user);
            return Result.Success(token);
        }

        return Result.Failure<string>(new Error("Auth.InvalidCredentials", "Invalid email or password."));
    }
}
