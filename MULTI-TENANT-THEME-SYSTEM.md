# 🎨 ZERQUIZ MULTI-TENANT THEME SYSTEM

## 🏢 Tenant-Based Theming

**Her tenant'ın kendi kurumsal kimliği olmalı!**

Zerquiz platformu, her organizasyonun kendi branding'i ile çalışabilmesi için dinamik tema sistemi kullanır.

---

## 📐 Tema Mimarisi

### 1. **Tenant Settings (Database)**

```json
// Tenant.Settings (JSONB)
{
  "branding": {
    "companyName": "Demo Okul",
    "logoUrl": "https://cdn.zerquiz.com/tenants/demo/logo.png",
    "faviconUrl": "https://cdn.zerquiz.com/tenants/demo/favicon.ico",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#8B5CF6",
    "accentColor": "#10B981"
  },
  "theme": {
    "mode": "light", // light | dark | auto
    "borderRadius": "md", // sm | md | lg | xl
    "fontFamily": "Inter",
    "customCSS": ""
  },
  "layout": {
    "sidebarPosition": "left", // left | right
    "sidebarCollapsed": false,
    "compactMode": false
  }
}
```

### 2. **Core Schema - Theme Configuration Table**

```sql
CREATE TABLE core_schema.tenant_themes (
    "Id" uuid PRIMARY KEY,
    "TenantId" uuid NOT NULL REFERENCES core_schema.tenants("Id"),
    "Name" varchar(100) NOT NULL, -- "Default", "Dark", "Custom"
    "IsActive" boolean DEFAULT true,
    
    -- Colors
    "PrimaryColor" varchar(7), -- #3B82F6
    "SecondaryColor" varchar(7),
    "AccentColor" varchar(7),
    "SuccessColor" varchar(7),
    "WarningColor" varchar(7),
    "ErrorColor" varchar(7),
    "BackgroundColor" varchar(7),
    "SurfaceColor" varchar(7),
    "TextPrimaryColor" varchar(7),
    "TextSecondaryColor" varchar(7),
    
    -- Typography
    "FontFamily" varchar(100),
    "FontSizeBase" varchar(10), -- 16px
    "FontWeightNormal" int, -- 400
    "FontWeightBold" int, -- 700
    
    -- Spacing & Border
    "BorderRadius" varchar(10), -- 0.5rem
    "SpacingUnit" varchar(10), -- 0.25rem
    
    -- Branding
    "LogoUrl" text,
    "LogoSmallUrl" text,
    "FaviconUrl" text,
    "LoginBackgroundUrl" text,
    
    -- Custom CSS
    "CustomCSS" text,
    "CustomJS" text,
    
    -- BaseEntity fields...
    "CreatedAt" timestamptz NOT NULL DEFAULT NOW(),
    "UpdatedAt" timestamptz NOT NULL DEFAULT NOW()
);
```

---

## 🎨 Frontend Theme Provider

### 1. **Theme Context**

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { tenantService } from '../services/api/tenantService';

interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  logoUrl: string;
  companyName: string;
  fontFamily: string;
  borderRadius: string;
  customCSS?: string;
}

interface ThemeContextType {
  theme: TenantTheme;
  loading: boolean;
  refreshTheme: () => Promise<void>;
}

