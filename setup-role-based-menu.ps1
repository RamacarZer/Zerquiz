# =====================================================
# ROL BAZLI MENÜ SİSTEMİ - HIZLI KURULUM
# =====================================================
# Bu script menü sistemini otomatik olarak kurar
# =====================================================

Write-Host "🎯 ROL BAZLI MENÜ SİSTEMİ KURULUMU" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL bağlantı bilgileri
$env:PGPASSWORD = "postgres"
$dbHost = "localhost"
$dbPort = "5432"
$dbName = "zerquiz"
$dbUser = "postgres"

Write-Host "📊 1. Veritabanı bağlantısı kontrol ediliyor..." -ForegroundColor Yellow
try {
    $testQuery = "SELECT 1"
    $result = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c $testQuery 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Veritabanına bağlanılamadı!" -ForegroundColor Red
        Write-Host "   Lütfen PostgreSQL servisinin çalıştığından emin olun." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Veritabanı bağlantısı başarılı" -ForegroundColor Green
} catch {
    Write-Host "❌ Hata: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📁 2. Menü seed dosyası kontrol ediliyor..." -ForegroundColor Yellow
$seedFile = "database\migrations\seed_menu_role_based_structure.sql"
if (-not (Test-Path $seedFile)) {
    Write-Host "❌ Seed dosyası bulunamadı: $seedFile" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Seed dosyası bulundu" -ForegroundColor Green

Write-Host ""
Write-Host "🔄 3. Mevcut menü verileri temizleniyor..." -ForegroundColor Yellow
$cleanupQuery = @"
TRUNCATE TABLE core_schema.menu_permissions CASCADE;
TRUNCATE TABLE core_schema.menu_item_translations CASCADE;
TRUNCATE TABLE core_schema.menu_items CASCADE;
"@
& psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c $cleanupQuery | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Eski veriler temizlendi" -ForegroundColor Green
} else {
    Write-Host "⚠️  Temizleme sırasında uyarı (devam edilebilir)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 4. Yeni menü yapısı yükleniyor..." -ForegroundColor Yellow
& psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $seedFile | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Menü yapısı başarıyla yüklendi" -ForegroundColor Green
} else {
    Write-Host "❌ Menü yükleme başarısız!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 5. Kurulum doğrulanıyor..." -ForegroundColor Yellow

# Menü sayıları
$menuCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_items;" 2>&1
Write-Host "   - Toplam menü öğesi: $($menuCount.Trim())" -ForegroundColor Cyan

$linkCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_items WHERE ""MenuType"" = 'link';" 2>&1
Write-Host "   - Link menüler: $($linkCount.Trim())" -ForegroundColor Cyan

$dropdownCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_items WHERE ""MenuType"" = 'dropdown';" 2>&1
Write-Host "   - Dropdown menüler: $($dropdownCount.Trim())" -ForegroundColor Cyan

$groupCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_items WHERE ""MenuType"" = 'group';" 2>&1
Write-Host "   - Grup başlıkları: $($groupCount.Trim())" -ForegroundColor Cyan

# Permission sayıları
Write-Host ""
Write-Host "   Rol bazlı izinler:" -ForegroundColor Cyan
$permQuery = @"
SELECT r."Name" as role, COUNT(mp.*) as count
FROM core_schema.menu_permissions mp
JOIN identity_schema.roles r ON r."Id" = mp."RoleId"
GROUP BY r."Name"
ORDER BY r."Name";
"@
& psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c $permQuery

# Translation sayıları
$trCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_item_translations WHERE ""LanguageCode"" = 'tr';" 2>&1
$enCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM core_schema.menu_item_translations WHERE ""LanguageCode"" = 'en';" 2>&1
Write-Host ""
Write-Host "   Çeviriler:" -ForegroundColor Cyan
Write-Host "   - Türkçe: $($trCount.Trim())" -ForegroundColor Cyan
Write-Host "   - İngilizce: $($enCount.Trim())" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 SONRAKI ADIMLAR:" -ForegroundColor Cyan
Write-Host "   1. Backend servisi başlatın:" -ForegroundColor White
Write-Host "      cd services\core\Zerquiz.Core.Api" -ForegroundColor Gray
Write-Host "      dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Frontend başlatın:" -ForegroundColor White
Write-Host "      cd frontend\zerquiz-web" -ForegroundColor Gray
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Test edin:" -ForegroundColor White
Write-Host "      - Student: Basit menü yapısı" -ForegroundColor Gray
Write-Host "      - Teacher: Kapsamlı içerik menüleri" -ForegroundColor Gray
Write-Host "      - TenantAdmin: Yönetim menüleri" -ForegroundColor Gray
Write-Host "      - SuperAdmin: Tüm menüler" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Detaylı dokümantasyon: MENU-SYSTEM-ROLE-BASED-COMPLETE.md" -ForegroundColor Cyan
Write-Host ""

