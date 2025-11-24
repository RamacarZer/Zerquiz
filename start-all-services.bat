@echo off
echo ========================================
echo Zerquiz Servisleri Baslatiyor...
echo ========================================
echo.

echo [1/8] Identity Service baslatiliyor (Port 5002)...
start "Identity Service" cmd /k "cd services\identity\Zerquiz.Identity.Api && dotnet run"
timeout /t 5 /nobreak >nul

echo [2/8] Core Service baslatiliyor (Port 5001)...
start "Core Service" cmd /k "cd services\core\Zerquiz.Core.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [3/8] Curriculum Service baslatiliyor (Port 5003)...
start "Curriculum Service" cmd /k "cd services\curriculum\Zerquiz.Curriculum.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [4/8] Questions Service baslatiliyor (Port 5004)...
start "Questions Service" cmd /k "cd services\questions\Zerquiz.Questions.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [5/8] Exams Service baslatiliyor (Port 5005)...
start "Exams Service" cmd /k "cd services\exams\Zerquiz.Exams.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [6/8] Grading Service baslatiliyor (Port 5006)...
start "Grading Service" cmd /k "cd services\grading\Zerquiz.Grading.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [7/8] Royalty Service baslatiliyor (Port 5007)...
start "Royalty Service" cmd /k "cd services\royalty\Zerquiz.Royalty.Api && dotnet run"
timeout /t 3 /nobreak >nul

echo [8/8] API Gateway baslatiliyor (Port 5000)...
start "API Gateway" cmd /k "cd gateway\Zerquiz.Gateway && dotnet run"

echo.
echo ========================================
echo TUM SERVISLER BASLATILDI!
echo ========================================
echo.
echo Swagger UI Erisimleri:
echo   - Identity:    http://localhost:5002/swagger
echo   - Core:        http://localhost:5001/swagger
echo   - Curriculum:  http://localhost:5003/swagger
echo   - Questions:   http://localhost:5004/swagger
echo   - Exams:       http://localhost:5005/swagger
echo   - Grading:     http://localhost:5006/swagger
echo   - Royalty:     http://localhost:5007/swagger
echo   - API Gateway: http://localhost:5000
echo.
echo Frontend baslatmak icin:
echo   cd frontend\zerquiz-web
echo   npm run dev
echo.
pause
