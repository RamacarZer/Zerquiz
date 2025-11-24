# Zerquiz - Yapılacaklar Listesi ve İlerleme

## ✅ TAMAMLANAN SERVİSLER (5/11)

### 1. ✅ Altyapı Kurulumu
- Docker Compose (RabbitMQ + Redis)
- PostgreSQL database setup script
- 7 ayrı schema oluşturma
- Servis kullanıcıları ve izinler

### 2. ✅ Shared Libraries
**Zerquiz.Shared.Contracts:**
- BaseEntity (multi-tenant desteği ile)
- ITenantContext, ICurrentUserService
- BaseEvent, UserRegisteredEvent, QuestionPublishedEvent
- ApiResponse<T>, PagedResult<T>

**Zerquiz.Shared.Common:**
- AppConstants (Roles, Permissions, Status sabitleri)
- StringExtensions (ToSlug, Truncate)
- DateTimeExtensions
- PasswordHasher (PBKDF2)
- TokenGenerator

### 3. ✅ Core Service (Port 5001)
**Entities:**
- Tenant (slug, custom domain, settings JSONB)
- AuditLog (tüm değişiklikleri takip)

**API Endpoints:**
- GET /api/tenants
- GET /api/tenants/{slug}
- POST /api/tenants
- PUT /api/tenants/{id}

### 4. ✅ Identity Service (Port 5002)
**Entities:**
- User (email, passwordHash, profile JSONB)
- Role (name, permissions array)
- UserRole (many-to-many)
- RefreshToken

**Özellikler:**
- JWT authentication (access + refresh token)
- PBKDF2 password hashing
- Role-based access control

**API Endpoints:**
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh
- POST /api/auth/logout

### 5. ✅ Curriculum Service (Port 5003)
**Entities:**
- EducationModel (TR_MEB, TR_TYT, OXFORD, vb.)
- Curriculum (müfredat: yıl + dönem + versiyon)
- Subject (branş: Matematik, Fizik, vb.)
- Topic (konu hiyerarşisi: konu -> alt konu -> başlık)
- LearningOutcome (kazanım: MATH.09.EQ.01)

**API Endpoints:**
- GET /api/subjects
- GET /api/subjects/{id}
- GET /api/topics/subject/{subjectId}

## 🔄 ŞU ANDA ÜZERİNDE ÇALIŞILIYOR

### 6. ⏳ Questions Service (Port 5004)
**Yapılacaklar:**
- QuestionFormatType entity (multiple_choice, true_false, vb.)
- QuestionPedagogicalType entity (reinforcement, comprehension, vb.)
- Question entity (ana soru kaydı)
- QuestionVersion entity (versiyon kontrolü)
- QuestionSolution entity (text, audio, video çözümler)
- QuestionAsset entity (resim, ses, video, LaTeX, SVG)
- QuestionReview entity (zümre başkanı onayı)

## 📋 BEKLEYEN SERVİSLER (6)

### 7. ⏹️ Exams Service (Port 5005)
- Exam (sınav oluşturma)
- ExamSection (bölümler)
- ExamQuestion (sınav soruları)
- Booklet (A, B, C kitapçıkları)
- BookletQuestion (karışık soru sıraları)
- ExamSession (kullanıcı oturumları)

### 8. ⏹️ Grading Service (Port 5006)
- Response (kullanıcı cevapları)
- ExamResult (sonuçlar)
- QuestionStatistics (soru istatistikleri)
- Certificate (sertifika üretimi)

### 9. ⏹️ Royalty Service (Port 5007)
- Work (eserler)
- WorkAuthor (yazar paylaşımları)
- RoyaltyTransaction (telif işlemleri)
- Payout (ödemeler)
- ReviewFee (zümre başkanı ücretleri)

### 10. ⏹️ API Gateway (Port 5000)
- Ocelot/YARP yapılandırması
- Tenant resolution middleware
- Tüm servislere routing

### 11. ⏹️ React Frontend
**Sayfalar:**
- Auth: Login, Register
- Dashboard: Student, Teacher, Admin
- Questions: List, Create, Edit, Review
- Exams: Create (wizard), List, Play
- Analytics: Results, Statistics
- Settings: Profile, Tenant

## 📊 İSTATİSTİKLER

- ✅ Tamamlanan: 5/11 (45%)
- ⏳ Devam Eden: 1/11 (9%)
- ⏹️ Bekleyen: 5/11 (45%)

**Toplam Oluşturulan:**
- Dosya: 70+
- Satır Kod: ~4,500+
- Servis: 5
- Entity: 20+
- API Endpoint: 15+

## 🎯 SONRAKİ ADIMLAR

1. Questions Service'i tamamla
2. Exams Service'i oluştur
3. Grading Service'i oluştur
4. Royalty Service'i oluştur
5. API Gateway'i yapılandır
6. React frontend'i oluştur
7. Migration scriptlerini çalıştır
8. Tüm servisleri test et
9. README'yi güncelle
10. Deployment hazırlığı

---

**Son Güncelleme:** {timestamp}
**Durum:** Aktif Geliştirme - Questions Service üzerinde çalışılıyor

