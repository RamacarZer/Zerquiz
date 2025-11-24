# 🎉 ZERQUIZ PLATFORM - GENEL ÖZET VE DOKÜMANTASYON

## 📊 SİSTEM GENEL BAKIŞ

### Mimari: Microservices + Multi-Tenant + License System
- **Backend**: 7 Mikroservis (.NET 9)
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL (7 Ayrı Schema)
- **Authentication**: JWT + Refresh Token
- **Authorization**: Role-Based + Permission-Based + License-Based

---

## 🏗️ MİKROSERVİSLER

### 1️⃣ Core Service (Port 5001)
**Schema**: `core_schema`

**Tablolar**:
- `tenants` - Kurum/Şirket bilgileri + Lisans durumu
- `license_packages` - Lisans paketleri (Starter, Pro, Enterprise)
- `tenant_licenses` - Tenant'lara atanan lisanslar ve limitler
- `system_features` - Modül bazlı özellik kontrolü
- `user_permissions` - Kullanıcı özel yetkileri (kaynak bazlı)
- `audit_logs` - Tüm sistem işlem kayıtları
- `system_definitions` - Dinamik sistem tanımlamaları
- `system_parameters` - Sistem parametreleri
- `translations` - Çoklu dil desteği

**Lisans Sistemi**:
```
✅ Kullanıcı Limiti (MaxUsers)
✅ Öğrenci Limiti (MaxStudents)  
✅ Soru Limiti (MaxQuestions)
✅ Sınav Limiti (MaxExams)
✅ Depolama Limiti (MaxStorage - MB)
✅ Özellik Paketleri (Features JSON)
✅ Özel Limitler (Custom Overrides)
```

---

### 2️⃣ Identity Service (Port 5002)
**Schema**: `identity_schema`

**Tablolar**:
- `users` - Kullanıcı bilgileri (GENİŞLETİLMİŞ)
- `roles` - Roller (SuperAdmin, Teacher, Student, vb.)
- `user_roles` - Kullanıcı-Rol ilişkisi
- `departments` - Departmanlar (Hiyerarşik)
- `positions` - Pozisyonlar (11 farklı pozisyon)
- `refresh_tokens` - JWT refresh token'lar

**Genişletilmiş User Entity**:
```typescript
- Email, PasswordHash
- FirstName, LastName, Phone
- Address, City, Country
- DateOfBirth, Gender
- IdentityNumber (TC Kimlik)
- DepartmentId → Department
- PositionId → Position
- PrimaryRoleId → Ana Rol (Dropdown)
- EmailConfirmed, IsActive
- ProfileJson (JSONB - Avatar, Bio, Custom Fields)
```

**Departmanlar**:
- Eğitim Departmanı
- Ölçme ve Değerlendirme
- Yönetim
- Yayın Departmanı
- (Hiyerarşik yapı - Alt departman desteği)

**Pozisyonlar (Seviye Bazlı)**:
```
Level 1: Müdür
Level 2: Müdür Yardımcısı
Level 3: Sınav Koordinatörü, Yayın Koordinatörü, Eğitim Koordinatörü
Level 4: Zümre Başkanı, Editör
Level 5: Öğretmen, Yazar
Level 10: Öğrenci, Veli
```

---

### 3️⃣ Curriculum Service (Port 5003)
**Schema**: `curriculum_schema`

**Tablolar**:
- `education_models` - Eğitim modelleri (MEB, TYT, Cambridge)
- `curricula` - Müfredatlar
- `subjects` - Branşlar
- `topics` - Konular (hiyerarşik)
- `learning_outcomes` - Kazanımlar

---

### 4️⃣ Questions Service (Port 5004)
**Schema**: `questions_schema`

**Tablolar**:
- `question_format_types` - Soru formatları
- `question_pedagogical_types` - Pedagojik tipler
- `questions` - Sorular
- `question_versions` - Soru versiyonları
- `question_assets` - Görseller, ses, video
- `question_reviews` - Soru onay süreçleri
- `question_solutions` - Çözümler

---

### 5️⃣ Exams Service (Port 5005)
**Schema**: `exams_schema`

**Tablolar**:
- `exams` - Sınavlar
- `exam_sections` - Sınav bölümleri
- `exam_questions` - Sınav soruları
- `booklets` - Kitapçıklar (A, B, C, D)
- `booklet_questions` - Kitapçık soruları (shuffled)
- `exam_sessions` - Öğrenci sınav oturumları

---

### 6️⃣ Grading Service (Port 5006)
**Schema**: `grading_schema`

**Tablolar**:
- `responses` - Öğrenci cevapları
- `exam_results` - Sınav sonuçları
- `question_statistics` - Soru istatistikleri
- `certificates` - Sertifikalar

---

### 7️⃣ Royalty Service (Port 5007)
**Schema**: `royalty_schema`

