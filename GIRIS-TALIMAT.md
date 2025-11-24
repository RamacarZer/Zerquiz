# 🔐 GİRİŞ TALİMATI

## ✅ SİSTEM HAZIR!

### 📍 ERİŞİM ADRESLERİ

**Frontend:** http://localhost:3000  
**Swagger (API):** http://localhost:5002/swagger

---

## 👥 KULLANICILAR

Tüm kullanıcılar başarıyla oluşturuldu ve aktif!

| Email | Şifre | Rol | Durum |
|-------|-------|-----|-------|
| admin@demo.com | Demo123! | Student (Admin rolü eklenecek) | ✅ |
| teacher@demo.com | Demo123! | Student (Teacher rolü eklenecek) | ✅ |
| student@demo.com | Demo123! | Student | ✅ |

> **NOT:** Register endpoint'i şu an tüm yeni kullanıcılara otomatik "Student" rolü veriyor.  
> Admin ve Teacher rollerini manuel olarak veritabanından güncelleyebilirsiniz.

---

## 🧪 TEST SENARYOSUtest EDİN

### 1. Frontend'den Giriş:
1. Tarayıcıda aç: **http://localhost:3000**
2. Email: `admin@demo.com`
3. Şifre: `Demo123!`
4. **Login** butonuna tıklayın

### 2. Swagger'dan Test:
1. Tarayıcıda aç: **http://localhost:5002/swagger**
2. **POST /api/auth/login** endpoint'ini bulun
3. "Try it out" tıklayın
4. Request body:
```json
{
  "email": "admin@demo.com",
  "password": "Demo123!"
}
```
5. "Execute" tıklayın
6. ✅ Response'da `accessToken` göreceksiniz

### 3. PowerShell'den Test:
```powershell
$body = @{
    email = "admin@demo.com"
    password = "Demo123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5002/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

---

## 🔧 SORUN GİDERME

### "401 Unauthorized" Hatası Alıyorsanız:

1. **Şifrenizi kontrol edin:** `Demo123!` (büyük-küçük harf duyarlı)
2. **Email'i kontrol edin:** küçük harflerle yazın
3. **Kullanıcı var mı kontrol edin:**
```powershell
$env:PGPASSWORD="Sanez.579112"
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d zerquiz_db -c "SELECT \"Email\", \"IsActive\" FROM identity_schema.users;"
```

### Kullanıcı Yoksa Yeniden Oluştur:

```powershell
$body = @{
    email = "admin@demo.com"
    password = "Demo123!"
    firstName = "Admin"
    lastName = "User"
    tenantId = "11111111-1111-1111-1111-111111111111"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5002/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

---

## 🎯 YETKİ GÜNCELLEME (Opsiyonel)

Admin ve Teacher rollerini güncellemek için:

```sql
-- Admin rolüne yükselt
UPDATE identity_schema.user_roles 
SET "RoleId" = '22222222-2222-1111-1111-111111111111'  -- Admin Role ID
WHERE "UserId" = (SELECT "Id" FROM identity_schema.users WHERE "Email" = 'admin@demo.com');

-- Teacher rolüne yükselt
UPDATE identity_schema.user_roles 
SET "RoleId" = '22222222-3333-1111-1111-111111111111'  -- Teacher Role ID
WHERE "UserId" = (SELECT "Id" FROM identity_schema.users WHERE "Email" = 'teacher@demo.com');
```

---

## ✅ ÖZET

- ✅ **3 Kullanıcı** oluşturuldu
- ✅ **Login çalışıyor**
- ✅ **JWT Token** alınıyor
- ✅ **Frontend hazır** (http://localhost:3000)
- ✅ **API hazır** (http://localhost:5002)

**Şimdi giriş yapabilirsiniz!** 🎉

---

**Son Güncelleme:** 24 Kasım 2025  
**Durum:** ✅ GİRİŞ SİSTEMİ ÇALIŞIYOR

