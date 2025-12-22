@echo off
echo ========================================
echo  ZERQUIZ - Servis Durum Kontrolu
echo ========================================
echo.

REM Port kontrol fonksiyonu
set "services=5001:Identity 5002:Core 5003:Exams 5004:Grading 5005:Questions 5007:Curriculum 5008:Content 5009:Lessons 5173:Frontend"

for %%s in (%services%) do (
    for /f "tokens=1,2 delims=:" %%a in ("%%s") do (
        netstat -ano | findstr ":%%a " > nul 2>&1
        if !errorlevel! equ 0 (
            echo [32m✓[0m Port %%a ^(%%b^): ÇALIŞIYOR
        ) else (
            echo [31m✗[0m Port %%a ^(%%b^): KAPALI
        )
    )
)

echo.
echo ========================================
echo  Detaylı Port Bilgisi
echo ========================================
netstat -ano | findstr "5001 5002 5003 5004 5005 5007 5008 5009 5173"

echo.
pause