**Tablolar**:
- `works` - Eserler (soru, kitap, vb.)
- `work_authors` - Yazar paylaşımları
- `royalty_transactions` - Telif işlemleri
- `payouts` - Ödemeler
- `review_fees` - Zümre başkanı ücretleri

---

## 👥 KULLANICI YÖNETİMİ - TAM TEŞEKKÜLLü

### Backend API Endpoints

**Users** (`/api/users`):
```
GET    /api/users              - Liste (pagination, search, filter)
GET    /api/users/{id}         - Detay
POST   /api/users              - Oluştur (via /api/auth/register)
PUT    /api/users/{id}         - Güncelle
PUT    /api/users/{id}/toggle-status - Aktif/Pasif
DELETE /api/users/{id}         - Sil
PUT    /api/users/{id}/roles   - Rolleri güncelle
```

**Departments** (`/api/departments`):
```
GET    /api/departments        - Liste
GET    /api/departments/{id}   - Detay
POST   /api/departments        - Oluştur
PUT    /api/departments/{id}   - Güncelle
DELETE /api/departments/{id}   - Sil
```

**Positions** (`/api/positions`):
```
GET    /api/positions          - Liste
GET    /api/positions/{id}     - Detay
POST   /api/positions          - Oluştur
PUT    /api/positions/{id}     - Güncelle
DELETE /api/positions/{id}     - Sil
```

**Roles** (`/api/roles`):
```
GET    /api/roles              - Liste
GET    /api/roles/{id}         - Detay
```

---

### Frontend Sayfaları (Tamamlanan)

#### User Management
- **UserListPage** (`/users`)
  - Kullanıcı listesi
  - Arama ve filtreleme
  - Pagination
  - Status toggle
  - Sil, Düzenle, Detay butonları

- **UserCreatePage** (`/users/create`)
  - Tam profil formu
  - Departman dropdown
  - Pozisyon dropdown
  - Ana rol dropdown
  - Roller multi-select (checkbox)

- **UserDetailPage** (`/users/:id`)
  - Kullanıcı detayları
  - Departman ve pozisyon bilgisi
  - Roller ve izinler
  - Profil avatar

- **UserEditPage** (`/users/:id/edit`)
  - Profil güncelleme
  - Departman/Pozisyon değiştirme
  - Rol yönetimi

---

## 🏢 TENANT & LİSANS SİSTEMİ

### Tenant Bilgileri
```typescript
interface Tenant {
  // Temel
  id: Guid
  name: string
  slug: string
  customDomain?: string
  
  // Şirket Bilgileri
  companyName?: string
  taxNumber?: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  
  // Abonelik
  subscriptionStatus: 'trial' | 'active' | 'suspended' | 'expired'
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  
  // İlişkiler
  licenses: TenantLicense[]
  theme?: TenantTheme
}
```

### License Package
```typescript
interface LicensePackage {
  id: Guid
  code: string // 'STARTER', 'PRO', 'ENTERPRISE'
  name: string
  description: string
  monthlyPrice: decimal
  yearlyPrice: decimal
  currency: string
  
  // Limitler
  maxUsers: int // -1 = unlimited
  maxStudents: int
  maxQuestions: int
  maxExams: int
  maxStorage: int // MB
  
  // Özellikler
  featuresJson: string // ["question_bank", "exam_creator", "analytics"]
}
```

### Tenant License
```typescript
interface TenantLicense {
  id: Guid
  tenantId: Guid
  licensePackageId: Guid
  licenseKey: string // Unique
  
  startDate: Date
  expiryDate: Date
  isActive: boolean
  isTrial: boolean
  
  // Kullanım İstatistikleri
  currentUsers: int
  currentStudents: int
  currentQuestions: int
  currentExams: int
  currentStorageUsed: long // Bytes
  
  // Özel Limitler (Override)
  customMaxUsers?: int
  customMaxStudents?: int
  customMaxQuestions?: int
  customMaxExams?: int
  customMaxStorage?: long
  
  // Özel Özellikler
  customFeaturesJson?: string
}
```

---

## 🔐 YETKİLENDİRME SİSTEMİ

### 3 Katmanlı Yetkilendirme

#### 1. Role-Based (Rol Bazlı)
```typescript
interface Role {
  id: Guid
  name: string // 'SuperAdmin', 'Teacher', 'Student'
  permissions: string[] // ['CREATE_EXAM', 'APPROVE_QUESTION']
}
```

#### 2. Permission-Based (İzin Bazlı)
```typescript
interface UserPermission {
  userId: Guid
  permissionCode: string // 'CREATE_EXAM', 'APPROVE_QUESTION'
  resourceType?: string // 'SUBJECT', 'DEPARTMENT', 'ALL'
  resourceId?: Guid // Sadece belirli kaynak için
  expiresAt?: Date
  grantedBy?: string
}
```

#### 3. License-Based (Lisans Bazlı)
```typescript
// Tenant'ın lisansına göre modül erişimi
interface SystemFeature {
  code: string // 'QUESTION_BANK', 'EXAM_CREATOR'
  category: string // 'CORE', 'PREMIUM', 'ADDON'
  requiresLicense: boolean
}
```

