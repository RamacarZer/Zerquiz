# Zerquiz Platform - Service Health Check

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ZERQUIZ - Health Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{ Name = "Identity"; Url = "http://localhost:5001/swagger/index.html" },
    @{ Name = "Core"; Url = "http://localhost:5002/swagger/index.html" },
    @{ Name = "Content"; Url = "http://localhost:5008/swagger/index.html" },
    @{ Name = "Lessons"; Url = "http://localhost:5009/swagger/index.html" },
    @{ Name = "Grading"; Url = "http://localhost:5004/swagger/index.html" },
    @{ Name = "Frontend"; Url = "http://localhost:5173" }
)

foreach ($service in $services) {
    Write-Host "Checking $($service.Name)..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $service.Url -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
        }
    }
    catch {
        Write-Host " DOWN" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Health check complete!" -ForegroundColor Cyan




