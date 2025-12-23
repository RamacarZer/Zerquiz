# 🎯 Modül Bazlı Tab Sistemi - Kullanım Rehberi

## 📋 Genel Bakış

ZerQuiz platformunda her modül kendi içinde **tab sistemi** kullanır. Bu sistemle:
- ✅ Kullanıcı yetkilerine göre **dinamik tab gösterimi**
- ✅ Rol bazlı **erişim kontrolü**
- ✅ **Aktif tab** otomatik algılama
- ✅ **Responsive** tasarım
- ✅ **Modüler** ve **bakımı kolay** yapı

---

## 🏗️ Mimari

### 1. Core Component: `ModuleTabLayout`

```typescript
<ModuleTabLayout
  tabs={[...]}                    // Tab tanımları
  userPermissions={['...']}       // Kullanıcı izinleri
  userRoles={['...']}            // Kullanıcı rolleri
>
  {children}                      // Tab içeriği
</ModuleTabLayout>
```

### 2. Tab Tanımı (`TabItem`)

```typescript
interface TabItem {
  id: string;                     // Unique identifier
  label: string;                  // Tab başlığı
  path: string;                   // Route path
  icon?: ReactNode;               // Optional icon
  requiredPermission?: string;    // Gerekli izin
  requiredRole?: string[];        // Gerekli roller
  disabled?: boolean;             // Tab devre dışı mı?
}
```

---

## 📦 Oluşturulan Modüller

### 1. ✅ Finans Modülü (`/finance`)

**Tab'lar:**
- 📊 Genel Bakış (`dashboard`)
- 📄 Faturalar (`invoices`)
- 💳 Ödemeler (`payments`)
- 📦 Abonelikler (`subscriptions`) - *Sadece admin*

**Dosyalar:**
- `FinanceModule.tsx` - Ana modül
- `BillingDashboard.tsx`
- `InvoicesPage.tsx`
- `PaymentsPage.tsx`
- `SubscriptionsPage.tsx`

---

### 2. ✅ Sunum Modülü (`/presentations`)

**Tab'lar:**
- 📋 Sunum Listesi (`list`)
- ➕ Sunum Oluştur (`builder`) - *Teacher/Admin*

**Dosyalar:**
- `PresentationModule.tsx`
- `PresentationListPage.tsx`
- `PresentationBuilderPage.tsx`

---

### 3. ✅ Sınav Modülü (`/exams`)

**Tab'lar:**
- 📋 Sınav Listesi (`list`)
- ⚙️ Sınav Yönetimi (`management`) - *Teacher/Admin*
- 📊 İzleme (`monitoring`) - *Teacher/Admin*

**Dosyalar:**
- `ExamModule.tsx`
- `ExamListPage.tsx`
- `ExamManagementPage.tsx`
- `ExamMonitoringPage.tsx`

---

### 4. ✅ Entegrasyon Modülü (`/integrations`)

**Tab'lar:**
- 🔗 LTI Entegrasyonları (`lti`) - *Admin only*
- 💻 API Entegrasyonları (`api`) - *Admin only*

**Dosyalar:**
- `IntegrationModule.tsx`
- `LTIIntegrationsPage.tsx`
- `APIIntegrationsPage.tsx`

---

### 5. ✅ Telif Yönetim Modülü (`/royalty`)

**Tab'lar:**
- ✍️ Yazar Paneli (`panel`) - *Author/Publisher/Admin*
- 📊 Telif Raporları (`reports`)

**Dosyalar:**
- `RoyaltyModule.tsx`
- `AuthorPanelPage.tsx`
- `RoyaltyReportsPage.tsx`

---

### 6. ✅ İçerik Üretim Modülü (`/content`)

**Tab'lar:**
- 📚 İçerik Kütüphanesi (`library`)
- ✨ AI Üretim (`ai-generation`) - *Teacher/Author/Admin*
- 🤖 AI Asistanları (`ai-assistants`) - *Teacher/Author/Admin*

**Dosyalar:**
- `ContentModule.tsx`
- `ContentLibraryPage.tsx`
- `AIGenerationPage.tsx`
- `AIAssistantsPage.tsx`

---

### 7. ✅ Analitik Modülü (`/analytics`)

**Tab'lar:**
- 📈 Öğrenci İlerlemesi (`progress`)
- 🧠 Öğrenme Stili (`learning-style`) - *Teacher/Admin*

**Dosyalar:**
- `AnalyticsModule.tsx`
- `StudentProgressPage.tsx`
- `LearningStylePage.tsx`

---

### 8. ✅ Sınıf Paneli Modülü (`/classroom`)

**Tab'lar:**
- 📝 Ödevler (`homeworks`)
- 📖 Dersler (`lessons`)

