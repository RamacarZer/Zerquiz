# 💰 Finans Modülü - Hızlı Başlangıç Kılavuzu

## 🚀 Hızlı Erişim

### Web Arayüzü
```
Ana Sayfa: http://localhost:5173/finance
```

### Sekmeler
- **Genel Bakış** - Finansal özet ve KPI'lar
- **Kasa Yönetimi** - Nakit akışı ve hesap yönetimi
- **İşlemler** - Gelir/Gider kayıtları
- **Bütçeler** - Departman bazlı bütçe takibi
- **Harcırahlar** - Personel harcırah talepleri
- **Faturalar** - Fatura ve proforma yönetimi
- **Abonelikler** - Müşteri abonelik takibi
- **Ödeme Sistemleri** - Gateway monitoring

## 📊 Temel İşlemler

### 1. Finansal Özet Görüntüleme
```
1. /finance sayfasına git
2. Genel Bakış sekmesinde:
   - Toplam Gelir: 486.750 ₺
   - Net Kar: 174.350 ₺
   - Tamamlanan Ödeme: 247
   - Kullanıcı Başına Ort: 3.427 ₺
```

### 2. Kasa Hesabı Ekleme
```
1. "Kasa Yönetimi" sekmesine git
2. "Yeni Kasa Ekle" butonuna tık
3. Bilgileri doldur:
   - İsim
   - Tip (Ana Kasa/Banka/Şube)
   - Para Birimi
4. Kaydet
```

### 3. Gelir/Gider Kaydı
```
1. "İşlemler" sekmesine git
2. "Yeni İşlem" butonuna tık
3. Formu doldur:
   - Tip: Gelir/Gider
   - Kategori seç
   - Tutar gir
   - Açıklama ekle
4. Kaydet
```

### 4. Harcırah Onaylama
```
1. "Harcırahlar" sekmesine git
2. "Bekleyen" filtresini seç
3. Talep kartında:
   - ✓ butonuna tık → Onayla
   - ✗ butonuna tık → Reddet
```

### 5. Fatura Oluşturma
```
1. "Faturalar" sekmesine git
2. "Yeni Fatura" butonuna tık
3. Bilgileri gir:
   - Müşteri adı
   - Fatura/Proforma seç
   - Kalemler ekle
   - Vade tarihi belirle
4. Oluştur
```

### 6. Fatura İşlemleri
```
Fatura kartında:
- "PDF İndir" → Faturayı indir
- "E-posta Gönder" → Müşteriye gönder
```

### 7. Bütçe Takibi
```
1. "Bütçeler" sekmesine git
2. Departman bazlı:
   - Ayrılan bütçe
   - Kullanılan miktar
   - Sapma oranı
   görüntülenir
3. "Bütçe Ayarları" ile düzenle
```

### 8. Abonelik Yönetimi
```
1. "Abonelikler" sekmesine git
2. Filtrele: Aktif/İptal/Süresi Dolmuş
3. Abonelik kartında:
   - Düzenle → Bilgileri güncelle
   - İptal → Aboneliği sonlandır
```

## 🎨 Filtreleme ve Arama

### İşlem Filtreleme
```
İşlemler sekmesinde:
- Dropdown: Tümü/Gelir/Gider
```

### Harcırah Filtreleme
```
Harcırahlar sekmesinde:
- Tümü
- Onaylı
- Bekleyen
- Reddedildi
```

### Fatura Filtreleme
```
Faturalar sekmesinde:
- Tip: Tümü/Fatura/Proforma
- Durum: Tümü/Ödendi/Bekliyor/Gecikmiş
```

### Abonelik Filtreleme
```
Abonelikler sekmesinde:
- Tümü
- Aktif
- İptal
- Süresi Dolmuş
```

## 📥 Raporlama

### Rapor İndirme
```
1. Sağ üst köşede "Rapor İndir" butonuna tık
2. Format seç (PDF/Excel)
3. Rapor otomatik indirilir
```

### İçerik
- Finansal özet
- Gelir/Gider analizi
- Bütçe karşılaştırmaları
- Fatura listesi
- Abonelik durumları

## 🔄 Yenileme

```
Sağ üst köşede "Yenile" butonu:
- Tüm verileri güncelledik getirir
- Toast bildirimi gösterir
```

## 🌙 Dark Mode

```
Otomatik olarak sistem temasını takip eder:
- Light theme: Gündüz
- Dark theme: Gece
```

## 🎯 Önemli Metriks

### Dashboard KPI'ları
```
✅ Toplam Gelir (gradient emerald)
✅ Net Kar (gradient blue)
✅ Tamamlanan Ödeme (gradient purple)
✅ Kullanıcı Başına Ort. (gradient orange)
```

### Kasa Durumları
```
💵 Ana Kasa - Purple badge
🏦 Banka - Blue badge
🏢 Şube - Green badge
```

### Fatura Durumları
```
✓ Ödendi - Green
⏳ Beklemede - Yellow
⚠ Gecikmiş - Red
✗ İptal - Gray
```

## 🚨 Uyarılar ve Bildirimler

### Toast Mesajları
```
✅ Başarı: Yeşil - "İşlem başarılı"
❌ Hata: Kırmızı - "Bir hata oluştu"
ℹ️ Bilgi: Mavi - "İşlem devam ediyor"
⚠️ Uyarı: Sarı - "Dikkat edilmesi gereken durum"
```

### Kritik Uyarılar
```
- Gecikmiş faturalar (kırmızı border)
- Bütçe aşımları (%90+ kırmızı progress bar)
- Ödeme sistemi sorunları (kırmızı badge)
```

## 💡 İpuçları

1. **Hızlı Navigasyon**: Üst sekme menüsünden direkt erişim
2. **Filtreleme**: Her sayfada akıllı filtreler
3. **Responsive**: Mobil cihazlarda da mükemmel çalışır
4. **Klavye Kısayolları**: Tab ile sekme geçişi
5. **Otomatik Hesaplama**: Bütçe sapmaları otomatik
6. **Renk Kodları**: Durum bazlı hızlı görsel feedback

## 🔐 Yetkilendirme

```
Erişim: SuperAdmin, TenantAdmin
Route: /finance/*
Protected: ✅
```

## 📞 Destek

Sorun bildirmek veya özellik talebi için:
- Issue açın
- Dokümantasyona bakın: FINANCE-MODULE-COMPLETE.md

---

**Not**: Bu modül mock data ile çalışmaktadır. Gerçek veriler için backend API entegrasyonu gereklidir.

**Güncelleme**: Aralık 2024