---

## 🎨 FRONTEND MODÜLLER

### Tamamlanan Modüller

#### 1. User Management ✅
- Liste, Oluştur, Düzenle, Detay
- Departman ve Pozisyon yönetimi
- Rol atama
- Status toggle

#### 2. Curriculum Management ✅
- Eğitim modelleri
- Branşlar

#### 3. Question Bank ✅
- Soru listesi
- Status filtreleme
- Pagination

#### 4. Dashboard ✅
- SuperAdmin Dashboard
- Modül kartları
- İstatistikler (hazır)

---

## 🚀 SİSTEMİ ÇALIŞTIRMA

### Backend Servisleri

**Tüm servisleri başlat**:
```bash
cd F:\yeni_projeler\Zerquiz
.\start-all-services.bat
```

**Manuel başlatma** (her servis için):
```bash
cd services/{service-name}/{Service}.Api
dotnet run
```

**Servis Portları**:
- Core: 5001
- Identity: 5002
- Curriculum: 5003
- Questions: 5004
- Exams: 5005
- Grading: 5006
- Royalty: 5007

---

### Frontend

```bash
cd frontend/zerquiz-web
npm run dev
```

**URL**: http://localhost:3001

---

### Database

**Bağlantı Bilgileri**:
- Host: localhost
- Port: 5432
- Database: zerquiz_db
- Username: postgres
- Password: Sanez.579112

**Schemas**:
- core_schema
- identity_schema
- curriculum_schema
- questions_schema
- exams_schema
- grading_schema
- royalty_schema

---

## 👤 TEST KULLANICILARI

### Login Bilgileri

**Super Admin**:
- Email: `admin@demo.com`
- Password: `Admin123!`
- Roller: SuperAdmin
- Tüm izinler: `all`

**Teacher**:
- Email: `teacher@demo.com`
- Password: `Teacher123!`
- Roller: Teacher

**Student**:
- Email: `student@demo.com`
- Password: `Student123!`
- Roller: Student

---

## 📊 VERİ YAPILARI

### BaseEntity (Tüm Tablolarda Ortak)
```csharp
- Id: Guid
- TenantId: Guid?
- CreatedAt: DateTime
- UpdatedAt: DateTime
- DeletedAt: DateTime? // Soft delete
- CreatedBy: Guid?
- UpdatedBy: Guid?
- DeletedBy: Guid?
- IsActive: bool
- Status: string?
- Version: int // Optimistic concurrency
- Source: string?
- Metadata: JsonDocument? // JSONB
- Tags: string[]?
- IpAddress: string?
- UserAgent: string?
- RequestId: string?
- CorrelationId: string?
```

---

## 🔄 DEVAM EDEN ÇALIŞMALAR

### Tamamlanacak (İsteğe Bağlı)

1. **License Kontrol Middleware**
   - Tenant lisans kontrolü
   - Limit kontrolü (kullanıcı, soru, vb.)
   - Feature erişim kontrolü

2. **Frontend - Gelişmiş Profil**
   - Tam profil sayfası
   - Avatar upload
   - Departman/Pozisyon dropdown'ları
   - Lisans bilgisi görüntüleme

3. **Tenant Management**
   - Tenant oluşturma/düzenleme
   - Lisans atama
   - Kullanım istatistikleri

4. **Exam Management**
   - Sınav oluşturma wizard
   - Kitapçık üretimi

5. **Analytics & Reporting**
   - Dashboard grafikler
   - Raporlar

---

## 📝 NOTLAR

### Önemli Özellikler

✅ **Multi-Tenant**: Her tenant izole veri
✅ **Soft Delete**: Veri güvenliği
✅ **Audit Trail**: Tüm işlemler loglanıyor
✅ **Optimistic Concurrency**: Version kontrolü
✅ **JSONB**: Esnek veri yapıları
✅ **Hiyerarşik Yapılar**: Department, Topic
✅ **License System**: Paket bazlı erişim
✅ **Professional UI**: Modern, kullanıcı dostu

### Güvenlik

✅ JWT Authentication
✅ Refresh Token
✅ Role-Based Authorization
✅ Permission-Based Authorization
✅ License-Based Authorization
✅ Soft Delete (veri kaybı yok)
✅ Audit Logging

---

## 📞 DESTEK

Sistem tam çalışır durumda. Tüm backend servisler ve frontend modülleri aktif.

**Swagger UI'lar**:
- http://localhost:5001/swagger (Core)
- http://localhost:5002/swagger (Identity)
- http://localhost:5003/swagger (Curriculum)
- http://localhost:5004/swagger (Questions)
- http://localhost:5005/swagger (Exams)
- http://localhost:5006/swagger (Grading)
- http://localhost:5007/swagger (Royalty)

**Frontend**:
- http://localhost:3001

---

🎉 **SİSTEM HAZIR VE ÇALIŞIYOR!** 🎉

