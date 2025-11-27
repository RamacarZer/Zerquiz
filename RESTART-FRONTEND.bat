@echo off
echo ================================================
echo ZERQUIZ - FRONTEND RESTART
echo ================================================
echo.
echo Server yeniden baslatiliyor...
echo.

cd frontend\zerquiz-web

echo Onceki server durduruluyor...
taskkill /F /IM node.exe 2>nul

echo.
echo 3 saniye bekleniyor...
timeout /t 3 /nobreak >nul

echo.
echo Yeni server baslatiliyor...
echo.
start cmd /k "npm run dev"

echo.
echo ================================================
echo Server baslatildi!
echo Tarayici: http://localhost:3001
echo ================================================
echo.
echo Yeni moduller:
echo   1. http://localhost:3001/finance/advanced
echo   2. http://localhost:3001/contracts  
echo   3. http://localhost:3001/communication
echo ================================================
pause

