# 🎨 ZERQUIZ FRONTEND TASARIM STANDARTLARI

## 📐 Tasarım Felsefesi

**Modern, Profesyonel, Kullanıcı Dostu**

Zerquiz platformu için tüm frontend geliştirmelerinde aşağıdaki standartlar uygulanacaktır:

---

## 🎯 Temel Prensipler

### 1. **Modern UI/UX**
- ✅ **Minimal ve Temiz**: Gereksiz öğelerden arındırılmış, odak noktası net
- ✅ **Responsive**: Tüm cihazlarda mükemmel görünüm (mobile-first yaklaşım)
- ✅ **Smooth Animations**: Micro-interactions ile zenginleştirilmiş
- ✅ **Dark Mode Support**: Göz yormayan karanlık tema desteği
- ✅ **Accessibility**: WCAG 2.1 AA standartlarına uygun

### 2. **Design System**
- **UI Framework**: TailwindCSS v3+ (utility-first CSS)
- **Component Library**: Headless UI + Custom Components
- **Icons**: Heroicons + Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts / Chart.js
- **Data Tables**: TanStack Table v8

---

## 🎨 Renk Paleti

### Primary Colors
```css
/* Mavi Tonları - Güven ve Profesyonellik */
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-500: #3B82F6; /* Ana mavi */
--primary-600: #2563EB;
--primary-700: #1D4ED8;
--primary-900: #1E3A8A;
```

### Secondary Colors
```css
/* Mor Tonları - Yaratıcılık ve Zeka */
--secondary-50: #F5F3FF;
--secondary-500: #8B5CF6;
--secondary-600: #7C3AED;
```

### Semantic Colors
```css
/* Başarı */
--success: #10B981; /* Yeşil */
--success-light: #D1FAE5;

/* Hata */
--error: #EF4444; /* Kırmızı */
--error-light: #FEE2E2;

/* Uyarı */
--warning: #F59E0B; /* Turuncu */
--warning-light: #FEF3C7;

/* Bilgi */
--info: #3B82F6; /* Mavi */
--info-light: #DBEAFE;
```

### Neutral Colors
```css
/* Gri Tonları */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-900: #111827;
```

---

## 📝 Typography

### Font Family
```css
/* Ana Font: Inter (Google Fonts) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (Kod Blokları için) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```css
/* Heading */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🧩 Component Standartları

### 1. Buttons
```tsx
// Primary Button
<button className="
  px-4 py-2 
  bg-primary-600 hover:bg-primary-700 
  text-white font-medium 
  rounded-lg shadow-sm 
  transition-all duration-200 
  hover:shadow-md 
  focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Primary Action
</button>

// Secondary Button
<button className="
  px-4 py-2 
  bg-white hover:bg-gray-50 
  text-gray-700 font-medium 
  border border-gray-300 
  rounded-lg shadow-sm 
  transition-all duration-200
">
  Secondary Action
</button>

// Ghost Button
<button className="
  px-4 py-2 
  text-gray-700 hover:text-gray-900 
  hover:bg-gray-100 
  rounded-lg 
  transition-all duration-200
">
  Ghost Action
</button>
```

### 2. Input Fields
```tsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    className="
      w-full px-3 py-2
      border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
      placeholder-gray-400
      transition-all duration-200
      disabled:bg-gray-50 disabled:text-gray-500
    "
    placeholder="ornek@email.com"
  />
  <p className="text-xs text-gray-500">
    Yardımcı metin burada görünür
  </p>
</div>
```

### 3. Cards
```tsx
<div className="
  bg-white rounded-xl 
  shadow-sm hover:shadow-md 
  border border-gray-100
  p-6 
  transition-all duration-200
  hover:border-primary-200
">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-sm text-gray-600">
    Card content goes here
  </p>
</div>
```

### 4. Badges
```tsx
// Success Badge
<span className="
  inline-flex items-center 
  px-2.5 py-0.5 
  rounded-full 
  text-xs font-medium 
  bg-green-100 text-green-800
">
  Aktif
</span>

// Warning Badge
<span className="
  inline-flex items-center 
  px-2.5 py-0.5 
  rounded-full 
  text-xs font-medium 
  bg-yellow-100 text-yellow-800
">
  Beklemede
</span>
```

### 5. Modals
```tsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  {/* Backdrop */}
  <div className="
    fixed inset-0 
    bg-black bg-opacity-50 
    backdrop-blur-sm 
    transition-opacity
  " />
  
  {/* Modal */}
  <div className="
    flex min-h-full items-center justify-center p-4
  ">
    <div className="
      relative 
      bg-white rounded-2xl 
      shadow-2xl 
      max-w-lg w-full 
      p-6
      transform transition-all
    ">
      <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
      <p className="text-gray-600 mb-6">Modal content</p>
      
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          İptal
        </button>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Onayla
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 📱 Layout Yapısı

### Dashboard Layout
```tsx
<div className="min-h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="
    fixed inset-y-0 left-0 
    w-64 
    bg-white border-r border-gray-200
    overflow-y-auto
  ">
    {/* Navigation */}
  </aside>
  
  {/* Main Content */}
  <main className="ml-64 p-8">
    {/* Header */}
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Page Title
      </h1>
      <p className="text-gray-600 mt-1">
        Page description
      </p>
    </header>
    
    {/* Content */}
    <div className="space-y-6">
      {/* Content blocks */}
    </div>
  </main>
