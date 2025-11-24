# ZERQUIZ - TÜM SERVİSLER MANUEL BAŞLATMA

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "ZERQUIZ - SERVISLER BASLATILIYOR" -ForegroundColor Cyan  
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$root = "F:\yeni_projeler\Zerquiz"

Write-Host "[1/8] Core Service (Port 5001)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\core\Zerquiz.Core.Api'; dotnet run"

Write-Host "[2/8] Identity Service (Port 5002)" -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\identity\Zerquiz.Identity.Api'; dotnet run"

Write-Host "[3/8] Curriculum Service (Port 5003)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\curriculum\Zerquiz.Curriculum.Api'; dotnet run"

Write-Host "[4/8] Questions Service (Port 5004)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\questions\Zerquiz.Questions.Api'; dotnet run"

Write-Host "[5/8] Exams Service (Port 5005)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\exams\Zerquiz.Exams.Api'; dotnet run"

Write-Host "[6/8] Grading Service (Port 5006)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\grading\Zerquiz.Grading.Api'; dotnet run"

Write-Host "[7/8] Royalty Service (Port 5007)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\services\royalty\Zerquiz.Royalty.Api'; dotnet run"

Write-Host "[8/8] API Gateway (Port 5000)" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\gateway\Zerquiz.Gateway'; dotnet run"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "TAMAMLANDI!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Swagger adresleri:" -ForegroundColor White
Write-Host "  http://localhost:5001/swagger - Core" -ForegroundColor Gray
Write-Host "  http://localhost:5002/swagger - Identity" -ForegroundColor Gray  
Write-Host "  http://localhost:5003/swagger - Curriculum" -ForegroundColor Gray
Write-Host "  http://localhost:5004/swagger - Questions" -ForegroundColor Gray
Write-Host "  http://localhost:5005/swagger - Exams" -ForegroundColor Gray
Write-Host "  http://localhost:5006/swagger - Grading" -ForegroundColor Gray
Write-Host "  http://localhost:5007/swagger - Royalty" -ForegroundColor Gray
Write-Host "  http://localhost:5000 - API Gateway" -ForegroundColor Gray
Write-Host ""

