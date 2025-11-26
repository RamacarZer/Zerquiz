Write-Host "=== HIZLI VERI YUKLEME ===" -ForegroundColor Green
Write-Host ""

# Identity Service
Write-Host "[1] Identity Service (Kullanicilar & Roller)..." -NoNewline
try {
    $r = Invoke-RestMethod -Method POST -Uri "http://localhost:5002/api/quick-seed/all" -TimeoutSec 10
    Write-Host " OK ($($r.users) user, $($r.roles) role)" -ForegroundColor Green
} catch {
    Write-Host " FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Questions Service
Write-Host "[2] Questions Service (Zorluk & Sunum)..." -NoNewline
try {
    $r = Invoke-RestMethod -Method POST -Uri "http://localhost:5004/api/quick-seed/all" -TimeoutSec 10
    Write-Host " OK ($($r.difficulties) zorluk, $($r.presentations) sunum)" -ForegroundColor Green
} catch {
    Write-Host " FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Curriculum Service (existing)
Write-Host "[3] Curriculum Service (Branslar)..." -NoNewline
try {
    $r = Invoke-RestMethod -Method POST -Uri "http://localhost:5003/api/curriculum-seed/all-subjects" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
} catch {
    if ($_ -like "*already*") {
        Write-Host " ZATEN VAR" -ForegroundColor Yellow
    } else {
        Write-Host " FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TAMAMLANDI ===" -ForegroundColor Green
Write-Host ""
Write-Host "Simdi tarayiciyi yenile (F5) ve test et:" -ForegroundColor Yellow
Write-Host "  - /users (kullanicilar)"
Write-Host "  - /curriculum (mufredat)"  
Write-Host "  - /questions/create (soru olustur)"
Write-Host ""

