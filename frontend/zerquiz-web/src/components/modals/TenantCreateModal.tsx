import React, { useState, useMemo } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Tabs from "../common/Tabs";
import { tenantService } from "../../services/api/tenantService";

interface TenantCreateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface TenantFormData {
  // Temel Bilgiler
  name: string;
  slug: string;
  subdomain: string;
  companyName: string;
  taxNumber: string;
  
  // İletişim
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  
  // Şirket Temsilcisi
  representativeFirstName: string;
  representativeLastName: string;
  representativeTitle: string;
  representativeEmail: string;
  representativePhone: string;
  
  // Bilgi İşlem
  itContactFirstName: string;
  itContactLastName: string;
  itContactTitle: string;
  itContactEmail: string;
  itContactPhone: string;
  
  // Branding (İlk kurulum için temel)
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Localization
  defaultLanguage: string;
  defaultTimezone: string;
  defaultCurrency: string;
}

export const TenantCreateModal: React.FC<TenantCreateModalProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<TenantFormData>({
    // Temel
    name: '',
    slug: '',
    subdomain: '',
    companyName: '',
    taxNumber: '',
    
    // İletişim
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Türkiye',
    
    // Temsilci
    representativeFirstName: '',
    representativeLastName: '',
    representativeTitle: '',
    representativeEmail: '',
    representativePhone: '',
    
    // IT
    itContactFirstName: '',
    itContactLastName: '',
    itContactTitle: '',
    itContactEmail: '',
    itContactPhone: '',
    
    // Branding
    brandName: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    
    // Localization
    defaultLanguage: 'tr-TR',
    defaultTimezone: 'Europe/Istanbul',
    defaultCurrency: 'TRY',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.slug || !formData.subdomain || !formData.email || !formData.phone) {
      alert('⚠️ Lütfen tüm zorunlu alanları doldurun!');
      return;
    }
    
    setSaving(true);

    try {
      await tenantService.createTenant({
        ...formData,
        isActive: true,
      });
      
      alert('✅ Tenant başarıyla oluşturuldu!');
      onSuccess();
    } catch (error: any) {
      console.error('Create error:', error);
      alert('❌ Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-'),
      subdomain: value.toLowerCase()
        .replace(/[^a-z0-9]/g, ''),
      brandName: value,
    });
  };

  const tabs = useMemo(() => [
    {
      id: 'basic',
      label: '🏢 Temel Bilgiler',
      content: <BasicInfoTab formData={formData} setFormData={setFormData} onNameChange={handleNameChange} />
    },
    {
      id: 'contact',
      label: '📞 İletişim',
      content: <ContactTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'representatives',
      label: '👥 Yetkililer',
      content: <RepresentativesTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'branding',
      label: '🎨 Branding',
      content: <BrandingTab formData={formData} setFormData={setFormData} />
    },
    {
      id: 'settings',
      label: '⚙️ Ayarlar',
      content: <SettingsTab formData={formData} setFormData={setFormData} />
    },
  ], [formData]);

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">➕ Yeni Tenant Oluştur</h2>
            <p className="text-blue-100 mt-1">Tüm bilgileri dikkatlice doldurun</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-4xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
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
              <Button type="submit" disabled={saving}>
                {saving ? '⏳ Kaydediliyor...' : '✓ Oluştur'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== TAB COMPONENTS ====================

interface TabProps {
  formData: TenantFormData;
  setFormData: React.Dispatch<React.SetStateAction<TenantFormData>>;
  onNameChange?: (value: string) => void;
}

const BasicInfoTab: React.FC<TabProps> = ({ formData, setFormData, onNameChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>💡 İpucu:</strong> Kurum adını girdikten sonra slug ve subdomain otomatik oluşturulacak
        </p>
      </div>

      <Input
        name="name"
        label="Kurum Adı *"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange?.(e.target.value)}
        placeholder="Örn: Demo Eğitim Kurumu"
       
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Slug (URL için) *"
          value={formData.slug}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, slug: e.target.value })}
          placeholder="demo-egitim"
         
        />
        <Input
          label="Subdomain *"
          value={formData.subdomain}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, subdomain: e.target.value })}
          placeholder="demoegitim"
         
        />
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>URL Önizleme:</strong> https://{formData.subdomain || 'subdomain'}.zerquiz.com
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Şirket Unvanı"
          value={formData.companyName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Demo Eğitim Ltd. Şti."
        />
        <Input
          label="Vergi Numarası"
          value={formData.taxNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, taxNumber: e.target.value })}
          placeholder="1234567890"
        />
      </div>
    </div>
  );
};

const ContactTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, email: e.target.value })}
          placeholder="info@demokuru m.com"
         
        />
        <Input
          label="Telefon *"
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, phone: e.target.value })}
          placeholder="+90 555 123 4567"
         
        />
      </div>

      <Textarea
        label="Adres"
        value={formData.address}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
          setFormData({ ...formData, address: e.target.value })}
        placeholder="Tam adres..."
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Şehir"
          value={formData.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, city: e.target.value })}
          placeholder="İstanbul"
        />
        <Input
          label="Ülke"
          value={formData.country}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, country: e.target.value })}
        />
      </div>
    </div>
  );
};

const RepresentativesTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      {/* Şirket Temsilcisi */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          👔 Şirket Temsilcisi
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              value={formData.representativeFirstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, representativeFirstName: e.target.value })}
            />
            <Input
              label="Soyad"
              value={formData.representativeLastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, representativeLastName: e.target.value })}
            />
          </div>
          <Input
            label="Ünvan"
            value={formData.representativeTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, representativeTitle: e.target.value })}
            placeholder="Genel Müdür"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.representativeEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, representativeEmail: e.target.value })}
            />
            <Input
              label="Telefon"
              value={formData.representativePhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, representativePhone: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Bilgi İşlem Sorumlusu */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          💻 Bilgi İşlem Sorumlusu
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              value={formData.itContactFirstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, itContactFirstName: e.target.value })}
            />
            <Input
              label="Soyad"
              value={formData.itContactLastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, itContactLastName: e.target.value })}
            />
          </div>
          <Input
            label="Ünvan"
            value={formData.itContactTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, itContactTitle: e.target.value })}
            placeholder="IT Müdürü"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.itContactEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, itContactEmail: e.target.value })}
            />
            <Input
              label="Telefon"
              value={formData.itContactPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, itContactPhone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandingTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p className="text-sm text-purple-800">
          <strong>🎨 Not:</strong> Detaylı branding ayarları tenant oluştuktan sonra yapılabilir
        </p>
      </div>

      <Input
        label="Marka Adı"
        value={formData.brandName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, brandName: e.target.value })}
        placeholder="Kurum adı ile aynı olabilir"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ana Renk
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, primaryColor: e.target.value })}
              className="h-10 w-20 rounded border"
            />
            <Input
              value={formData.primaryColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, primaryColor: e.target.value })}
              placeholder="#3B82F6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İkincil Renk
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, secondaryColor: e.target.value })}
              className="h-10 w-20 rounded border"
            />
            <Input
              value={formData.secondaryColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, secondaryColor: e.target.value })}
              placeholder="#8B5CF6"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-sm font-medium text-gray-700 mb-2">Renk Önizleme:</div>
        <div className="flex gap-2">
          <div 
            className="h-16 w-24 rounded shadow"
            style={{ backgroundColor: formData.primaryColor }}
          />
          <div 
            className="h-16 w-24 rounded shadow"
            style={{ backgroundColor: formData.secondaryColor }}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-3">🌍 Bölgesel Ayarlar</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Varsayılan Dil
          </label>
          <select
            value={formData.defaultLanguage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ ...formData, defaultLanguage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="tr-TR">Türkçe</option>
            <option value="en-US">English</option>
            <option value="de-DE">Deutsch</option>
            <option value="fr-FR">Français</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saat Dilimi
          </label>
          <select
            value={formData.defaultTimezone}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ ...formData, defaultTimezone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
            <option value="Europe/London">London (UTC+0)</option>
            <option value="America/New_York">New York (UTC-5)</option>
            <option value="Asia/Dubai">Dubai (UTC+4)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para Birimi
          </label>
          <select
            value={formData.defaultCurrency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ ...formData, defaultCurrency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="TRY">TRY (₺)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4">
        <p className="text-sm text-green-800">
          <strong>✓ Hazırsınız!</strong> Tenant oluştuktan sonra lisans atayabilir ve detaylı ayarları yapabilirsiniz.
        </p>
      </div>
    </div>
  );
};

