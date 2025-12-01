# 🚀 YENİ HİYERARŞİK TANIM SİSTEMİ KURULUM KILAVUZU

## 📋 ÇALIŞTIRILACAK SCRIPTLER (SIRA ÖNEMLİ!)

### ✅ **ADIM 1: Backup Al**
```bash
# pgAdmin veya psql ile çalıştır:
psql -h localhost -U postgres -d zerquiz_db -f backup_existing_definitions.sql
```

**Ne yapar?**
- Mevcut `curriculum_schema.definition_groups` → Backup
- Mevcut `curriculum_schema.definitions` → Backup
- Mevcut `curriculum_schema.definition_translations` → Backup
- Mevcut `questions_schema.question_types` → Backup

**Doğrulama:**
```sql
SELECT * FROM curriculum_schema.definition_groups_backup_20251201 LIMIT 5;
```

---

### ✅ **ADIM 2: Yeni Yapıyı Oluştur**
```bash
psql -h localhost -U postgres -d zerquiz_db -f create_hierarchical_definitions_system.sql
```

**Ne yapar?**
- `core_schema.definition_groups` tablosu oluşturur
- `core_schema.definition_group_translations` tablosu oluşturur
- `core_schema.definitions` tablosu oluşturur (ParentId, ChildIds, AccessControl)
- `core_schema.definition_translations` tablosu oluşturur
- `core_schema.definition_relations` tablosu oluşturur (many-to-many)
- Helper fonksiyonlar ekler

**Doğrulama:**
```sql
\dt core_schema.definition*
```

---

### ✅ **ADIM 3: Verileri Migrate Et**
```bash
psql -h localhost -U postgres -d zerquiz_db -f migrate_existing_data_to_new_structure.sql
```

**Ne yapar?**
- Eski definition_groups → Yeni yapıya
- Eski definitions → Yeni yapıya (ParentId korunur)
- ChildIds otomatik güncellenir
- Translations taşınır
- Question types migrate edilir

**Doğrulama:**
```sql
-- Kaç kayıt taşındı?
SELECT 
    'definitions' as table_name,
    COUNT(*) as count
FROM core_schema.definitions
UNION ALL
SELECT 
    'translations',
    COUNT(*)
FROM core_schema.definition_translations;

-- Hiyerarşi kontrolü
SELECT 
    d."Code",
    d."Level",
    d."Path",
    p."Code" as parent_code,
    array_length(d."ChildIds", 1) as child_count
FROM core_schema.definitions d
LEFT JOIN core_schema.definitions p ON d."ParentId" = p."Id"
WHERE d."ParentId" IS NOT NULL
LIMIT 10;
```

---

## 🎯 YENİ ÖZELLİKLER

### 1️⃣ **Sonsuz Hiyerarşi**
```sql
-- Örnek: Matematik > Cebir > Denklemler > 1. Derece Denklemler
INSERT INTO core_schema.definitions (...) VALUES
    ('mathematics', NULL, 0, '/mathematics/'),
    ('algebra', 'mathematics_id', 1, '/mathematics/algebra/'),
    ('equations', 'algebra_id', 2, '/mathematics/algebra/equations/');
```

### 2️⃣ **Çok-Yönlü İlişkiler (ChildIds)**
```sql
-- Parent'tan tüm childlara erişim
SELECT * FROM core_schema.definitions
WHERE "Id" = ANY(SELECT unnest("ChildIds") FROM core_schema.definitions WHERE "Code" = 'mathematics');
```

### 3️⃣ **IP, Cihaz, Uygulama Bazlı Kontrol**
```sql
UPDATE core_schema.definitions
SET "AccessControl" = '{
    "roles": ["Teacher", "Admin"],
    "modules": ["questions", "exams"],
    "deviceTypes": ["web", "mobile"],
    "ipWhitelist": ["192.168.1.0/24"],
    "ipBlacklist": ["10.0.0.5"],
    "allowedApps": ["zerquiz-mobile-v1"],
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "timeSlots": [{"start": "09:00", "end": "17:00"}]
}'::JSONB
WHERE "Code" = 'mcq_single';
```

