using System;
using System.Security.Cryptography;
using System.Text;

// Demo şifre için hash üret: Demo123!
string password = "Demo123!";

const int SaltSize = 16;
const int HashSize = 32;
const int Iterations = 100000;

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

string hashedPassword = Convert.ToBase64String(hashBytes);

Console.WriteLine($"Password: {password}");
Console.WriteLine($"Hashed: {hashedPassword}");

