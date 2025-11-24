# Zerquiz Platform - Tüm Servisleri Başlat
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "ZERQUIZ PLATFORM - TÜM SERVİSLERİ BAŞLAT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/8] Core Service başlatılıyor (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\core\Zerquiz.Core.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[2/8] Identity Service başlatılıyor (Port 5002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\identity\Zerquiz.Identity.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[3/8] Curriculum Service başlatılıyor (Port 5003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\curriculum\Zerquiz.Curriculum.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[4/8] Questions Service başlatılıyor (Port 5004)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\questions\Zerquiz.Questions.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[5/8] Exams Service başlatılıyor (Port 5005)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\exams\Zerquiz.Exams.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[6/8] Grading Service başlatılıyor (Port 5006)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\grading\Zerquiz.Grading.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[7/8] Royalty Service başlatılıyor (Port 5007)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\royalty\Zerquiz.Royalty.Api; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[8/8] API Gateway başlatılıyor (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd gateway\Zerquiz.Gateway; dotnet run" -WindowStyle Normal

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ TÜM SERVİSLER BAŞLATILDI!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Servis Adresleri:" -ForegroundColor White
Write-Host "   - API Gateway:        http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Core Service:       http://localhost:5001/swagger" -ForegroundColor Gray
Write-Host "   - Identity Service:   http://localhost:5002/swagger" -ForegroundColor Gray
Write-Host "   - Curriculum Service: http://localhost:5003/swagger" -ForegroundColor Gray
Write-Host "   - Questions Service:  http://localhost:5004/swagger" -ForegroundColor Gray
Write-Host "   - Exams Service:      http://localhost:5005/swagger" -ForegroundColor Gray
Write-Host "   - Grading Service:    http://localhost:5006/swagger" -ForegroundColor Gray
Write-Host "   - Royalty Service:    http://localhost:5007/swagger" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Her servis kendi penceresinde çalışıyor." -ForegroundColor Cyan
Write-Host "💡 Durdurmak için her penceride Ctrl+C yapın." -ForegroundColor Cyan
Write-Host ""
Write-Host "Servislerin baslamasi 20-30 saniye surebilir..." -ForegroundColor Yellow
Write-Host ""

