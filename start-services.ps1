param(
    [switch]$KillExisting,
    [int]$DelaySeconds = 2
)

Write-Host "🚀 Zerquiz servisleri başlatılıyor..." -ForegroundColor Green
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh" } else { "powershell" }

if ($KillExisting) {
    Write-Host "⏹️  Mevcut dotnet süreçleri kapatılıyor..." -ForegroundColor Yellow
    Get-Process dotnet -ErrorAction SilentlyContinue | Stop-Process -Force
}

$services = @(
    @{ Name = "Core";       Emoji = "📦"; Port = 5001; Path = "services\core\Zerquiz.Core.Api";       Url = "http://localhost:5001/swagger"; },
    @{ Name = "Identity";   Emoji = "🔐"; Port = 5002; Path = "services\identity\Zerquiz.Identity.Api"; Url = "http://localhost:5002/swagger"; },
    @{ Name = "Curriculum"; Emoji = "📚"; Port = 5003; Path = "services\curriculum\Zerquiz.Curriculum.Api"; Url = "http://localhost:5003/swagger"; },
    @{ Name = "Questions";  Emoji = "❓"; Port = 5004; Path = "services\questions\Zerquiz.Questions.Api"; Url = "http://localhost:5004/swagger"; },
    @{ Name = "Exams";      Emoji = "📝"; Port = 5005; Path = "services\exams\Zerquiz.Exams.Api";      Url = "http://localhost:5005/swagger"; },
    @{ Name = "Grading";    Emoji = "📊"; Port = 5006; Path = "services\grading\Zerquiz.Grading.Api";  Url = "http://localhost:5006/swagger"; },
    @{ Name = "Royalty";    Emoji = "💰"; Port = 5007; Path = "services\royalty\Zerquiz.Royalty.Api";  Url = "http://localhost:5007/swagger"; },
    @{ Name = "Gateway";    Emoji = "🌐"; Port = 5000; Path = "gateway\Zerquiz.Gateway";              Url = "http://localhost:5000"; }
)

$started = @()

foreach ($svc in $services) {
    $fullPath = Join-Path $root $svc.Path
    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  $($svc.Name) dizini bulunamadı: $fullPath" -ForegroundColor Red
        continue
    }

    Write-Host "$($svc.Emoji) $($svc.Name) Service başlatılıyor (Port $($svc.Port))..." -ForegroundColor Cyan
    $command = "Set-Location '$fullPath'; dotnet run"
    Start-Process $shell -ArgumentList "-NoExit", "-Command", $command -WindowStyle Normal | Out-Null
    $started += $svc
    Start-Sleep -Seconds $DelaySeconds
}

Write-Host ""
Write-Host "✅ Başlatılan servisler:" -ForegroundColor Green
foreach ($svc in $started) {
    Write-Host ("   • {0} -> {1}" -f $svc.Name, $svc.Url) -ForegroundColor White
}

if ($started.Count -eq 0) {
    Write-Host "Hiçbir servis başlatılamadı. Script hatalarına bakın." -ForegroundColor Red
}

Write-Host ""
Write-Host "İpucu: Scripti '$PSCommandPath -KillExisting' ile çağırarak eski dotnet süreçlerini otomatik kapatabilirsiniz." -ForegroundColor Yellow