const defaultTheme: TenantTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  accentColor: '#10B981',
  successColor: '#10B981',
  warningColor: '#F59E0B',
  errorColor: '#EF4444',
  logoUrl: '/default-logo.png',
  companyName: 'Zerquiz',
  fontFamily: 'Inter',
  borderRadius: '0.5rem'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  loading: true,
  refreshTheme: async () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tenantId } = useAuth();
  const [theme, setTheme] = useState<TenantTheme>(defaultTheme);
  const [loading, setLoading] = useState(true);

  const loadTheme = async () => {
    if (!tenantId) {
      setTheme(defaultTheme);
      setLoading(false);
      return;
    }

    try {
      const tenantTheme = await tenantService.getTheme(tenantId);
      setTheme(tenantTheme);
      applyTheme(tenantTheme);
    } catch (error) {
      console.error('Failed to load theme:', error);
      setTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme: TenantTheme) => {
    const root = document.documentElement;
    
    // Apply CSS Variables
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-error', theme.errorColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--border-radius', theme.borderRadius);
    
    // Apply custom CSS if provided
    if (theme.customCSS) {
      const styleElement = document.createElement('style');
      styleElement.id = 'tenant-custom-css';
      styleElement.textContent = theme.customCSS;
      
      // Remove old custom CSS
      const oldStyle = document.getElementById('tenant-custom-css');
      if (oldStyle) oldStyle.remove();
      
      document.head.appendChild(styleElement);
    }
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon && theme.logoUrl) {
      favicon.href = theme.logoUrl;
    }
    
    // Update page title
    document.title = `${theme.companyName} - Zerquiz`;
  };

  useEffect(() => {
    loadTheme();
  }, [tenantId]);

  const refreshTheme = async () => {
    setLoading(true);
    await loadTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### 2. **TailwindCSS Configuration**

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // CSS variables'dan gelen dinamik renkler
        primary: {
          DEFAULT: 'var(--color-primary, #3B82F6)',
          50: 'color-mix(in srgb, var(--color-primary) 10%, white)',
          100: 'color-mix(in srgb, var(--color-primary) 20%, white)',
          200: 'color-mix(in srgb, var(--color-primary) 30%, white)',
          300: 'color-mix(in srgb, var(--color-primary) 40%, white)',
          400: 'color-mix(in srgb, var(--color-primary) 60%, white)',
          500: 'var(--color-primary)',
          600: 'color-mix(in srgb, var(--color-primary) 80%, black)',
          700: 'color-mix(in srgb, var(--color-primary) 70%, black)',
          800: 'color-mix(in srgb, var(--color-primary) 60%, black)',
          900: 'color-mix(in srgb, var(--color-primary) 50%, black)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #8B5CF6)',
          50: 'color-mix(in srgb, var(--color-secondary) 10%, white)',
          500: 'var(--color-secondary)',
          600: 'color-mix(in srgb, var(--color-secondary) 80%, black)',
        },
        accent: 'var(--color-accent, #10B981)',
        success: 'var(--color-success, #10B981)',
        warning: 'var(--color-warning, #F59E0B)',
        error: 'var(--color-error, #EF4444)',
      },
      fontFamily: {
        sans: ['var(--font-family, Inter)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius, 0.5rem)',
      },
    },
  },
  plugins: [],
};
```

### 3. **Global CSS**

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Default theme values - overridden by ThemeProvider */
  --color-primary: #3B82F6;
  --color-secondary: #8B5CF6;
  --color-accent: #10B981;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --font-family: 'Inter', sans-serif;
  --border-radius: 0.5rem;
}

/* Smooth color transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
```

---

## 🎨 Component Usage Examples

### 1. **Using Theme Colors**

```tsx
import { useTheme } from '../contexts/ThemeContext';

function BrandedButton() {
  const { theme } = useTheme();
  
  return (
    <button 
      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
      // Primary color otomatik olarak tenant'a göre değişir
    >
      Click Me
    </button>
  );
}
```

### 2. **Logo Component**

```tsx
import { useTheme } from '../contexts/ThemeContext';

function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const { theme, loading } = useTheme();
  
  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-10 w-32 rounded" />;
  }
  
  const sizeClasses = {
    small: 'h-8',
    default: 'h-10',
    large: 'h-16'
  };
  
  return (
    <img
      src={theme.logoUrl}
      alt={theme.companyName}
      className={`${sizeClasses[size]} w-auto`}
    />
  );
}
```

### 3. **Branded Card**

```tsx
function BrandedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white rounded-[var(--border-radius)] 
      border-2 border-transparent
      hover:border-primary-200
      shadow-sm hover:shadow-md 
      transition-all duration-200
      p-6
    ">
      {children}
    </div>
  );
}
```

---

## 🔧 Backend API Endpoints

### Tenant Theme Service

```csharp
// GET /api/tenants/{tenantId}/theme
[HttpGet("{tenantId}/theme")]
public async Task<ActionResult<TenantThemeResponse>> GetTheme(Guid tenantId)
{
    var tenant = await _context.Tenants
        .Include(t => t.Theme)
        .FirstOrDefaultAsync(t => t.Id == tenantId);
    
    if (tenant == null) return NotFound();
    
    var theme = tenant.Theme ?? GetDefaultTheme();
    
    return Ok(new TenantThemeResponse
    {
        PrimaryColor = theme.PrimaryColor,
        SecondaryColor = theme.SecondaryColor,
        AccentColor = theme.AccentColor,
        LogoUrl = theme.LogoUrl,
        CompanyName = tenant.Name,
        FontFamily = theme.FontFamily,
        BorderRadius = theme.BorderRadius,
        CustomCSS = theme.CustomCSS
    });
}

// PUT /api/tenants/{tenantId}/theme
[HttpPut("{tenantId}/theme")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> UpdateTheme(
    Guid tenantId, 
    [FromBody] UpdateTenantThemeRequest request)
{
    var tenant = await _context.Tenants
        .Include(t => t.Theme)
        .FirstOrDefaultAsync(t => t.Id == tenantId);
    
    if (tenant == null) return NotFound();
    
    if (tenant.Theme == null)
    {
        tenant.Theme = new TenantTheme { TenantId = tenantId };
        _context.TenantThemes.Add(tenant.Theme);
    }
    
    tenant.Theme.PrimaryColor = request.PrimaryColor;
    tenant.Theme.SecondaryColor = request.SecondaryColor;
    tenant.Theme.AccentColor = request.AccentColor;
    tenant.Theme.LogoUrl = request.LogoUrl;
    tenant.Theme.FontFamily = request.FontFamily;
    tenant.Theme.BorderRadius = request.BorderRadius;
    tenant.Theme.CustomCSS = request.CustomCSS;
    tenant.Theme.UpdatedAt = DateTime.UtcNow;
    
    await _context.SaveChangesAsync();
    
    return Ok();
}
```

