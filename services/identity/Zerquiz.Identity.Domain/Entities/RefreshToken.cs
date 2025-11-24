using Zerquiz.Shared.Contracts.Domain;

namespace Zerquiz.Identity.Domain.Entities;

/// <summary>
/// RefreshToken - Özel tablo, BaseEntity'den türemez çünkü tenant'a bağlı değil
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}


