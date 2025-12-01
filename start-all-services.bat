@echo off
echo ========================================
echo  ZERQUIZ PLATFORM - Servis Başlatıcı
echo ========================================
echo.

REM Identity Service
echo [1/9] Identity Service başlatılıyor...
start "Identity Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\identity\Zerquiz.Identity.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Core Service
echo [2/9] Core Service başlatılıyor...
start "Core Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\core\Zerquiz.Core.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Content Service
echo [3/9] Content Service başlatılıyor...
start "Content Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\content\Zerquiz.Content.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Lessons Service
echo [4/9] Lessons Service başlatılıyor...
start "Lessons Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\lessons\Zerquiz.Lessons.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Questions Service
echo [5/9] Questions Service başlatılıyor...
start "Questions Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\questions\Zerquiz.Questions.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Exams Service
echo [6/9] Exams Service başlatılıyor...
start "Exams Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\exams\Zerquiz.Exams.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Grading Service
echo [7/9] Grading Service başlatılıyor...
start "Grading Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\grading\Zerquiz.Grading.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Curriculum Service
echo [8/9] Curriculum Service başlatılıyor...
start "Curriculum Service" cmd /k "cd /d F:\yeni_projeler\Zerquiz\services\curriculum\Zerquiz.Curriculum.Api && dotnet run"
timeout /t 5 /nobreak > nul

REM Frontend
echo [9/9] Frontend başlatılıyor...
start "Frontend" cmd /k "cd /d F:\yeni_projeler\Zerquiz\frontend\zerquiz-web && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo  TÜM SERVİSLER BAŞLATILDI!
echo ========================================
echo.
echo Service URLs:
echo  - Identity:    http://localhost:5001/swagger
echo  - Core:        http://localhost:5002/swagger
echo  - Content:     http://localhost:5008/swagger
echo  - Lessons:     http://localhost:5009/swagger
echo  - Questions:   http://localhost:5005/swagger
echo  - Exams:       http://localhost:5003/swagger
echo  - Grading:     http://localhost:5004/swagger
echo  - Curriculum:  http://localhost:5007/swagger
echo  - Frontend:    http://localhost:5173
echo.
echo Login:
echo  Email:    admin@zerquiz.com
echo  Password: Admin123!
echo.
echo Her servise ayrı pencere açıldı!
echo Servisleri durdurmak için pencereleri kapatın.
echo.
pause