---

## 🎨 Theme Presets

### Predefined Theme Templates

```typescript
// src/constants/themePresets.ts
export const themePresets = {
  default: {
    name: 'Default Blue',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    preview: '/themes/default.png'
  },
  green: {
    name: 'Nature Green',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    accentColor: '#34D399',
    preview: '/themes/green.png'
  },
  purple: {
    name: 'Royal Purple',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    preview: '/themes/purple.png'
  },
  orange: {
    name: 'Warm Orange',
    primaryColor: '#F97316',
    secondaryColor: '#EA580C',
    accentColor: '#FB923C',
    preview: '/themes/orange.png'
  },
  red: {
    name: 'Bold Red',
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    accentColor: '#F87171',
    preview: '/themes/red.png'
  }
};
```

---

## 🎯 Theme Customization Admin Panel

```tsx
// src/pages/admin/ThemeSettings.tsx
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { tenantService } from '../../services/api/tenantService';
import { themePresets } from '../../constants/themePresets';

function ThemeSettings() {
  const { theme, refreshTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [logoUrl, setLogoUrl] = useState(theme.logoUrl);
  
  const handleSave = async () => {
    await tenantService.updateTheme({
      primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      logoUrl,
      fontFamily: theme.fontFamily,
      borderRadius: theme.borderRadius
    });
    
    await refreshTheme();
    alert('Tema başarıyla güncellendi!');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tema Ayarları</h1>
      
      {/* Theme Presets */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Hazır Temalar</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(themePresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setPrimaryColor(preset.primaryColor)}
              className="p-4 border rounded-lg hover:border-primary-500 transition"
            >
              <div 
                className="h-20 rounded mb-2" 
                style={{ backgroundColor: preset.primaryColor }}
              />
              <p className="font-medium">{preset.name}</p>
            </button>
          ))}
        </div>
      </section>
      
      {/* Color Customization */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Renk Özelleştirme</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ana Renk
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-24 rounded cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Logo Upload */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Logo</h2>
        <div>
          <img src={logoUrl} alt="Logo" className="h-16 mb-4" />
          <input
            type="file"
            accept="image/*"
            className="block"
          />
        </div>
      </section>
      
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Değişiklikleri Kaydet
      </button>
    </div>
  );
}
```

---

## 📱 White Label Support

### Subdomain-based Tenant Detection

```tsx
// src/utils/tenantDetection.ts
export const detectTenantFromSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // demo.zerquiz.com -> "demo"
  // okul1.zerquiz.com -> "okul1"
  // zerquiz.com -> null (main site)
  
  const parts = hostname.split('.');
  
  if (parts.length >= 3) {
    return parts[0]; // subdomain
  }
  
  return null;
};

// Custom domain support
export const detectTenantFromCustomDomain = async (): Promise<string | null> => {
  const hostname = window.location.hostname;
  
  // okulumuz.com -> tenant by custom domain lookup
  try {
    const response = await fetch(`/api/tenants/by-domain/${hostname}`);
    const data = await response.json();
    return data.tenantId;
  } catch {
    return null;
  }
};
```

---

## ✅ CHECKLIST: Multi-Tenant Theming

### Backend
- [ ] `TenantTheme` entity oluştur
- [ ] Tenant Settings JSONB'ye branding ekle
- [ ] Theme GET/PUT API endpoints
- [ ] File upload endpoint (logo/favicon)
- [ ] Subdomain/custom domain routing

### Frontend
- [ ] ThemeContext ve ThemeProvider
- [ ] CSS variables system
- [ ] Dynamic TailwindCSS colors
- [ ] Logo component
- [ ] Theme customization admin panel
- [ ] Theme presets library
- [ ] Subdomain detection
- [ ] Custom domain support

### Features
- [ ] Live theme preview
- [ ] Color picker
- [ ] Logo/favicon upload
- [ ] Custom CSS injection
- [ ] Font selection
- [ ] Border radius options
- [ ] Dark mode toggle
- [ ] Export/Import theme

---

## 🚀 SONUÇ

**Multi-Tenant Theme System Özellikleri:**

✅ Her tenant kendi branding'ine sahip  
✅ Dinamik renk sistemi (CSS variables)  
✅ Logo ve favicon özelleştirme  
✅ Hazır tema şablonları  
✅ Custom CSS injection  
✅ Subdomain ve custom domain desteği  
✅ White-label ready  
✅ Real-time theme switching  
✅ Admin panel ile kolay yönetim  

**Tenant'lar artık:**
- Kendi logolarını yükleyebilir
- Kurumsal renklerini uygulayabilir
- Kendi domain'lerini kullanabilir
- Öğrencilerine branded deneyim sunabilir

🎨 **Her tenant, Zerquiz'i sanki kendi platformuymuş gibi kullanabilir!**

