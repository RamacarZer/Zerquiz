#!/usr/bin/env pwsh
# Zerquiz - Tum Servislere Demo/Mock Data Yukleme Scripti

Write-Host "=== Zerquiz Demo Veri Yukleme Baslatiyor..." -ForegroundColor Green
Write-Host ""

$ErrorActionPreference = "Continue"
$endpoints = @()

# ============================================================================
# 1. IDENTITY SERVICE - Kullanicilar, Roller, Departmanlar
# ============================================================================
Write-Host "[*] IDENTITY SERVICE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

$identityEndpoints = @(
    @{ Name = "Roller (Roles)"; Url = "http://localhost:5002/api/seed/roles" },
    @{ Name = "Departmanlar"; Url = "http://localhost:5002/api/seed/departments" },
    @{ Name = "Pozisyonlar"; Url = "http://localhost:5002/api/seed/positions" },
    @{ Name = "Demo Kullanicilar"; Url = "http://localhost:5002/api/seed/demo-users" }
)

foreach ($ep in $identityEndpoints) {
    try {
        Write-Host "  ➜ $($ep.Name)..." -NoNewline
        $response = Invoke-RestMethod -Method POST -Uri $ep.Url -TimeoutSec 10 -ErrorAction Stop
        Write-Host " [OK] Basarili" -ForegroundColor Green
        if ($response.count) { Write-Host "     -> $($response.count) kayit eklendi" -ForegroundColor DarkGreen }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -like "*already*") {
            Write-Host " [!] Zaten mevcut" -ForegroundColor Yellow
        } else {
            Write-Host " [X] Hata: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# ============================================================================
# 2. CORE SERVICE - Tenantlar ve Lisans Paketleri
# ============================================================================
Write-Host "" 
Write-Host "[*] CORE SERVICE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

$coreEndpoints = @(
    @{ Name = "Demo Tenantlar"; Url = "http://localhost:5001/api/seed/tenants" },
    @{ Name = "Lisans Paketleri"; Url = "http://localhost:5001/api/license-seed/packages" },
    @{ Name = "Tenant Lisanslari"; Url = "http://localhost:5001/api/license-seed/tenant-licenses" }
)

foreach ($ep in $coreEndpoints) {
    try {
        Write-Host "  ➜ $($ep.Name)..." -NoNewline
        $response = Invoke-RestMethod -Method POST -Uri $ep.Url -TimeoutSec 10 -ErrorAction Stop
        Write-Host " [OK] Basarili" -ForegroundColor Green
        if ($response.count) { Write-Host "     -> $($response.count) kayit eklendi" -ForegroundColor DarkGreen }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -like "*already*") {
            Write-Host " [!] Zaten mevcut" -ForegroundColor Yellow
        } else {
            Write-Host " [X] Hata: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# ============================================================================
# 3. CURRICULUM SERVICE - Mufredat, Branslar, Konular, Kazanimlar
# ============================================================================
Write-Host ""
Write-Host "[*] CURRICULUM SERVICE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

$curriculumEndpoints = @(
    @{ Name = "Egitim Modelleri"; Url = "http://localhost:5003/api/seed/education-models" },
    @{ Name = "Branslar (Subjects)"; Url = "http://localhost:5003/api/curriculum-seed/all-subjects" },
    @{ Name = "Ingilizce Hiyerarsisi"; Url = "http://localhost:5003/api/curriculum-seed/english-hierarchy" },
    @{ Name = "Matematik Hiyerarsisi"; Url = "http://localhost:5003/api/curriculum-seed/math-hierarchy" },
    @{ Name = "Tanim Gruplari (Definitions)"; Url = "http://localhost:5003/api/seed-definitions/all-groups" },
    @{ Name = "Ingilizce Tanimlar"; Url = "http://localhost:5003/api/seed-definitions/english-sample" }
)

foreach ($ep in $curriculumEndpoints) {
    try {
        Write-Host "  ➜ $($ep.Name)..." -NoNewline
        $response = Invoke-RestMethod -Method POST -Uri $ep.Url -TimeoutSec 15 -ErrorAction Stop
        Write-Host " [OK] Basarili" -ForegroundColor Green
        if ($response.count) { Write-Host "     -> $($response.count) kayit eklendi" -ForegroundColor DarkGreen }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -like "*already*") {
            Write-Host " [!] Zaten mevcut" -ForegroundColor Yellow
        } else {
            Write-Host " [X] Hata: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# ============================================================================
# 4. QUESTIONS SERVICE - Soru Formatlari, Zorluk Seviyeleri, Ornek Sorular
# ============================================================================
Write-Host ""
Write-Host "[*] QUESTIONS SERVICE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

$questionsEndpoints = @(
    @{ Name = "Soru Tipleri (Format, Zorluk, Sunum)"; Url = "http://localhost:5004/api/seed/question-types" },
    @{ Name = "Demo Sorular"; Url = "http://localhost:5004/api/seed/demo-questions" }
)

foreach ($ep in $questionsEndpoints) {
    try {
        Write-Host "  ➜ $($ep.Name)..." -NoNewline
        $response = Invoke-RestMethod -Method POST -Uri $ep.Url -TimeoutSec 15 -ErrorAction Stop
        Write-Host " [OK] Basarili" -ForegroundColor Green
        if ($response.count) { Write-Host "     -> $($response.count) kayit eklendi" -ForegroundColor DarkGreen }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -like "*already*") {
            Write-Host " [!] Zaten mevcut" -ForegroundColor Yellow
        } else {
            Write-Host " [X] Hata: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# ============================================================================
# PRESENTATION SERVICE
# ============================================================================
Write-Host ""
Write-Host "[*] PRESENTATION SERVICE" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

$presentationEndpoints = @(
    @{ Name = "Demo Sunumlar (3 adet)"; Url = "http://localhost:5008/api/seed/demo-presentations" }
)

foreach ($ep in $presentationEndpoints) {
    try {
        Write-Host "  ➜ $($ep.Name)..." -NoNewline
        $response = Invoke-RestMethod -Method POST -Uri $ep.Url -TimeoutSec 15 -ErrorAction Stop
        Write-Host " [OK] Basarili" -ForegroundColor Green
        if ($response.count) { Write-Host "     -> $($response.count) sunum eklendi" -ForegroundColor DarkGreen }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -like "*already*") {
            Write-Host " [!] Zaten mevcut" -ForegroundColor Yellow
        } else {
            Write-Host " [X] Hata: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# ============================================================================
# OZET
# ============================================================================
Write-Host ""
Write-Host "========================================" -ForegroundColor DarkGray
Write-Host "*** Demo Veri Yukleme Tamamlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "[*] Test Etmek Icin:" -ForegroundColor Yellow
Write-Host "   - Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   - Kullanicilar: /users" -ForegroundColor White
Write-Host "   - Tenantlar: /tenants" -ForegroundColor White
Write-Host "   - Mufredat: /curriculum" -ForegroundColor White
Write-Host "   - Sorular: /questions" -ForegroundColor White
Write-Host "   - Sunumlar: /presentations" -ForegroundColor White
Write-Host ""

