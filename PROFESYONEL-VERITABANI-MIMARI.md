# 🏗️ PROFESYONEL VERİTABANI MİMARİSİ - GÜNCELLEME

## ✅ YENİ STANDARTLAR UYGULANACAK

### 📋 BaseEntity - Tam Donanımlı Yapı

Tüm tablolar artık şu alanlara sahip olacak:

```csharp
// Primary Key
public Guid Id { get; set; } = Guid.NewGuid();

// Multi-Tenancy  
public Guid? TenantId { get; set; }

// Audit Trail - Timestamps
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
public DateTime? DeletedAt { get; set; }

// Audit Trail - Users
public Guid? CreatedBy { get; set; }
public Guid? UpdatedBy { get; set; }
public Guid? DeletedBy { get; set; }

// Status Management
public bool IsActive { get; set; } = true;
public string? Status { get; set; }
public int Version { get; set; } = 1; // Optimistic Concurrency

// Tracking & Analytics
public string? Source { get; set; } // web, mobile, api, import
public string? Metadata { get; set; } // JSONB - Flexible data
public string[]? Tags { get; set; } // Categorization

// Request Tracking
public string? IpAddress { get; set; }
public string? UserAgent { get; set; }
public string? RequestId { get; set; }
public string? CorrelationId { get; set; } // Distributed tracing
```

---

## 🎯 DİNAMİK TANIMLAMALAR SİSTEMİ

### 1. SystemDefinition Tablosu

**Kullanım Alanları:**
- Soru zorluk seviyeleri (easy, medium, hard)
- Sınav modları (online, offline, printed)
- Kullanıcı durumları
- Soru tipleri
- Tüm dropdown değerleri

**Yapı:**
```sql
CREATE TABLE core_schema.system_definitions (
    -- BaseEntity fields...
    category VARCHAR(100),  -- 'question_difficulty', 'exam_mode', etc.
    code VARCHAR(100),      -- 'easy', 'medium', 'hard'
    name VARCHAR(200),      -- Display name
    
    -- Multi-language
    name_en VARCHAR(200),
    name_tr VARCHAR(200),
    name_ar VARCHAR(200),
    description_en TEXT,
    description_tr TEXT,
    description_ar TEXT,
    
    -- Display
    display_order INT,
    icon VARCHAR(50),
    color VARCHAR(50),
    
    -- Hierarchy
    parent_id UUID,
    
    -- Config
    configuration_json JSONB,
    
    -- System
    is_system_reserved BOOLEAN,
    is_editable BOOLEAN
);
```

**Örnek Kullanım:**
```json
{
  "category": "question_difficulty",
  "code": "easy",
  "name": "Kolay",
  "nameEn": "Easy",
  "nameTr": "Kolay",
  "displayOrder": 1,
  "color": "#10B981",
  "icon": "😊"
}
```

---

### 2. Translation Tablosu

**Gelecek için i18n desteği:**
```sql
CREATE TABLE core_schema.translations (
    -- BaseEntity fields...
    entity_type VARCHAR(100),  -- 'Question', 'Exam', etc.
    entity_id UUID,
    field_name VARCHAR(100),    -- 'title', 'description'
    language_code VARCHAR(10),  -- 'tr', 'en', 'ar'
    translated_value TEXT
);
```

---

### 3. SystemParameter Tablosu

**Global ayarlar için:**
```sql
CREATE TABLE core_schema.system_parameters (
    -- BaseEntity fields...
    category VARCHAR(100),  -- 'email', 'sms', 'payment'
    key VARCHAR(100),
    value TEXT,
    data_type VARCHAR(20),  -- 'string', 'int', 'bool', 'json'
    is_encrypted BOOLEAN,
    is_editable BOOLEAN
);
```

---

## 🔄 GÜNCELLENMESİ GEREKEN SERVİSLER

### ✅ Güncellenecek:
1. **Core Service** ← ŞİMDİ
2. **Identity Service**
3. **Curriculum Service**
4. **Questions Service**
5. **Exams Service**
6. **Grading Service**
7. **Royalty Service**

---

