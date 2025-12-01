using System;
using System.Security.Cryptography;
using System.Text;

const int SaltSize = 16;
const int HashSize = 32;
const int Iterations = 100000;

string password = "Admin123!";

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

var hashedPassword = Convert.ToBase64String(hashBytes);

Console.WriteLine($"Password: {password}");
Console.WriteLine($"Hashed Password (Base64):");
Console.WriteLine(hashedPassword);
Console.WriteLine($"\nSQL Update Command:");
Console.WriteLine($"UPDATE identity_schema.users SET \"PasswordHash\" = '{hashedPassword}' WHERE \"Email\" = 'admin@zerquiz.com';");