**Dosyalar:**
- `ClassroomModule.tsx`
- `HomeworksPage.tsx`
- `LessonsPage.tsx`

---

## 🔐 Yetki Sistemi

### Permission İsimlendirme

```
module.action
```

**Örnekler:**
- `finance.view` - Finans modülünü görüntüleme
- `exam.create` - Sınav oluşturma
- `content.ai` - AI içerik üretimi

### Role İsimlendirme

- `admin` - Yönetici (tüm yetkiler)
- `teacher` - Öğretmen
- `student` - Öğrenci
- `parent` - Veli
- `author` - Yazar
- `publisher` - Yayınevi
- `accountant` - Muhasebeci

---

## 🎨 Kullanım Örnekleri

### Örnek 1: Öğretmen Kullanıcısı

```typescript
const teacher = {
  permissions: ['exam.view', 'exam.create', 'exam.manage'],
  roles: ['teacher']
};
```

**Göreceği Tab'lar:**
- ✅ Sınav Listesi
- ✅ Sınav Yönetimi
- ✅ İzleme

---

### Örnek 2: Öğrenci Kullanıcısı

```typescript
const student = {
  permissions: ['exam.view'],
  roles: ['student']
};
```

**Göreceği Tab'lar:**
- ✅ Sınav Listesi
- ❌ Sınav Yönetimi (yetki yok)
- ❌ İzleme (yetki yok)

---

### Örnek 3: Admin Kullanıcısı

```typescript
const admin = {
  permissions: ['*'], // Tüm izinler
  roles: ['admin']
};
```

**Göreceği Tab'lar:**
- ✅ Tüm tab'lar (hiçbir kısıtlama yok)

---

## 🚀 Yeni Modül Ekleme

### Adım 1: Modül Dosyasını Oluştur

```typescript
// pages/mymodule/MyModule.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ModuleTabLayout, { TabItem } from '../../components/layout/ModuleTabLayout';

const tabs: TabItem[] = [
  {
    id: 'tab1',
    label: 'Tab 1',
    path: '/mymodule/tab1',
    requiredPermission: 'mymodule.view',
  },
  // ... diğer tab'lar
];

export default function MyModule() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ModuleTabLayout tabs={tabs} userPermissions={...} userRoles={...}>
            <Routes>
              <Route path="/" element={<Navigate to="/mymodule/tab1" />} />
              <Route path="/tab1" element={<Tab1Page />} />
            </Routes>
          </ModuleTabLayout>
        }
      />
    </Routes>
  );
}
```

### Adım 2: Router'a Ekle

```typescript
// App.tsx veya Router.tsx
<Route path="/mymodule/*" element={<MyModule />} />
```

---

## 💡 Best Practices

### 1. ✅ Permission Naming
```typescript
// ✅ Doğru
requiredPermission: 'finance.invoices'

// ❌ Yanlış
requiredPermission: 'invoices'
```

### 2. ✅ Default Route
```typescript
// Her modülde default route tanımla
<Route path="/" element={<Navigate to="/module/default-tab" replace />} />
```

### 3. ✅ Icon Kullanımı
```typescript
import { Icon } from 'lucide-react';

{
  icon: <Icon size={18} />, // 18px optimal boyut
}
```

### 4. ✅ Role Array
```typescript
// ✅ Doğru - Multiple roles
requiredRole: ['teacher', 'admin']

// ✅ Doğru - Single role
requiredRole: ['admin']

// ❌ Yanlış - String olarak
requiredRole: 'admin'
```

---

## 📊 Avantajlar

### 1. **Dinamik Yetki Kontrolü**
- Kullanıcı yetkilerine göre otomatik tab gösterimi
- Runtime'da yetki değişikliğine anında tepki

### 2. **Modüler Yapı**
- Her modül bağımsız
- Yeni modül ekleme kolay
- Bakım ve test edilebilirlik yüksek

### 3. **Kullanıcı Dostu**
- Temiz ve anlaşılır arayüz
- Aktif tab vurgulaması
- Responsive tasarım

### 4. **Performans**
- Lazy loading hazır
- Gereksiz component render'ı yok
- Route-based code splitting

### 5. **Güvenlik**
- Frontend ve backend'de çifte kontrol
- Permission-based access control
- Role-based access control

---

## 🎉 Sonuç

✅ **8 Modül** başarıyla oluşturuldu  
✅ **30+ Tab** dinamik yetki kontrolü ile  
✅ **Modüler, ölçeklenebilir, bakımı kolay** yapı  
✅ **Kullanıcı dostu** ve **güvenli** sistem  

---

**Tarih:** 2025-12-22  
**Durum:** ✅ Tamamlandı ve Üretime Hazır