</div>
```

---

## 🎬 Animasyonlar

### Framer Motion Variants
```tsx
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Kullanım
<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Transition Classes
```css
/* Smooth Transitions */
.transition-smooth { @apply transition-all duration-200 ease-in-out; }
.transition-fast { @apply transition-all duration-150 ease-out; }
.transition-slow { @apply transition-all duration-300 ease-in-out; }
```

---

## 🔔 Notifications / Toasts

```tsx
// Success Toast
<div className="
  flex items-center gap-3 
  p-4 
  bg-green-50 border-l-4 border-green-500 
  rounded-r-lg 
  shadow-lg
">
  <CheckCircleIcon className="h-5 w-5 text-green-500" />
  <div>
    <p className="font-medium text-green-900">Başarılı!</p>
    <p className="text-sm text-green-700">İşlem tamamlandı.</p>
  </div>
</div>
```

---

## 📊 Data Visualization

### Chart Guidelines
- **Renk Paleti**: Tutarlı renk kullanımı
- **Tooltip**: Detaylı bilgi gösterimi
- **Responsive**: Mobilde de okunabilir
- **Accessibility**: Renk körlüğü desteği

### Chart Colors
```js
const chartColors = [
  '#3B82F6', // Primary Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#06B6D4', // Cyan
];
```

---

## ♿ Accessibility (A11y)

### Checklist
- ✅ Keyboard navigation support (Tab, Enter, Esc)
- ✅ ARIA labels ve roles
- ✅ Focus indicators (ring-2 ring-primary-500)
- ✅ Color contrast ratios (WCAG AA)
- ✅ Screen reader support
- ✅ Alternative text for images
- ✅ Skip to main content link

### Example
```tsx
<button
  aria-label="Kullanıcı menüsünü aç"
  aria-expanded={isOpen}
  aria-haspopup="true"
  className="focus:ring-2 focus:ring-primary-500"
>
  <UserIcon className="h-5 w-5" aria-hidden="true" />
</button>
```

---

## 🌐 Internationalization (i18n)

```tsx
// react-i18next kullanımı
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('dashboard.welcome')}</h1>
  );
}
```

---

## 📱 Responsive Breakpoints

```css
/* TailwindCSS Breakpoints */
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */

/* Kullanım */
<div className="
  w-full 
  sm:w-1/2 
  md:w-1/3 
  lg:w-1/4 
  xl:w-1/5
">
```

---

## 🎯 Loading States

### Skeleton Loaders
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

### Spinners
```tsx
<div className="
  animate-spin 
  rounded-full 
  h-8 w-8 
  border-2 border-primary-600 
  border-t-transparent
"></div>
```

---

## 🚀 Performance

### Optimization Checklist
- ✅ Lazy loading for images (Next.js Image)
- ✅ Code splitting (React.lazy)
- ✅ Memoization (useMemo, useCallback)
- ✅ Virtual scrolling for long lists
- ✅ Debouncing search inputs
- ✅ Optimistic UI updates

---

## 📦 Folder Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/          # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── features/        # Feature-specific components
│       ├── questions/
│       ├── exams/
│       └── dashboard/
├── pages/               # Page components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── styles/              # Global styles
└── types/               # TypeScript types
```

---

## 🎨 TASARIM ÖRNEKLERİ

### 1. Dashboard Card
```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
      Toplam Sorular
    </h3>
    <span className="p-2 bg-primary-100 rounded-lg">
      <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" />
    </span>
  </div>
  <p className="text-3xl font-bold text-gray-900">1,234</p>
  <p className="text-sm text-gray-600 mt-1">
    <span className="text-green-600 font-medium">↑ 12%</span> son aydan
  </p>
</div>
```

### 2. Data Table
```tsx
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold">Sorular</h3>
  </div>
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Başlık
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Durum
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {/* Table rows */}
    </tbody>
  </table>
</div>
```

---

## ✅ SONUÇ

Bu standartlar, Zerquiz platformunun tüm frontend bileşenlerinde tutarlı bir kullanıcı deneyimi sağlamak için uygulanacaktır.

**Anahtar Noktalar:**
- 🎨 Modern ve minimal tasarım
- ♿ Erişilebilirlik öncelikli
- 📱 Responsive ve mobile-first
- ⚡ Performans odaklı
- 🎭 Smooth animasyonlar
- 🌈 Tutarlı renk paleti
- 📐 Sistematik spacing

**Referanslar:**
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Headless UI](https://headlessui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

