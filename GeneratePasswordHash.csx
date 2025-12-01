using System;
using System.Security.Cryptography;
using System.Text;

const int SaltSize = 16;
const int HashSize = 32;
const int Iterations = 100000;

string HashPassword(string password)
{
    var salt = RandomNumberGenerator.GetBytes(SaltSize);
    var hash = Rfc2898DeriveBytes.Pbkdf2(
        Encoding.UTF8.GetBytes(password),
        salt,
        Iterations,
        HashAlgorithmName.SHA256,
        HashSize);

    var hashBytes = new byte[SaltSize + HashSize];
    Array.Copy(salt, 0, hashBytes, 0, SaltSize);
    Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

    return Convert.ToBase64String(hashBytes);
}

var password = "Admin123!";
var hashed = HashPassword(password);
Console.WriteLine($"Password: {password}");
Console.WriteLine($"Hashed: {hashed}");

