# 🏢 ZERQUIZ - KAPSAMLI LİSANS VE BRANDING SİSTEMİ

**Tarih:** 24 Kasım 2025  
**Versiyon:** 1.0  
**Statü:** Tasarım Aşaması

---

## 📋 İÇİNDEKİLER

1. [Sistem Genel Bakış](#sistem-genel-bakış)
2. [Lisans Yönetim Sistemi](#lisans-yönetim-sistemi)
3. [Branding Sistemi](#branding-sistemi)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend UI/UX](#frontend-uiux)

---

## 🎯 SİSTEM GENEL BAKIŞ

### Amaç
Her tenant (müşteri/kurum) için:
- ✅ Lisans paketleri ve limitler
- ✅ Özellik yönetimi (feature flags)
- ✅ Branding ayarları (logo, renk, domain)
- ✅ Subdomain/Custom domain yönetimi
- ✅ Fatura ve ödeme takibi

### SuperAdmin Yetenekleri
- 📦 Lisans paketleri oluşturma/düzenleme
- 🎨 Tenant branding ayarlarını yönetme
- 🌐 Domain/Subdomain atama
- 💰 Fatura ve ödeme takibi
- 📊 Kullanım raporları ve limitler
- 🔒 Feature açma/kapama

---

## 💼 LİSANS YÖNETİM SİSTEMİ

### 1. Lisans Paketleri (License Packages)

#### Örnek Paketler
```
┌─────────────────────────────────────────────────┐
│ FREE (Deneme)                                   │
│ - 5 kullanıcı, 100 soru, 10 sınav             │
│ - 1 GB depolama                                 │
│ - 14 gün deneme                                 │
│ - Subdomain: ✅  Custom Domain: ❌             │
│ - Fiyat: 0 ₺/ay                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BASIC (Temel Paket)                            │
│ - 25 kullanıcı, 1000 soru, 50 sınav           │
│ - 10 GB depolama                                │
│ - Subdomain: ✅  Custom Domain: ❌             │
│ - Email branding: ✅                            │
│ - Fiyat: 499 ₺/ay veya 4999 ₺/yıl            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSIONAL (Profesyonel)                     │
│ - 100 kullanıcı, 5000 soru, 200 sınav         │
│ - 50 GB depolama                                │
│ - Subdomain: ✅  Custom Domain: ✅             │
│ - Email branding: ✅  Logo: ✅                 │
│ - Özel renkler: ✅                              │
│ - Fiyat: 1499 ₺/ay veya 14999 ₺/yıl          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ENTERPRISE (Kurumsal)                          │
│ - Sınırsız kullanıcı, soru, sınav             │
│ - 500 GB depolama                               │
│ - Subdomain: ✅  Custom Domain: ✅             │
│ - Full branding: ✅  White label: ✅           │
│ - Özel CSS/JS: ✅  API erişimi: ✅            │
│ - Fiyat: 4999 ₺/ay veya 49999 ₺/yıl          │
└─────────────────────────────────────────────────┘
```

### 2. Lisans Limitleri (License Limits)

```json
{
  "packageId": "uuid",
  "packageName": "Professional",
  "limits": {
    "users": {
      "max": 100,
      "current": 45,
      "remaining": 55,
      "unlimited": false
    },
    "students": {
      "max": 1000,
      "current": 567,
      "remaining": 433,
      "unlimited": false
    },
    "questions": {
      "max": 5000,
      "current": 2341,
      "remaining": 2659,
      "unlimited": false
    },
    "exams": {
      "max": 200,
      "current": 87,
      "remaining": 113,
      "unlimited": false
    },
    "storage": {
      "maxGB": 50,
      "currentGB": 23.4,
      "remainingGB": 26.6,
      "unlimited": false
    },
    "apiCalls": {
      "maxPerMonth": 100000,
      "currentMonth": 45231,
      "remaining": 54769,
      "unlimited": false
    }
  }
}
```

### 3. Özellikler (Features)

Her lisans paketi farklı özelliklere sahip:

```typescript
interface LicenseFeatures {
  // Core Features
  multipleChoice: boolean;           // Çoktan seçmeli sorular
  trueFalse: boolean;                // Doğru/Yanlış soruları
  matching: boolean;                 // Eşleştirme soruları
  essay: boolean;                    // Açık uçlu sorular
  
  // Question Management
  questionBank: boolean;             // Soru bankası
  questionVersioning: boolean;       // Soru versiyonlama
  questionReview: boolean;           // Soru inceleme süreci
  bulkQuestionImport: boolean;       // Toplu soru yükleme
  
  // Exam Features
  onlineExams: boolean;              // Online sınavlar
  printedExams: boolean;             // Basılı sınavlar
  examScheduling: boolean;           // Sınav planlama
  multipleBooklets: boolean;         // Çoklu kitapçık
  randomizeQuestions: boolean;       // Soru karıştırma
  
  // Grading & Analytics
  autoGrading: boolean;              // Otomatik değerlendirme
  manualGrading: boolean;            // Manuel değerlendirme
  detailedAnalytics: boolean;        // Detaylı analitik
  exportReports: boolean;            // Rapor dışa aktarma
  certificates: boolean;             // Sertifika
  
  // Curriculum
  customCurriculum: boolean;         // Özel müfredat
  learningOutcomes: boolean;         // Kazanımlar
  topicHierarchy: boolean;           // Konu hiyerarşisi
  
  // Branding
  customLogo: boolean;               // Özel logo
  customColors: boolean;             // Özel renkler
  customDomain: boolean;             // Özel domain
  whiteLabel: boolean;               // Beyaz etiket
  customCSS: boolean;                // Özel CSS
  customJS: boolean;                 // Özel JS
  
  // Advanced
  apiAccess: boolean;                // API erişimi
  webhooks: boolean;                 // Webhook desteği
  sso: boolean;                      // Single Sign-On
  ldapIntegration: boolean;          // LDAP entegrasyonu
  prioritySupport: boolean;          // Öncelikli destek
  customIntegrations: boolean;       // Özel entegrasyonlar
}
```

### 4. Lisans Durumu (License Status)

```typescript
enum LicenseStatus {
  TRIAL = "trial",              // Deneme sürümü
  ACTIVE = "active",            // Aktif
  SUSPENDED = "suspended",      // Askıya alınmış
  EXPIRED = "expired",          // Süresi dolmuş
  CANCELLED = "cancelled",      // İptal edilmiş
  GRACE_PERIOD = "grace_period" // Ek süre
}
```

### 5. Fatura Yönetimi

```typescript
interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;        // FAT-2025-001
  amount: number;
  currency: string;             // TRY, USD, EUR
  status: InvoiceStatus;        // pending, paid, overdue
  billingPeriod: string;        // 2025-01, 2025-Q1
  startDate: Date;
  endDate: Date;
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  taxRate: number;              // 20% KDV
  taxAmount: number;
  totalAmount: number;
}
```

---

## 🎨 BRANDING SİSTEMİ

### 1. Genel Ayarlar (General Settings)

```typescript
interface TenantBrandingSettings {
  // Basic Info
  displayName: string;          // Görünen isim
  subdomain: string;            // ornek.zerquiz.com
  customDomain?: string;        // www.ornek.com
  domainVerified: boolean;      // DNS doğrulaması
  
  // Logos
  logoUrl?: string;             // Ana logo
  logoLightUrl?: string;        // Açık tema logo
  logoDarkUrl?: string;         // Koyu tema logo
  faviconUrl?: string;          // Favicon
  
  // Images
  loginBackgroundUrl?: string;  // Login arka plan
  dashboardBannerUrl?: string;  // Dashboard banner
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // Email Branding
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailLogoUrl?: string;
  emailFooterText?: string;
  
  // Social Media
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  
  // Contact Info
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
}
```

### 2. Renk Temaları (Color Themes)

```typescript
interface ColorTheme {
  // Theme Name
  name: string;                 // "Mavi", "Yeşil", "Özel"
  
  // Primary Colors
  primary: string;              // Ana renk (#3B82F6)
  primaryHover: string;         // Hover rengi (#2563EB)
  primaryActive: string;        // Active rengi (#1D4ED8)
  
  // Secondary Colors
  secondary: string;            // İkincil renk (#10B981)
  secondaryHover: string;
  secondaryActive: string;
  
  // Accent Colors
  accent: string;               // Vurgu rengi (#F59E0B)
  accentHover: string;
  accentActive: string;
  
  // Semantic Colors
  success: string;              // Başarı (#10B981)
  warning: string;              // Uyarı (#F59E0B)
  error: string;                // Hata (#EF4444)
  info: string;                 // Bilgi (#3B82F6)
  
  // Neutrals
  background: string;           // Arka plan (#FFFFFF)
  surface: string;              // Yüzey (#F9FAFB)
  border: string;               // Kenarlık (#E5E7EB)
  
  // Text Colors
  textPrimary: string;          // Ana metin (#111827)
  textSecondary: string;        // İkincil metin (#6B7280)
  textDisabled: string;         // Devre dışı (#9CA3AF)
}
```

#### Hazır Temalar

```typescript
const PresetThemes = {
  blue: {
    name: "Mavi",
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6"
  },
  green: {
    name: "Yeşil",
    primary: "#10B981",
    secondary: "#3B82F6",
    accent: "#F59E0B"
  },
  red: {
    name: "Kırmızı",
    primary: "#EF4444",
    secondary: "#F59E0B",
    accent: "#8B5CF6"
  },
  purple: {
    name: "Mor",
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#F59E0B"
  },
  orange: {
    name: "Turuncu",
    primary: "#F59E0B",
    secondary: "#EF4444",
    accent: "#3B82F6"
  },
  gray: {
    name: "Gri",
    primary: "#6B7280",
    secondary: "#9CA3AF",
    accent: "#3B82F6"
  }
};
```

### 3. Gelişmiş Ayarlar (Advanced Settings)

```typescript
interface AdvancedBrandingSettings {
  // Custom Code
  customCSS?: string;           // Özel CSS kodları
  customJS?: string;            // Özel JavaScript
  customHTMLHead?: string;      // <head> için özel HTML
  
  // Analytics
  googleAnalyticsId?: string;   // GA4 Measurement ID
  facebookPixelId?: string;     // Facebook Pixel
  hotjarId?: string;            // Hotjar tracking
  
  // Features
  enableCustomBranding: boolean;
  enableCustomDomain: boolean;
  enableWhiteLabel: boolean;
  
  // Localization
  defaultLanguage: string;      // tr, en, de
  defaultTimezone: string;      // Europe/Istanbul
  defaultCurrency: string;      // TRY, USD, EUR
  dateFormat: string;           // DD/MM/YYYY
  timeFormat: string;           // 24h, 12h
}
```

### 4. Özellik Yönetimi (Feature Management)

SuperAdmin her tenant için özellikleri açıp kapatabilir:

```typescript
interface TenantFeatureSettings {
  tenantId: string;
  features: {
    // Question Management
    questionBank: FeatureStatus;
    questionReview: FeatureStatus;
    bulkImport: FeatureStatus;
    
    // Exam Features
    onlineExams: FeatureStatus;
    printedExams: FeatureStatus;
    multipleBooklets: FeatureStatus;
    
    // Advanced
    apiAccess: FeatureStatus;
    customIntegrations: FeatureStatus;
    whiteLabel: FeatureStatus;
  };
}

interface FeatureStatus {
  enabled: boolean;
  description: string;
  icon: string;
  requiredPackage?: string;     // minimum, professional, enterprise
}
```

---

## 💾 DATABASE SCHEMA

### 1. license_packages Tablosu

```sql
CREATE TABLE core_schema.license_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,  -- NULL ise global paket
  
  -- Package Info
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,  -- free, basic, professional, enterprise
  description TEXT,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  billing_period VARCHAR(20),  -- monthly, quarterly, yearly
  trial_days INTEGER DEFAULT 0,
  
  -- Limits (JSONB)
  limits JSONB NOT NULL,
  -- {
  --   "users": {"max": 100, "unlimited": false},
  --   "questions": {"max": 5000, "unlimited": false},
  --   "storage_gb": {"max": 50, "unlimited": false}
  -- }
  
  -- Features (JSONB)
  features JSONB NOT NULL,
  -- {
  --   "custom_domain": true,
  --   "white_label": false,
  --   "api_access": true
  -- }
  
  -- Display
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,  -- Kayıt sayfasında göster
  display_order INTEGER DEFAULT 0,
  highlight_text VARCHAR(50),  -- "En Popüler", "Önerilen"
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  -- Audit
  created_by UUID,
  updated_by UUID
);
```

### 2. tenant_licenses Tablosu

```sql
CREATE TABLE core_schema.tenant_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core_schema.tenants(id),
  package_id UUID NOT NULL REFERENCES core_schema.license_packages(id),
  
  -- License Period
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  trial_end_date TIMESTAMP,
  
  -- Status
  status VARCHAR(20) NOT NULL,  -- trial, active, suspended, expired, cancelled
  auto_renew BOOLEAN DEFAULT true,
  
  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  billing_period VARCHAR(20),
  
  -- Current Usage (JSONB) - Cache için
  current_usage JSONB,
  -- {
  --   "users": 45,
  --   "questions": 2341,
  --   "storage_gb": 23.4
  -- }
  
  -- Custom Limits Override (JSONB)
  custom_limits JSONB,  -- Özel limitler (package'ı override eder)
  
  -- Custom Features Override (JSONB)
  custom_features JSONB,  -- Özel özellikler
  
  -- Billing
  last_invoice_id UUID,
  next_billing_date TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  suspended_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Audit
  created_by UUID,
  updated_by UUID,
  
  -- Indexes
  CONSTRAINT unique_tenant_active_license UNIQUE (tenant_id, status) 
    WHERE status = 'active'
);

CREATE INDEX idx_tenant_licenses_tenant ON core_schema.tenant_licenses(tenant_id);
CREATE INDEX idx_tenant_licenses_status ON core_schema.tenant_licenses(status);
CREATE INDEX idx_tenant_licenses_end_date ON core_schema.tenant_licenses(end_date);
```

### 3. tenant_branding_settings Tablosu

```sql
CREATE TABLE core_schema.tenant_branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES core_schema.tenants(id),
  
  -- General Settings (JSONB)
  general_settings JSONB,
  -- {
  --   "display_name": "Örnek Kurum",
  --   "subdomain": "ornek",
  --   "custom_domain": "www.ornek.com",
  --   "logo_url": "...",
  --   "favicon_url": "..."
  -- }
  
  -- Color Theme (JSONB)
  color_theme JSONB,
  -- {
  --   "name": "custom",
  --   "primary": "#3B82F6",
  --   "secondary": "#10B981",
  --   "accent": "#F59E0B"
  -- }
  
  -- Advanced Settings (JSONB)
  advanced_settings JSONB,
  -- {
  --   "custom_css": "...",
  --   "custom_js": "...",
  --   "google_analytics_id": "..."
  -- }
  
  -- Feature Settings (JSONB)
  feature_settings JSONB,
  -- {
  --   "enable_custom_branding": true,
  --   "enable_white_label": false
  -- }
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  -- Audit
  created_by UUID,
  updated_by UUID
);
```

### 4. invoices Tablosu

```sql
CREATE TABLE core_schema.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core_schema.tenants(id),
  license_id UUID REFERENCES core_schema.tenant_licenses(id),
  
  -- Invoice Info
  invoice_number VARCHAR(50) UNIQUE NOT NULL,  -- FAT-2025-001
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  
  -- Billing Period
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  
  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 20.00,  -- KDV oranı
  tax_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  
  -- Status
  status VARCHAR(20) NOT NULL,  -- draft, pending, paid, overdue, cancelled
  paid_at TIMESTAMP,
  payment_method VARCHAR(50),  -- credit_card, bank_transfer, etc.
  payment_reference VARCHAR(100),
  
  -- Items (JSONB)
  items JSONB NOT NULL,
  -- [
  --   {
  --     "description": "Professional Paketi - Aylık",
  --     "quantity": 1,
  --     "unit_price": 1499.00,
  --     "total": 1499.00
  --   }
  -- ]
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  -- Audit
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_invoices_tenant ON core_schema.invoices(tenant_id);
CREATE INDEX idx_invoices_status ON core_schema.invoices(status);
CREATE INDEX idx_invoices_due_date ON core_schema.invoices(due_date);
```

### 5. usage_tracking Tablosu

```sql
CREATE TABLE core_schema.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core_schema.tenants(id),
  
  -- Tracking Date
  tracking_date DATE NOT NULL,
  tracking_hour INTEGER,  -- 0-23 (opsiyonel, saatlik tracking için)
  
  -- Usage Metrics (JSONB)
  metrics JSONB NOT NULL,
  -- {
  --   "active_users": 45,
  --   "total_questions": 2341,
  --   "total_exams": 87,
  --   "storage_gb": 23.4,
  --   "api_calls": 1234
  -- }
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_tenant_tracking_date UNIQUE (tenant_id, tracking_date, tracking_hour)
);

CREATE INDEX idx_usage_tracking_tenant_date ON core_schema.usage_tracking(tenant_id, tracking_date);
```

---

## 🔌 API ENDPOINTS

### License Management

```typescript
// License Packages (SuperAdmin)
GET    /api/core/license-packages
POST   /api/core/license-packages
GET    /api/core/license-packages/{id}
PUT    /api/core/license-packages/{id}
DELETE /api/core/license-packages/{id}

// Tenant Licenses (SuperAdmin)
GET    /api/core/tenants/{tenantId}/license
POST   /api/core/tenants/{tenantId}/license/assign
PUT    /api/core/tenants/{tenantId}/license/upgrade
PUT    /api/core/tenants/{tenantId}/license/suspend
PUT    /api/core/tenants/{tenantId}/license/activate
DELETE /api/core/tenants/{tenantId}/license/cancel

// License Usage
GET    /api/core/tenants/{tenantId}/license/usage
GET    /api/core/tenants/{tenantId}/license/limits
GET    /api/core/tenants/{tenantId}/license/features
```

### Branding Management

```typescript
// Branding Settings (Tenant Admin)
GET    /api/core/tenants/{tenantId}/branding
PUT    /api/core/tenants/{tenantId}/branding/general
PUT    /api/core/tenants/{tenantId}/branding/colors
PUT    /api/core/tenants/{tenantId}/branding/advanced
GET    /api/core/tenants/{tenantId}/branding/preview

// Domain Management (SuperAdmin)
POST   /api/core/tenants/{tenantId}/domain/verify
DELETE /api/core/tenants/{tenantId}/domain/remove

// Feature Management (SuperAdmin)
GET    /api/core/tenants/{tenantId}/features
PUT    /api/core/tenants/{tenantId}/features/{featureKey}/toggle
```

### Invoice Management

```typescript
// Invoices
GET    /api/core/tenants/{tenantId}/invoices
POST   /api/core/tenants/{tenantId}/invoices/generate
GET    /api/core/invoices/{id}
PUT    /api/core/invoices/{id}/mark-paid
GET    /api/core/invoices/{id}/pdf
```

---

## 🎨 FRONTEND UI/UX TASARIMI

### 1. SuperAdmin Dashboard

```
┌─────────────────────────────────────────────────┐
│ ZERQUIZ SuperAdmin                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Dashboard  |  🏢 Tenants  |  💼 Licenses   │
│  📦 Packages   |  💰 Billing  |  📈 Analytics  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2. Tenant Yönetim Sayfası

**URL:** `/admin/tenants/{id}`

**Tabs:**
1. **📋 Genel Bilgiler** - Temel tenant bilgileri
2. **💼 Lisans** - Lisans paketi ve limitler
3. **🎨 Branding** - Logo, renk, domain ayarları
4. **✨ Özellikler** - Feature flags
5. **💰 Fatura** - Fatura geçmişi
6. **📊 Kullanım** - Kullanım raporları

### 3. Lisans Yönetimi UI

```
┌───────────────────────────────────────────────┐
│ Mevcut Lisans: PROFESSIONAL                   │
│ Durum: ✅ Aktif                               │
│ Bitiş: 15.12.2025 (21 gün kaldı)            │
├───────────────────────────────────────────────┤
│ Limitler:                                     │
│  👥 Kullanıcılar:  45 / 100  [▓▓▓░░] 45%    │
│  🎓 Öğrenciler:   567 / 1000 [▓▓▓░░] 56%    │
│  ❓ Sorular:    2341 / 5000 [▓▓▓░░] 46%    │
│  📝 Sınavlar:     87 / 200  [▓▓░░░] 43%    │
│  💾 Depolama:   23.4 / 50GB [▓▓░░░] 46%    │
├───────────────────────────────────────────────┤
│ [Yükselt] [Askıya Al] [İptal Et]             │
└───────────────────────────────────────────────┘
```

### 4. Branding Ayarları UI

**3 Tab Yapısı:**

#### Tab 1: 🏢 Genel Ayarlar
```
- Marka İsmi
- Subdomain (ornek.zerquiz.com)
- Özel Domain (www.ornek.com) [DNS Doğrula]
- Logo URL
- Favicon URL
- Login Arka Plan URL
- SEO (Meta Title, Description, Keywords)
```

#### Tab 2: 🎨 Renkler
```
[Hazır Temalar]
[Mavi] [Yeşil] [Kırmızı] [Mor] [Turuncu] [Gri]

[Özel Renk Seçimi]
Ana Renk:     [#3B82F6] [Renk Seç]
İkincil Renk: [#10B981] [Renk Seç]
Vurgu Rengi:  [#F59E0B] [Renk Seç]

[Önizleme]
(Gerçek zamanlı renk önizlemesi)
```

#### Tab 3: ⚙️ Gelişmiş
```
[Özel CSS]
[Metin alanı - 500 satır]

[Özel JavaScript]
[Metin alanı - 500 satır]

[Analytics]
Google Analytics ID: [________]
Facebook Pixel ID:   [________]

[Özellikler]
☑ Özel Branding Etkin
☑ Özel Domain Etkin
☐ Beyaz Etiket (White Label)
```

### 5. Feature Management UI

```
┌─────────────────────────────────────────────┐
│ ✨ ÖZELLIK YÖNETİMİ                         │
├─────────────────────────────────────────────┤
│                                             │
│ 👥 Müvekkil Portalı          [ON] ✅       │
│    Müvekkillerin kendi dosyalarını         │
│    görüntülemesine izin verir              │
│                                             │
│ 💳 Online Ödemeler           [ON] ✅       │
│    Kredi kartı ve online ödeme             │
│    sistemlerini aktif eder                 │
│                                             │
│ ✍️ Döküman İmzalama         [ON] ✅       │
│    Dijital imza ve e-imza özelliklerini    │
│    aktif eder                              │
│                                             │
│ 📹 Video Görüşmeler          [OFF] ❌      │
│    Online video konferans ve görüşme       │
│    özelliklerini aktif eder                │
│                                             │
│ 🔗 API Erişimi               [OFF] ❌      │
│    REST API ve webhook desteği             │
│    (Professional+ gerektirir)              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 KULLANIM SENARYOLARI

### Senaryo 1: Yeni Müşteri Kaydı
```
1. Müşteri kayıt sayfasında paket seçer (Free/Basic/Pro)
2. 14 günlük trial başlar
3. Subdomain otomatik atanır (ornek.zerquiz.com)
4. Default branding ayarları yüklenir
5. Limitler ve özellikler aktif olur
```

### Senaryo 2: Paket Yükseltme
```
1. SuperAdmin veya Tenant Admin upgrade isteği
2. Sistem yeni limitleri hesaplar
3. Fatura oluşturulur (prorated)
4. Ödeme alındıktan sonra yeni paket aktif olur
5. Özellikler ve limitler güncellenir
```

### Senaryo 3: Custom Domain Ekleme
```
1. Tenant Admin custom domain girer
2. Sistem DNS kayıtlarını gösterir
3. Tenant DNS ayarlarını yapar
4. SuperAdmin domain'i doğrular
5. Domain aktif olur
```

### Senaryo 4: Limit Aşımı
```
1. Kullanıcı sayısı limite yaklaşır (%90)
2. Sistem uyarı maili gönderir
3. Limit aşılırsa yeni kayıt engellenir
4. Upgrade önerisi gösterilir
5. SuperAdmin bilgilendirilir
```

---

## 🎯 SONRAKI ADIMLAR

### Faz 1: Backend (2-3 gün)
- [ ] Entity'ler oluştur
- [ ] Database migrations
- [ ] API Controllers
- [ ] Business logic
- [ ] Seed data

### Faz 2: Frontend (2-3 gün)
- [ ] SuperAdmin dashboard
- [ ] License management UI
- [ ] Branding settings UI
- [ ] Feature management UI
- [ ] Usage tracking UI

### Faz 3: Entegrasyon (1 gün)
- [ ] Middleware: Feature check
- [ ] Middleware: Limit check
- [ ] Domain routing
- [ ] Branding injection

### Faz 4: Test & Deployment (1 gün)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Demo data
- [ ] Documentation

---

**TOPLAM SÜRe: 6-8 gün**

---

Bu tasarım, tam profesyonel bir SaaS platformu için gerekli tüm özellikleri içermektedir. Şimdi implementasyona başlayalım mı?

