using System.Security.Cryptography;

namespace Zerquiz.Shared.Common.Helpers;

/// <summary>
/// Helper for generating random tokens
/// </summary>
public static class TokenGenerator
{
    public static string GenerateToken(int length = 32)
    {
        var bytes = RandomNumberGenerator.GetBytes(length);
        return Convert.ToBase64String(bytes)
            .Replace("+", "")
            .Replace("/", "")
            .Replace("=", "")
            .Substring(0, length);
    }

    public static string GenerateRefreshToken()
    {
        return GenerateToken(64);
    }

    public static string GenerateVerificationToken()
    {
        return GenerateToken(32);
    }
}

