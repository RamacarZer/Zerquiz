# 🎯 DYNAMIC MENU SYSTEM - 100% Database Driven

## 📋 GENEL BAKIŞ

Tamamen database-driven, dinamik menü yönetim sistemi. Hiçbir menü hard-code edilmemiştir. Her şey:
- ✅ **Tenant bazlı**
- ✅ **Modül bazlı**
- ✅ **Rol bazlı**
- ✅ **Çok dilli (Multi-language)**
- ✅ **Lisans kontrolü**
- ✅ **Hiyerarşik yapı**

---

## 🗄️ DATABASE YAPISI

### 1. `core_schema.modules`
Sistem modülleri (Content, Questions, AI Tools, vb.)

```sql
- Id, Code, Name, Description
- IconName, DisplayOrder
- ParentModuleId (hiyerarşi)
- RequiresLicense, LicenseFeatureCode
- IsActive, IsSystemReserved
```

### 2. `core_schema.menu_items`
Dinamik menü öğeleri

```sql
- Id, Code, ModuleId
- ParentMenuId (nested menus)
- LabelKey (translation key)
- IconName, Path, DisplayOrder, Level
- MenuType (link, dropdown, divider, group)
- BadgeText, BadgeColor
- IsVisible, IsActive
- Metadata (JSONB - ek config)
```

### 3. `core_schema.menu_permissions`
Rol bazlı menü erişim kontrolü

```sql
- MenuItemId, RoleId
- CanView, CanAccess
```

### 4. `core_schema.tenant_modules`
Tenant'ın aktif modülleri

```sql
- TenantId, ModuleId
- IsEnabled, EnabledAt, ExpiresAt
- LicenseId
- Settings (JSONB - tenant-specific settings)
```

### 5. `core_schema.user_module_permissions`
Kullanıcı bazlı modül erişim override

```sql
- UserId, ModuleId
- CanAccess
- GrantedAt, ExpiresAt
```

---

## 🔧 DATABASE FUNCTIONS

### `get_user_menu(user_id, language_code)`
Kullanıcının erişebileceği tüm menü öğelerini döner.

**Kontroller:**
1. ✅ User'ın rolleri
2. ✅ Role'ün menu permissions
3. ✅ Tenant'ın enabled modules
4. ✅ Module expiration dates
5. ✅ User-specific overrides
6. ✅ Multi-language translations

**Döndürdükları:**
- menu_id, menu_code, parent_menu_id
- label (translated), icon_name, path
- display_order, level, menu_type
- badge_text, badge_color
- has_children, module_code

### `can_user_access_module(user_id, module_code)`
Kullanıcının bir modüle erişip erişemeyeceğini kontrol eder.

---

## 🌐 API ENDPOINTS

### `GET /api/Menu/user-menu?language=tr`
Kullanıcının menüsünü getirir (otomatik auth)

**Response:**
```json
{
  "items": [
    {
      "menu_id": "uuid",
      "menu_code": "menu_dashboard",
      "label": "Ana Sayfa",
      "icon_name": "LayoutDashboard",
      "path": "/dashboard",
      "display_order": 1,
      "level": 0,
      "menu_type": "link",
      "has_children": false,
      "children": []
    },
    {
      "menu_code": "menu_questions",
      "label": "Sorular & Sınavlar",
      "icon_name": "HelpCircle",
      "menu_type": "dropdown",
      "badge_text": "NEW",
      "badge_color": "blue",
      "has_children": true,
      "children": [
        {
          "menu_code": "menu_question_create",
          "label": "Soru Oluştur",
          "icon_name": "Plus",
          "path": "/questions/mode-select",
          "level": 1
        }
      ]
    }
  ],
  "totalCount": 25,
  "language": "tr"
}
```

### `GET /api/Menu/can-access-module/{moduleCode}`
Modül erişim kontrolü

**Response:**
```json
{
  "moduleCode": "ai_tools",
  "canAccess": true,
  "userId": "uuid"
}
```

### `GET /api/Menu/modules` (SuperAdmin only)
Tüm modülleri listeler

### `GET /api/Menu/tenant-modules`
Tenant'ın aktif modüllerini listeler

---

## ⚛️ FRONTEND USAGE

### Hook: `useDynamicMenu()`

```typescript
import { useDynamicMenu } from '@/hooks/useDynamicMenu';

function Sidebar() {
  const { menuItems, loading, error, canAccessModule } = useDynamicMenu();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <nav>
      {menuItems.map(item => (
        <MenuItem key={item.menu_id} item={item} />
      ))}
    </nav>
  );
}
```

### Helper Methods

