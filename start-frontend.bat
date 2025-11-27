@echo off
echo ==========================================
echo   Zerquiz Frontend Starter
echo ==========================================
echo.

cd /d "%~dp0frontend\zerquiz-web"

echo [1/3] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo [2/3] Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo.
echo [3/3] Starting Vite Development Server...
echo.
echo Server will start at: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.
echo ==========================================
echo.

npm run dev

pause
