# Zerquiz Servislerini Başlatma Scripti

Write-Host "🚀 Zerquiz Servisleri Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# Core Service (Port 5001)
Write-Host "📦 Core Service başlatılıyor (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Identity Service (Port 5002)
Write-Host "🔐 Identity Service başlatılıyor (Port 5002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Curriculum Service (Port 5003)
Write-Host "📚 Curriculum Service başlatılıyor (Port 5003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\curriculum\Zerquiz.Curriculum.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Questions Service (Port 5004)
Write-Host "❓ Questions Service başlatılıyor (Port 5004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\questions\Zerquiz.Questions.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Exams Service (Port 5005)
Write-Host "📝 Exams Service başlatılıyor (Port 5005)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\exams\Zerquiz.Exams.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Grading Service (Port 5006)
Write-Host "📊 Grading Service başlatılıyor (Port 5006)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\grading\Zerquiz.Grading.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Royalty Service (Port 5007)
Write-Host "💰 Royalty Service başlatılıyor (Port 5007)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\services\royalty\Zerquiz.Royalty.Api; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# API Gateway (Port 5000)
Write-Host "🌐 API Gateway başlatılıyor (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\yeni_projeler\Zerquiz\gateway\Zerquiz.Gateway; dotnet run" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Tüm servisler başlatıldı!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Erişim Adresleri:" -ForegroundColor Yellow
Write-Host "   • API Gateway: http://localhost:5000" -ForegroundColor White
Write-Host "   • Core Service: http://localhost:5001/swagger" -ForegroundColor White
Write-Host "   • Identity Service: http://localhost:5002/swagger" -ForegroundColor White
Write-Host "   • Curriculum Service: http://localhost:5003/swagger" -ForegroundColor White
Write-Host "   • Questions Service: http://localhost:5004/swagger" -ForegroundColor White
Write-Host "   • Exams Service: http://localhost:5005/swagger" -ForegroundColor White
Write-Host "   • Grading Service: http://localhost:5006/swagger" -ForegroundColor White
Write-Host "   • Royalty Service: http://localhost:5007/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