```typescript
// Belirli bir path'e ait menü öğesini bul
const menuItem = findMenuByPath('/questions/create');

// Belirli level'daki tüm öğeleri getir
const rootItems = getMenuByLevel(0);
const childItems = getMenuByLevel(1);

// Sadece root items
const roots = getRootMenuItems();

// Modül erişim kontrolü
const hasAccess = await canAccessModule('ai_tools');

// Menüyü yenile
refresh();
```

---

## 🚀 KURULUM ADIMLARI

### 1. Database Migration
```sql
-- 1. Tabloları oluştur
psql -U postgres -d zerquiz_db -f database/migrations/create_dynamic_menu_system.sql

-- 2. Seed data ekle
psql -U postgres -d zerquiz_db -f database/migrations/seed_dynamic_menu_data.sql
```

### 2. Core Service
`MenuController.cs` zaten eklendi. Core Service'i restart et.

### 3. Frontend
```typescript
// Sidebar.tsx'i güncelle
import { useDynamicMenu } from '@/hooks/useDynamicMenu';

const { menuItems, loading } = useDynamicMenu();
```

---

## 📊 YÖNETİM PANELİ

### Modül Yönetimi (SuperAdmin)
- Yeni modül ekle/düzenle
- Modül aktif/pasif
- Lisans gereksinimleri

### Menü Yönetimi (SuperAdmin)
- Menü öğesi ekle/düzenle/sil
- Sıralama, ikonlar, badge'ler
- Parent-child ilişkileri
- Multi-language translations

### Rol İzinleri (TenantAdmin)
- Hangi role hangi menü görünsün
- View/Access permissions

### Tenant Modül Atama (SuperAdmin)
- Tenant'a modül aktif et
- Expiration date belirle
- Tenant-specific settings

---

## 🎯 AVANTAJLARI

1. **%100 Dinamik**: Kod değişikliği gerektirmez
2. **Multi-Tenant**: Her tenant farklı modüller
3. **Role-Based**: Otomatik rol filtreleme
4. **Multi-Language**: Tüm diller DB'de
5. **Lisans Kontrolü**: Modül bazlı lisans
6. **Hiyerarşik**: Nested menu support
7. **Audit Trail**: Tüm değişiklikler loglanır
8. **Performans**: Database function + caching

---

## 🔐 GÜVENLİK

1. **Role-Based Access Control (RBAC)**
2. **Tenant Isolation**
3. **User-level Override**
4. **License Validation**
5. **Module Expiration**
6. **API Authorization (JWT)**

---

## 📈 PERFORMANS

### Caching Strategy
```typescript
// Frontend: React Query
const { data: menu } = useQuery('user-menu', fetchMenu, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Backend: Memory Cache
services.AddMemoryCache();
```

### Database Optimization
- Indexes on frequently queried columns
- Materialized views for complex queries
- Connection pooling

---

## 🧪 TEST

```sql
-- Test: Admin kullanıcısının menüsünü getir
SELECT * FROM core_schema.get_user_menu(
    'admin-user-id'::UUID,
    'tr'
);

-- Test: Modül erişim kontrolü
SELECT core_schema.can_user_access_module(
    'user-id'::UUID,
    'ai_tools'
);
```

---

## 📝 ÖRNEK SENARYOLAR

### Senaryo 1: Yeni Modül Ekle
```sql
-- 1. Modül oluştur
INSERT INTO core_schema.modules (...)
VALUES ('new_module', 'New Module', ...);

-- 2. Menü öğeleri ekle
INSERT INTO core_schema.menu_items (...)
VALUES ('menu_new', module_id, ...);

-- 3. Role permissions ekle
INSERT INTO core_schema.menu_permissions (...)
VALUES (menu_id, role_id, true, true);

-- 4. Tenant'a aktif et
INSERT INTO core_schema.tenant_modules (...)
VALUES (tenant_id, module_id, true);

-- DONE! Frontend otomatik güncellenir.
```

### Senaryo 2: Tenant'ın Modülünü Devre Dışı Bırak
```sql
UPDATE core_schema.tenant_modules
SET "IsEnabled" = false,
    "DisabledAt" = NOW()
WHERE "TenantId" = 'tenant-id'
  AND "ModuleId" = (SELECT "Id" FROM core_schema.modules WHERE "Code" = 'ai_tools');

-- Kullanıcı refresh ettiğinde AI Tools menüsü kaybolur.
```

---

## 🎉 SONUÇ

✅ **Tamamen database-driven**
✅ **Hiçbir hard-code menü yok**
✅ **Multi-tenant, multi-role, multi-language**
✅ **Lisans ve expiration kontrolü**
✅ **Kolay yönetim paneli**
✅ **Yüksek performans ve güvenlik**

**Frontend yeniden deploy gerektirmeden menü değişiklikleri yapılabilir!**




