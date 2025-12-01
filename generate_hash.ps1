# PowerShell script to generate password hash
Add-Type -AssemblyName System.Security

$password = "Admin123!"
$SaltSize = 16
$HashSize = 32
$Iterations = 100000

# Generate salt
$salt = New-Object byte[] $SaltSize
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($salt)

# Generate hash
$pbkdf2 = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($password, $salt, $Iterations, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
$hash = $pbkdf2.GetBytes($HashSize)

# Combine salt + hash
$hashBytes = New-Object byte[] ($SaltSize + $HashSize)
[Array]::Copy($salt, 0, $hashBytes, 0, $SaltSize)
[Array]::Copy($hash, 0, $hashBytes, $SaltSize, $HashSize)

# Convert to Base64
$hashedPassword = [Convert]::ToBase64String($hashBytes)

Write-Host ""
Write-Host "Password: $password" -ForegroundColor Green
Write-Host "Hashed Password (Base64):" -ForegroundColor Yellow
Write-Host $hashedPassword
Write-Host ""
Write-Host "SQL Update Command:" -ForegroundColor Cyan
Write-Host "UPDATE identity_schema.users SET ""PasswordHash"" = '$hashedPassword' WHERE ""Email"" = 'admin@zerquiz.com';"
Write-Host ""

