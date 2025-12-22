# Zerquiz Platform - Start All Services
# Run this script from the project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ZERQUIZ PLATFORM - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from correct directory
if (!(Test-Path "services")) {
    Write-Host "ERROR: Please run this script from the project root directory!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/6] Starting Identity Service (Port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/identity/Zerquiz.Identity.Api; Write-Host 'Identity Service Starting...' -ForegroundColor Cyan; dotnet run"
Start-Sleep -Seconds 5

Write-Host "[2/6] Starting Core Service (Port 5002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/core/Zerquiz.Core.Api; Write-Host 'Core Service Starting...' -ForegroundColor Cyan; dotnet run"
Start-Sleep -Seconds 5

Write-Host "[3/6] Starting Content Service (Port 5008)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/content/Zerquiz.Content.Api; Write-Host 'Content Service Starting...' -ForegroundColor Cyan; dotnet run"
Start-Sleep -Seconds 5

Write-Host "[4/6] Starting Lessons Service (Port 5009)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/lessons/Zerquiz.Lessons.Api; Write-Host 'Lessons Service Starting...' -ForegroundColor Cyan; dotnet run"
Start-Sleep -Seconds 5

Write-Host "[5/6] Starting Grading Service (Port 5004)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/grading/Zerquiz.Grading.Api; Write-Host 'Grading Service Starting...' -ForegroundColor Cyan; dotnet run"
Start-Sleep -Seconds 8

Write-Host "[6/6] Starting Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/zerquiz-web; Write-Host 'Frontend Starting...' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ALL SERVICES STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - Identity:  http://localhost:5001/swagger" -ForegroundColor Yellow
Write-Host "  - Core:      http://localhost:5002/swagger" -ForegroundColor Yellow
Write-Host "  - Content:   http://localhost:5008/swagger" -ForegroundColor Yellow
Write-Host "  - Lessons:   http://localhost:5009/swagger" -ForegroundColor Yellow
Write-Host "  - Grading:   http://localhost:5004/swagger" -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Cyan
Write-Host "  - Web App:   http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Default Login:" -ForegroundColor Cyan
Write-Host "  - Email:     admin@zerquiz.com" -ForegroundColor White
Write-Host "  - Password:  Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Gray
Write-Host ""

# Keep script running
Read-Host "Press Enter to exit"




