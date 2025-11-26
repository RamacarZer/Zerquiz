# Zerquiz Platform - Seed All Data
# This script calls seed endpoints for all services

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ZERQUIZ DATA SEEDING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost"

$seedEndpoints = @(
    @{Service="Core"; Port=5001; Endpoint="/api/seed/seed-all"},
    @{Service="Identity"; Port=5002; Endpoint="/api/seed/seed-all"},
    @{Service="Curriculum"; Port=5003; Endpoint="/api/seeddefinitions/seed-all"},
    @{Service="Questions"; Port=5004; Endpoint="/api/seed/seed-all"},
    @{Service="Exams"; Port=5005; Endpoint="/api/seed/seed-all"},
    @{Service="Grading"; Port=5006; Endpoint="/api/seed/seed-all"},
    @{Service="Royalty"; Port=5007; Endpoint="/api/seed/seed-all"},
    @{Service="Presentation"; Port=5008; Endpoint="/api/seed/seed-all"},
    @{Service="Finance"; Port=5009; Endpoint="/api/seed/seed-all"}
)

$successCount = 0
$failCount = 0

Write-Host "NOTE: Make sure all services are running before seeding!" -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 2

foreach ($seed in $seedEndpoints) {
    $url = "$baseUrl`:$($seed.Port)$($seed.Endpoint)"
    
    Write-Host "Seeding: $($seed.Service) Service..." -ForegroundColor Cyan
    Write-Host "  URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -TimeoutSec 30
        Write-Host "  [OK] $($seed.Service) data seeded successfully" -ForegroundColor Green
        $successCount++
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 404) {
            Write-Host "  [SKIP] Seed endpoint not found (may not be implemented yet)" -ForegroundColor Yellow
        }
        elseif ($null -eq $statusCode) {
            Write-Host "  [ERROR] Service not reachable - is it running?" -ForegroundColor Red
            $failCount++
        }
        else {
            Write-Host "  [ERROR] HTTP $statusCode - $($_.Exception.Message)" -ForegroundColor Red
            $failCount++
        }
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "SEEDING SUMMARY:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed:  $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "[SUCCESS] All data seeded!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Some seeding operations failed." -ForegroundColor Yellow
    Write-Host "This may be normal if seed endpoints are not implemented." -ForegroundColor Yellow
}
Write-Host ""

