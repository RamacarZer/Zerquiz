# PowerShell Script to Seed Demo Data
# Run this from project root: .\scripts\SeedDemoData.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ZERQUIZ DEMO DATA SEEDER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# PostgreSQL connection details
$PG_HOST = "localhost"
$PG_PORT = "5432"
$PG_USER = "postgres"
$PG_PASSWORD = "Sanez.579112"
$PG_DATABASE = "zerquiz_db"
$SQL_FILE = "F:\yeni_projeler\Zerquiz\infra\docker\seed-demo-data.sql"

Write-Host "`nAttempting to seed demo data..." -ForegroundColor Yellow

# Try using docker exec if PostgreSQL is in Docker
try {
    Write-Host "`nTrying Docker method..." -ForegroundColor Yellow
    docker exec -i zerquiz_postgres psql -U $PG_USER -d $PG_DATABASE < $SQL_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Demo data seeded successfully via Docker!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Docker method failed, trying alternative..." -ForegroundColor Yellow
}

# Alternative: Use Npgsql from .NET
Write-Host "`nTrying .NET Npgsql method..." -ForegroundColor Yellow

$csharpCode = @"
using System;
using Npgsql;
using System.IO;

public class SeedData
{
    public static void Main()
    {
        string connectionString = "Host=localhost;Port=5432;Database=zerquiz_db;Username=postgres;Password=Sanez.579112";
        string sqlFile = @"$SQL_FILE";
        
        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            
            string sql = File.ReadAllText(sqlFile);
            
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.ExecuteNonQuery();
            
            Console.WriteLine("Demo data seeded successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Environment.Exit(1);
        }
    }
}
"@

# Save and compile C# code
$tempCs = [System.IO.Path]::GetTempFileName() + ".cs"
$tempExe = [System.IO.Path]::GetTempFileName() + ".exe"

Set-Content -Path $tempCs -Value $csharpCode

# Compile
Write-Host "Compiling seeder..." -ForegroundColor Yellow
csc /out:$tempExe /reference:"C:\Program Files\dotnet\shared\Microsoft.NETCore.App\9.0.0\System.Runtime.dll" $tempCs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Running seeder..." -ForegroundColor Yellow
    & $tempExe
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Demo data seeded successfully!" -ForegroundColor Green
    }
}

# Cleanup
Remove-Item $tempCs -ErrorAction SilentlyContinue
Remove-Item $tempExe -ErrorAction SilentlyContinue

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SEEDING COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

