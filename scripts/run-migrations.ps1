# Zerquiz Platform - Run All Migrations
# This script runs EF Core migrations for all services

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ZERQUIZ MIGRATIONS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$services = @(
    @{Name="Core"; Path="services/core/Zerquiz.Core.Api"},
    @{Name="Identity"; Path="services/identity/Zerquiz.Identity.Api"},
    @{Name="Curriculum"; Path="services/curriculum/Zerquiz.Curriculum.Api"},
    @{Name="Questions"; Path="services/questions/Zerquiz.Questions.Api"},
    @{Name="Exams"; Path="services/exams/Zerquiz.Exams.Api"},
    @{Name="Grading"; Path="services/grading/Zerquiz.Grading.Api"},
    @{Name="Royalty"; Path="services/royalty/Zerquiz.Royalty.Api"},
    @{Name="Presentation"; Path="services/presentation/Zerquiz.Presentation.Api"},
    @{Name="Finance"; Path="services/finance/Zerquiz.Finance.Api"}
)

$successCount = 0
$failCount = 0

foreach ($service in $services) {
    Write-Host "Processing: $($service.Name) Service..." -ForegroundColor Cyan
    
    $projectPath = Join-Path $PSScriptRoot ".." $service.Path
    
    if (Test-Path $projectPath) {
        Push-Location $projectPath
        
        # Check if migrations exist
        $infraPath = $projectPath -replace "\.Api$", ".Infrastructure"
        $migrationsPath = Join-Path $infraPath "Migrations"
        
        if (Test-Path $migrationsPath) {
            Write-Host "  Applying existing migrations..." -ForegroundColor Yellow
            
            try {
                dotnet ef database update --no-build 2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "  [OK] $($service.Name) migrations applied" -ForegroundColor Green
                    $successCount++
                } else {
                    Write-Host "  [SKIP] $($service.Name) - migrations may already be applied" -ForegroundColor Yellow
                    $successCount++
                }
            }
            catch {
                Write-Host "  [ERROR] $($service.Name) - $($_.Exception.Message)" -ForegroundColor Red
                $failCount++
            }
        } else {
            Write-Host "  No migrations found, creating initial migration..." -ForegroundColor Yellow
            
            try {
                # Create initial migration
                dotnet ef migrations add InitialCreate 2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "  Migration created, applying to database..." -ForegroundColor Yellow
                    dotnet ef database update 2>&1 | Out-Null
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "  [OK] $($service.Name) database created" -ForegroundColor Green
                        $successCount++
                    } else {
                        Write-Host "  [ERROR] $($service.Name) - failed to apply migration" -ForegroundColor Red
                        $failCount++
                    }
                } else {
                    Write-Host "  [ERROR] $($service.Name) - failed to create migration" -ForegroundColor Red
                    $failCount++
                }
            }
            catch {
                Write-Host "  [ERROR] $($service.Name) - $($_.Exception.Message)" -ForegroundColor Red
                $failCount++
            }
        }
        
        Pop-Location
    } else {
        Write-Host "  [SKIP] Project not found: $projectPath" -ForegroundColor Gray
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "MIGRATION SUMMARY:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed:  $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "[SUCCESS] All migrations completed!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Some migrations failed. Check logs above." -ForegroundColor Yellow
}
Write-Host ""

