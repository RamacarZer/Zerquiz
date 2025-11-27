# Zerquiz Platform - Quick Start All Services
# Bu script tum servisleri hizlica baslatir

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ZERQUIZ HIZLI BASLATMA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$baseDir = "F:\yeni_projeler\Zerquiz"

$services = @(
    @{Name="Core"; Path="services\core\Zerquiz.Core.Api"; Port=5001},
    @{Name="Identity"; Path="services\identity\Zerquiz.Identity.Api"; Port=5002},
    @{Name="Curriculum"; Path="services\curriculum\Zerquiz.Curriculum.Api"; Port=5003},
    @{Name="Questions"; Path="services\questions\Zerquiz.Questions.Api"; Port=5004},
    @{Name="Exams"; Path="services\exams\Zerquiz.Exams.Api"; Port=5005},
    @{Name="Grading"; Path="services\grading\Zerquiz.Grading.Api"; Port=5006},
    @{Name="Royalty"; Path="services\royalty\Zerquiz.Royalty.Api"; Port=5007},
    @{Name="Presentation"; Path="services\presentation\Zerquiz.Presentation.Api"; Port=5008},
    @{Name="Finance"; Path="services\finance\Zerquiz.Finance.Api"; Port=5009},
    @{Name="Gateway"; Path="gateway\Zerquiz.Gateway"; Port=5000}
)

foreach ($service in $services) {
    $fullPath = Join-Path $baseDir $service.Path
    
    if (Test-Path $fullPath) {
        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; dotnet run"
        Start-Sleep -Milliseconds 800
    } else {
        Write-Host "[SKIP] $($service.Name) - Not found at $fullPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TUM SERVISLER BASLATILDI!" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Gateway:      http://localhost:5000" -ForegroundColor White
Write-Host "Core:         http://localhost:5001/swagger" -ForegroundColor White
Write-Host "Identity:     http://localhost:5002/swagger" -ForegroundColor White
Write-Host "Curriculum:   http://localhost:5003/swagger" -ForegroundColor White
Write-Host "Questions:    http://localhost:5004/swagger" -ForegroundColor White
Write-Host "Exams:        http://localhost:5005/swagger" -ForegroundColor White
Write-Host "Grading:      http://localhost:5006/swagger" -ForegroundColor White
Write-Host "Royalty:      http://localhost:5007/swagger" -ForegroundColor White
Write-Host "Presentation: http://localhost:5008/swagger" -ForegroundColor White
Write-Host "Finance:      http://localhost:5009/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Frontend:     http://localhost:3001" -ForegroundColor Yellow
Write-Host ""

