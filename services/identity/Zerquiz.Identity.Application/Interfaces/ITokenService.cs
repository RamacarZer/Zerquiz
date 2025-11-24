using Zerquiz.Identity.Domain.Entities;

namespace Zerquiz.Identity.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles, IEnumerable<string> permissions);
    string GenerateRefreshToken();
    Guid? ValidateToken(string token);
}

