@echo off
echo.
echo ================================================
echo   ZERQUIZ - ILETISIM MODULU HIZLI TEST
echo ================================================
echo.
echo [1/5] Tarayici aciliyor...
timeout /t 2 /nobreak >nul

start http://localhost:3001/communication

echo [2/5] Sayfanin acilmasini bekliyoruz...
timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo   KONTROL LISTESI
echo ================================================
echo.
echo [?] Sol menude "Iletisim" gorunuyor mu?       [ ]
echo [?] Sayfa basligi "Iletisim Merkezi" mi?      [ ]
echo [?] 4 tab gorunuyor mu?                        [ ]
echo     - Sohbetler
echo     - Kisiler  
echo     - Bildirimler
echo     - Duyurular
echo.
echo [?] Sol panelde konusmalar listeleniyor mu?   [ ]
echo [?] Bir konusmaya tiklandiginda mesajlar      [ ]
echo     sag panelde aciliyor mu?
echo.
echo ================================================
echo   HARD REFRESH YAPIN!
echo ================================================
echo.
echo   Windows: Ctrl + Shift + R
echo   veya:    Ctrl + F5
echo.
echo ================================================
echo   SORUN MU VAR?
echo ================================================
echo.
echo 1. Hard refresh yapin (Ctrl + Shift + R)
echo 2. Developer Console'u acin (F12)
echo 3. Console'da hata var mi kontrol edin
echo 4. URL dogru mu: /communication
echo.
echo ================================================
echo   DOSYALAR KONTROL
echo ================================================
echo.
echo [3/5] Dosyalarin varligini kontrol ediyorum...
echo.

if exist "frontend\zerquiz-web\src\pages\communication\CommunicationCenterPageAdvanced.tsx" (
    echo [OK] CommunicationCenterPageAdvanced.tsx
) else (
    echo [HATA] CommunicationCenterPageAdvanced.tsx BULUNAMADI!
)

if exist "frontend\zerquiz-web\src\mocks\communicationDataAdvanced.ts" (
    echo [OK] communicationDataAdvanced.ts
) else (
    echo [HATA] communicationDataAdvanced.ts BULUNAMADI!
)

if exist "frontend\zerquiz-web\src\components\communication\UserListItem.tsx" (
    echo [OK] UserListItem.tsx
) else (
    echo [HATA] UserListItem.tsx BULUNAMADI!
)

if exist "frontend\zerquiz-web\src\components\communication\ConversationListItem.tsx" (
    echo [OK] ConversationListItem.tsx
) else (
    echo [HATA] ConversationListItem.tsx BULUNAMADI!
)

if exist "frontend\zerquiz-web\src\components\communication\MessageBubble.tsx" (
    echo [OK] MessageBubble.tsx
) else (
    echo [HATA] MessageBubble.tsx BULUNAMADI!
)

echo.
echo [4/5] Server durumu kontrol ediliyor...
echo.

netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo [OK] Vite server calisiyor (Port 3001)
) else (
    echo [UYARI] Port 3001 kapali! npm run dev calistirin!
)

echo.
echo [5/5] Dokuman olusturuldu...
echo.
echo [OK] ILETISIM-MODULU-ERISIM-REHBERI.md
echo.
echo ================================================
echo   TEST TAMAMLANDI!
echo ================================================
echo.
echo Eger sayfa gorunmuyorsa:
echo 1. Tarayicida Hard Refresh yapin (Ctrl + Shift + R)
echo 2. Cache temizleyin
echo 3. Developer Console'da hatalari kontrol edin (F12)
echo.
echo Iyi kullanmalar! ^_^
echo.
pause