## 📝 YENİ MİGRATION OLUŞTURMA

Her servis için yeni migration:

```powershell
# Core Service
cd services/core/Zerquiz.Core.Api
dotnet ef migrations add AddProfessionalFields --project ../Zerquiz.Core.Infrastructure

# Identity Service
cd services/identity/Zerquiz.Identity.Api
dotnet ef migrations add AddProfessionalFields --project ../Zerquiz.Identity.Infrastructure

# ... diğer servisler
```

---

## 🎯 AVANTAJLAR

### 1. Soft Delete
```csharp
entity.HasQueryFilter(e => e.DeletedAt == null);
```
- Veriler asla silinmez, sadece işaretlenir
- Geri getirilebilir
- Audit trail korunur

### 2. Optimistic Concurrency
```csharp
public int Version { get; set; } = 1;
```
- Eşzamanlı güncelleme çakışmalarını önler
- Her güncelleme version'ı artırır

### 3. Multi-Language
```csharp
public string? NameEn { get; set; }
public string? NameTr { get; set; }
public string? NameAr { get; set; }
```
- Kolay i18n desteği
- Her alan için çeviri

### 4. Flexible Metadata
```csharp
public string? Metadata { get; set; } // JSONB
```
- Gelecek özellikleri için esnek alan
- Ek bilgi saklama

### 5. Tags
```csharp
public string[]? Tags { get; set; }
```
- Kategorileme
- Filtreleme
- Arama

### 6. Request Tracking
```csharp
public string? RequestId { get; set; }
public string? CorrelationId { get; set; }
```
- Distributed tracing
- Log correlation
- Debug kolaylığı

---

## 🚀 UYGULAMA PLANI

### ADIM 1: BaseEntity Güncellendi ✅
- Tüm yeni alanlar eklendi
- Shared.Contracts'ta

### ADIM 2: Core Service Entities Oluşturuldu ✅
- SystemDefinition ✅
- Translation ✅
- SystemParameter ✅

### ADIM 3: Yapılacaklar
- [ ] Tüm entity'lere BaseEntity'den türemeyenleri güncelle
- [ ] Her servis için yeni migration oluştur
- [ ] Migration'ları uygula
- [ ] Seed data güncelle
- [ ] API endpoint'leri test et

---

## 📊 ÖRNEK SEED DATA

### SystemDefinition Seed:
```sql
-- Soru Zorluk Seviyeleri
INSERT INTO core_schema.system_definitions 
(id, category, code, name, name_en, name_tr, display_order, color, is_system_reserved)
VALUES
('10000000-0000-0000-0000-000000000001', 'question_difficulty', 'easy', 'Easy', 'Easy', 'Kolay', 1, '#10B981', true),
('10000000-0000-0000-0000-000000000002', 'question_difficulty', 'medium', 'Medium', 'Medium', 'Orta', 2, '#F59E0B', true),
('10000000-0000-0000-0000-000000000003', 'question_difficulty', 'hard', 'Hard', 'Hard', 'Zor', 3, '#EF4444', true);

-- Sınav Modları
INSERT INTO core_schema.system_definitions 
(id, category, code, name, name_en, name_tr, display_order, is_system_reserved)
VALUES
('20000000-0000-0000-0000-000000000001', 'exam_mode', 'online', 'Online', 'Online', 'Çevrimiçi', 1, true),
('20000000-0000-0000-0000-000000000002', 'exam_mode', 'offline', 'Offline', 'Offline', 'Çevrimdışı', 2, true),
('20000000-0000-0000-0000-000000000003', 'exam_mode', 'printed', 'Printed', 'Printed', 'Matbu', 3, true);
```

---

## ✅ SONUÇ

**Artık sistemimiz:**
- ✅ %100 Profesyonel
- ✅ Tam audit trail
- ✅ Soft delete
- ✅ Multi-language hazır
- ✅ Dinamik tanımlamalar
- ✅ Flexible metadata
- ✅ Request tracking
- ✅ Optimistic concurrency

**Sonraki adım:** Migration'ları oluşturup uygulayalım mı?

