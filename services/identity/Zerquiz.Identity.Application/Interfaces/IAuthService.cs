using Zerquiz.Identity.Application.DTOs;
using Zerquiz.Identity.Domain.Entities;

namespace Zerquiz.Identity.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(string email, string password);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task RevokeTokenAsync(string refreshToken);
    Task<User?> GetUserByIdAsync(Guid userId);
}

