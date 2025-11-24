@echo off
echo ========================================
echo Zerquiz Frontend Baslatiyor...
echo ========================================
echo.

cd frontend\zerquiz-web

echo Node modules kontrol ediliyor...
if not exist "node_modules" (
    echo npm install yapiliyor...
    call npm install
)

echo.
echo Frontend baslatiliyor (Port 3000)...
echo.
call npm run dev

