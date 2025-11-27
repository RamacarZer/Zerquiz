# Zerquiz Platform - Start All Services
# This script starts all microservices in separate terminal windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ZERQUIZ SERVICES STARTUP" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$services = @(
    @{Name="Gateway"; Path="gateway/Zerquiz.Gateway"; Port=5000; Color="Cyan"},
    @{Name="Core"; Path="services/core/Zerquiz.Core.Api"; Port=5001; Color="Blue"},
    @{Name="Identity"; Path="services/identity/Zerquiz.Identity.Api"; Port=5002; Color="Green"},
    @{Name="Curriculum"; Path="services/curriculum/Zerquiz.Curriculum.Api"; Port=5003; Color="Yellow"},
    @{Name="Questions"; Path="services/questions/Zerquiz.Questions.Api"; Port=5004; Color="Magenta"},
    @{Name="Exams"; Path="services/exams/Zerquiz.Exams.Api"; Port=5005; Color="Red"},
    @{Name="Grading"; Path="services/grading/Zerquiz.Grading.Api"; Port=5006; Color="DarkCyan"},
    @{Name="Royalty"; Path="services/royalty/Zerquiz.Royalty.Api"; Port=5007; Color="DarkYellow"},
    @{Name="Presentation"; Path="services/presentation/Zerquiz.Presentation.Api"; Port=5008; Color="DarkMagenta"},
    @{Name="Finance"; Path="services/finance/Zerquiz.Finance.Api"; Port=5009; Color="DarkGreen"}
)

Write-Host "Starting all services in new terminal windows..." -ForegroundColor Cyan
Write-Host ""

foreach ($service in $services) {
    $scriptDir = Split-Path -Parent $PSScriptRoot
    $projectPath = Join-Path -Path $scriptDir -ChildPath $service.Path
    
    if (Test-Path $projectPath) {
        Write-Host "Starting: $($service.Name) Service (Port $($service.Port))..." -ForegroundColor $service.Color
        
        # Start in new terminal window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; Write-Host '$($service.Name) Service - Port $($service.Port)' -ForegroundColor $($service.Color); dotnet run"
        
        Start-Sleep -Milliseconds 500
    } else {
        Write-Host "[SKIP] $($service.Name) - Project not found at $projectPath" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Gateway:      http://localhost:5000" -ForegroundColor White
Write-Host "Core:         http://localhost:5001" -ForegroundColor White
Write-Host "Identity:     http://localhost:5002" -ForegroundColor White
Write-Host "Curriculum:   http://localhost:5003" -ForegroundColor White
Write-Host "Questions:    http://localhost:5004" -ForegroundColor White
Write-Host "Exams:        http://localhost:5005" -ForegroundColor White
Write-Host "Grading:      http://localhost:5006" -ForegroundColor White
Write-Host "Royalty:      http://localhost:5007" -ForegroundColor White
Write-Host "Presentation: http://localhost:5008" -ForegroundColor White
Write-Host "Finance:      http://localhost:5009" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor Yellow
Write-Host ""

