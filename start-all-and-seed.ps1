# Start all backend services and seed demo data

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ZERQUIZ - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop any existing dotnet processes
Write-Host "Stopping existing services..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start Core Service
Write-Host "`nStarting Core Service (port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api'; dotnet run --urls 'http://localhost:5001'" -WindowStyle Minimized

# Start Identity Service
Write-Host "Starting Identity Service (port 5002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api'; dotnet run --urls 'http://localhost:5002'" -WindowStyle Minimized

# Start Curriculum Service
Write-Host "Starting Curriculum Service (port 5003)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'F:\yeni_projeler\Zerquiz\services\curriculum\Zerquiz.Curriculum.Api'; dotnet run --urls 'http://localhost:5003'" -WindowStyle Minimized

# Wait for services to start
Write-Host "`nWaiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Seed Core Service
Write-Host "`n[CORE] Seeding demo data..." -ForegroundColor Cyan
try {
    $coreResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/seed/demo-data" -Method POST -ErrorAction Stop
    Write-Host "✓ Core Service seeded: $($coreResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Core Service seed failed: $_" -ForegroundColor Red
}

# Seed Curriculum Service
Write-Host "`n[CURRICULUM] Seeding demo data..." -ForegroundColor Cyan
try {
    $currResponse = Invoke-RestMethod -Uri "http://localhost:5003/api/seed/demo-data" -Method POST -ErrorAction Stop
    Write-Host "✓ Curriculum Service seeded: $($currResponse.message)" -ForegroundColor Green
    Write-Host "  - Education Models: $($currResponse.counts.educationModels)" -ForegroundColor White
    Write-Host "  - Subjects: $($currResponse.counts.subjects)" -ForegroundColor White
    Write-Host "  - Topics: $($currResponse.counts.topics)" -ForegroundColor White
    Write-Host "  - Learning Outcomes: $($currResponse.counts.learningOutcomes)" -ForegroundColor White
} catch {
    Write-Host "✗ Curriculum Service seed failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ALL SERVICES RUNNING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nServices:" -ForegroundColor Cyan
Write-Host "  Core:       http://localhost:5001" -ForegroundColor White
Write-Host "  Identity:   http://localhost:5002" -ForegroundColor White
Write-Host "  Curriculum: http://localhost:5003" -ForegroundColor White
Write-Host "`nFrontend (should start separately):" -ForegroundColor Cyan
Write-Host "  cd frontend/zerquiz-web" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