### 4️⃣ **Multi-Tenant Support**
```sql
-- Global tanım
INSERT INTO core_schema.definitions ("TenantId", ...) VALUES (NULL, ...);

-- Tenant özel tanım
INSERT INTO core_schema.definitions ("TenantId", ...) VALUES ('tenant-uuid', ...);
```

### 5️⃣ **Çoklu Dil (7+ Dil)**
```sql
INSERT INTO core_schema.definition_translations VALUES
    ('def-id', 'tr', 'Çoktan Seçmeli'),
    ('def-id', 'en', 'Multiple Choice'),
    ('def-id', 'ar', 'اختيار من متعدد');
```

---

## 📊 ÖNEMLİ QUERYLER

### Dropdown için Tanımlar (Multi-language)
```sql
SELECT 
    d."Id",
    d."Code",
    COALESCE(dt."Value", d."Value") as "Name",
    d."DisplayOrder",
    d."IconName",
    d."ParentId",
    d."Level"
FROM core_schema.definitions d
LEFT JOIN core_schema.definition_translations dt 
    ON d."Id" = dt."DefinitionId" 
    AND dt."LanguageCode" = 'tr'
WHERE d."GroupId" = (SELECT "Id" FROM core_schema.definition_groups WHERE "Code" = 'question_types')
    AND d."IsActive" = true
    AND d."IsSelectable" = true
    AND (d."TenantId" IS NULL OR d."TenantId" = @CurrentTenantId)
ORDER BY d."DisplayOrder", d."Value";
```

### Hiyerarşik Ağaç (Recursive)
```sql
WITH RECURSIVE tree AS (
    SELECT 
        "Id", "Code", "Value", "ParentId", 0 as level,
        "Code" as path
    FROM core_schema.definitions
    WHERE "ParentId" IS NULL AND "GroupId" = @GroupId
    
    UNION ALL
    
    SELECT 
        d."Id", d."Code", d."Value", d."ParentId", t.level + 1,
        t.path || ' > ' || d."Code"
    FROM core_schema.definitions d
    INNER JOIN tree t ON d."ParentId" = t."Id"
)
SELECT * FROM tree ORDER BY path;
```

### Access Control Check
```sql
SELECT core_schema.check_definition_access(
    @DefinitionId,
    'Teacher', -- role
    'questions', -- module
    'web', -- device
    '192.168.1.100'::INET -- IP
);
```

---

## ✅ BAŞARILI KURULUM KONTROLÜ

Şu query'i çalıştır:
```sql
SELECT 
    'Groups' as entity,
    COUNT(*) as total,
    COUNT(DISTINCT "ModuleCode") as modules
FROM core_schema.definition_groups
UNION ALL
SELECT 
    'Definitions',
    COUNT(*),
    COUNT(DISTINCT "GroupId")
FROM core_schema.definitions
UNION ALL
SELECT 
    'Translations',
    COUNT(*),
    COUNT(DISTINCT "LanguageCode")
FROM core_schema.definition_translations;
```

**Beklenen sonuç:**
```
entity          | total | modules
----------------|-------|--------
Groups          | 10+   | 5+
Definitions     | 100+  | 10+
Translations    | 200+  | 3+
```

---

## 🚨 HATA ÇÖZÜMLEME

### Hata: "Admin user not found"
```sql
-- Admin user'ı kontrol et
SELECT "Id", "Email" FROM identity_schema.users WHERE "Email" = 'admin@zerquiz.com';

-- Yoksa migration script'ini düzenle (admin_user_id)
```

### Hata: "Relation already exists"
```sql
-- Tabloları düşür (DİKKATLİ!)
DROP TABLE IF EXISTS core_schema.definition_relations CASCADE;
DROP TABLE IF EXISTS core_schema.definition_translations CASCADE;
DROP TABLE IF EXISTS core_schema.definitions CASCADE;
DROP TABLE IF EXISTS core_schema.definition_group_translations CASCADE;
DROP TABLE IF EXISTS core_schema.definition_groups CASCADE;

-- Sonra tekrar çalıştır: create_hierarchical_definitions_system.sql
```

---

## 🎉 TAMAMLANDI!

Şimdi backend API'leri ve frontend dropdown'ları güncelleyebiliriz! 🚀

