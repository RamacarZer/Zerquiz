import React, { useState, useMemo, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Tabs from "../common/Tabs";
import {
  getBrandingSettings,
  updateGeneralSettings,
  updateColorTheme,
  updateEmailBranding,
  updateSocialMedia,
  updateContactInfo,
} from "../../services/api/brandingService";

interface BrandingModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface BrandingFormData {
  // Logo & Images
  logoUrl: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  loginBackgroundUrl: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Email
  emailSenderName: string;
  emailSenderAddress: string;
  emailLogoUrl: string;
  emailFooterText: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Social
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  
  // Contact
  supportEmail: string;
  supportPhone: string;
  address: string;
  
  // Advanced
  googleAnalyticsId: string;
  facebookPixelId: string;
  customCss: string;
  customJs: string;
}

const PRESET_THEMES = [
  { name: 'Mavi', primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981' },
  { name: 'Yeşil', primary: '#10B981', secondary: '#14B8A6', accent: '#F59E0B' },
  { name: 'Kırmızı', primary: '#EF4444', secondary: '#F97316', accent: '#3B82F6' },
  { name: 'Mor', primary: '#8B5CF6', secondary: '#A855F7', accent: '#EC4899' },
  { name: 'Turuncu', primary: '#F97316', secondary: '#FB923C', accent: '#EF4444' },
  { name: 'Pembe', primary: '#EC4899', secondary: '#F472B6', accent: '#A855F7' },
  { name: 'Sarı', primary: '#F59E0B', secondary: '#FBBF24', accent: '#10B981' },
  { name: 'İndigo', primary: '#6366F1', secondary: '#818CF8', accent: '#10B981' },
];

export const BrandingModal: React.FC<BrandingModalProps> = ({ tenantId, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('logo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<BrandingFormData>({
    logoUrl: '',
    logoLightUrl: '',
    logoDarkUrl: '',
    faviconUrl: '',
    loginBackgroundUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    emailSenderName: '',
    emailSenderAddress: '',
    emailLogoUrl: '',
    emailFooterText: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    supportEmail: '',
    supportPhone: '',
    address: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    customCss: '',
    customJs: '',
  });

  useEffect(() => {
    loadBrandingSettings();
  }, [tenantId]);

  const loadBrandingSettings = async () => {
    try {
      setLoading(true);
      const data = await getBrandingSettings(tenantId);
      
      // Parse color theme
      let colors = { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981' };
      if (data.colorThemeJson) {
        try {
          colors = JSON.parse(data.colorThemeJson);
        } catch (e) {
          console.error('Failed to parse color theme');
        }
      }

      setFormData({
        logoUrl: data.logoUrl || '',
        logoLightUrl: data.logoLightUrl || '',
        logoDarkUrl: data.logoDarkUrl || '',
        faviconUrl: data.faviconUrl || '',
        loginBackgroundUrl: data.loginBackgroundUrl || '',
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        emailSenderName: data.emailSenderName || '',
        emailSenderAddress: data.emailSenderAddress || '',
        emailLogoUrl: data.emailLogoUrl || '',
        emailFooterText: data.emailFooterText || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        facebookUrl: data.facebookUrl || '',
        twitterUrl: data.twitterUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        instagramUrl: data.instagramUrl || '',
        supportEmail: data.supportEmail || '',
        supportPhone: data.supportPhone || '',
        address: data.address || '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        customCss: '',
        customJs: '',
      });
    } catch (error) {
      console.error('Failed to load branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save in sections
      await Promise.all([
        updateGeneralSettings(tenantId, {
          displayName: '',
          logoUrl: formData.logoUrl,
          logoLightUrl: formData.logoLightUrl,
          logoDarkUrl: formData.logoDarkUrl,
          faviconUrl: formData.faviconUrl,
          loginBackgroundUrl: formData.loginBackgroundUrl,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords,
        }),
        updateColorTheme(tenantId, {
          colorThemeJson: JSON.stringify({
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
            accent: formData.accentColor,
          }),
        }),
        updateEmailBranding(tenantId, {
          emailSenderName: formData.emailSenderName,
          emailSenderAddress: formData.emailSenderAddress,
          emailLogoUrl: formData.emailLogoUrl,
          emailFooterText: formData.emailFooterText,
        }),
        updateSocialMedia(tenantId, {
          facebookUrl: formData.facebookUrl,
          twitterUrl: formData.twitterUrl,
          linkedinUrl: formData.linkedinUrl,
          instagramUrl: formData.instagramUrl,
        }),
        updateContactInfo(tenantId, {
          supportEmail: formData.supportEmail,
          supportPhone: formData.supportPhone,
          address: formData.address,
        }),
      ]);

      alert('✅ Branding ayarları kaydedildi!');
      onSuccess();
    } catch (error: any) {
      console.error('Save error:', error);
      alert('❌ Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo(() => [
    {
      id: 'logo',
      label: '🎨 Logo & Görseller',
      content: <LogoTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'colors',
      label: '🌈 Renkler',
      content: <ColorsTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'email',
      label: '📧 Email',
      content: <EmailTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'seo',
      label: '🔍 SEO',
      content: <SEOTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'social',
      label: '📱 Sosyal & İletişim',
      content: <SocialTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'advanced',
      label: '⚙️ Gelişmiş',
      content: <AdvancedTab formData={formData} setFormData={setFormData} />
    },
  ], [formData]);

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">🎨 Branding Ayarları</h2>
            <p className="text-purple-100 mt-1">Logo, renkler, SEO ve daha fazlası</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-4xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Tab content is rendered by Tabs component */}
        </div>

        {/* Footer - Navigation */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex gap-2">
            {currentTabIndex > 0 && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
              >
                ← Önceki
              </Button>
            )}
            {currentTabIndex < tabs.length - 1 && (
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
              >
                Sonraki →
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              ✗ İptal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Kaydediliyor...' : '✓ Kaydet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== TAB COMPONENTS ====================

interface TabProps {
  formData: BrandingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BrandingFormData>>;
}

const LogoTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p className="text-sm text-purple-800">
          <strong>💡 İpucu:</strong> URL'leri girin veya dosya yükleme özelliği eklenebilir
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Input
            label="Logo URL (Genel)"
            value={formData.logoUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, logoUrl: e.target.value })}
            placeholder="https://..."
          />
          {formData.logoUrl && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <img src={formData.logoUrl} alt="Logo" className="h-16 object-contain" />
            </div>
          )}
        </div>

        <div>
          <Input
            label="Favicon URL"
            value={formData.faviconUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, faviconUrl: e.target.value })}
            placeholder="https://..."
          />
          {formData.faviconUrl && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <img src={formData.faviconUrl} alt="Favicon" className="h-8 object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Logo (Light Mode)"
          value={formData.logoLightUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, logoLightUrl: e.target.value })}
          placeholder="https://..."
        />
        
        <Input
          label="Logo (Dark Mode)"
          value={formData.logoDarkUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, logoDarkUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <Input
        label="Login Background URL"
        value={formData.loginBackgroundUrl}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, loginBackgroundUrl: e.target.value })}
        placeholder="https://..."
      />
    </div>
  );
};

const ColorsTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    setFormData({
      ...formData,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      accentColor: theme.accent,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3">🎨 Hazır Temalar</h3>
        <div className="grid grid-cols-4 gap-3">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme)}
              className="p-3 border-2 rounded-lg hover:border-purple-500 transition-colors"
            >
              <div className="flex gap-1 mb-2">
                <div className="h-8 flex-1 rounded" style={{ backgroundColor: theme.primary }} />
                <div className="h-8 flex-1 rounded" style={{ backgroundColor: theme.secondary }} />
                <div className="h-8 flex-1 rounded" style={{ backgroundColor: theme.accent }} />
              </div>
              <div className="text-sm font-medium">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">🌈 Özel Renkler</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ana Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, primaryColor: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <Input
                value={formData.primaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, primaryColor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">İkincil Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, secondaryColor: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <Input
                value={formData.secondaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, secondaryColor: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vurgu Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, accentColor: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <Input
                value={formData.accentColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, accentColor: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">👁️ Canlı Önizleme</h3>
        <div className="p-6 border-2 rounded-lg" style={{ backgroundColor: formData.primaryColor }}>
          <div className="bg-white p-4 rounded shadow-lg">
            <h4 className="text-xl font-bold mb-2" style={{ color: formData.primaryColor }}>
              Örnek Başlık
            </h4>
            <p className="text-gray-600 mb-4">Bu bir örnek metin görünümüdür.</p>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Ana Buton
              </button>
              <button 
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                İkincil Buton
              </button>
              <button 
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: formData.accentColor }}
              >
                Vurgu Buton
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-800">
          <strong>📧 Email Branding:</strong> Gönderilen email'lerde kullanılacak bilgiler
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Gönderici Adı"
          value={formData.emailSenderName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, emailSenderName: e.target.value })}
          placeholder="Demo Eğitim Kurumu"
        />
        
        <Input
          label="Gönderici Email"
          type="email"
          value={formData.emailSenderAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, emailSenderAddress: e.target.value })}
          placeholder="noreply@demo.com"
        />
      </div>

      <Input
        label="Email Logo URL"
        value={formData.emailLogoUrl}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, emailLogoUrl: e.target.value })}
        placeholder="https://..."
      />

      <Textarea
        label="Email Footer Metni"
        value={formData.emailFooterText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
          setFormData({ ...formData, emailFooterText: e.target.value })}
        placeholder="© 2025 Demo Eğitim Kurumu. Tüm hakları saklıdır."
        rows={3}
      />
    </div>
  );
};

const SEOTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <p className="text-sm text-green-800">
          <strong>🔍 SEO:</strong> Arama motorları için meta bilgileri
        </p>
      </div>

      <Input
        label="Meta Title"
        value={formData.metaTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, metaTitle: e.target.value })}
        placeholder="Demo Eğitim Kurumu - Online Sınav Sistemi"
      />

      <Textarea
        label="Meta Description"
        value={formData.metaDescription}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
          setFormData({ ...formData, metaDescription: e.target.value })}
        placeholder="Eğitim kurumumuzun online sınav ve değerlendirme platformu..."
        rows={3}
      />

      <Input
        label="Meta Keywords (virgülle ayırın)"
        value={formData.metaKeywords}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, metaKeywords: e.target.value })}
        placeholder="online sınav, eğitim, test, değerlendirme"
      />
    </div>
  );
};

const SocialTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3">📱 Sosyal Medya</h3>
        <div className="space-y-3">
          <Input
            label="Facebook"
            value={formData.facebookUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/..."
          />
          <Input
            label="Twitter / X"
            value={formData.twitterUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, twitterUrl: e.target.value })}
            placeholder="https://twitter.com/..."
          />
          <Input
            label="LinkedIn"
            value={formData.linkedinUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/company/..."
          />
          <Input
            label="Instagram"
            value={formData.instagramUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">📞 Destek İletişim</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Destek Email"
              type="email"
              value={formData.supportEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, supportEmail: e.target.value })}
              placeholder="destek@demo.com"
            />
            <Input
              label="Destek Telefon"
              value={formData.supportPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, supportPhone: e.target.value })}
              placeholder="+90 555 123 4567"
            />
          </div>
          <Textarea
            label="Adres"
            value={formData.address}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              setFormData({ ...formData, address: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

const AdvancedTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-800">
          <strong>⚠️ Dikkat:</strong> Gelişmiş ayarlar - yalnızca bilginiz varsa değiştirin
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Google Analytics ID"
          value={formData.googleAnalyticsId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, googleAnalyticsId: e.target.value })}
          placeholder="G-XXXXXXXXXX"
        />
        <Input
          label="Facebook Pixel ID"
          value={formData.facebookPixelId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, facebookPixelId: e.target.value })}
          placeholder="123456789"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Custom CSS</label>
        <textarea
          value={formData.customCss}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setFormData({ ...formData, customCss: e.target.value })}
          placeholder="/* Özel CSS kodları */"
          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Custom JavaScript</label>
        <textarea
          value={formData.customJs}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setFormData({ ...formData, customJs: e.target.value })}
          placeholder="// Özel JavaScript kodları"
          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows={6}
        />
      </div>
    </div>
  );
};

