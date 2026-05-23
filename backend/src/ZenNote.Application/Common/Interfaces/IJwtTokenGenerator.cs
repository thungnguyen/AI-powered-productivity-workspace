using ZenNote.Domain.Entities;

namespace ZenNote.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
