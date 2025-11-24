import React, { useState, useMemo } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Tabs from "../common/Tabs";
import { tenantService, type TenantDto } from "../../services/api/tenantService";

interface TenantEditModalProps {
  tenant: TenantDto;
  onClose: () => void;
  onSuccess: () => void;
}

interface TenantFormData {
  name: string;
  slug: string;
  subdomain: string;
  companyName: string;
  taxNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  representativeFirstName: string;
  representativeLastName: string;
  representativeTitle: string;
  representativeEmail: string;
  representativePhone: string;
  itContactFirstName: string;
  itContactLastName: string;
  itContactTitle: string;
  itContactEmail: string;
  itContactPhone: string;
  isActive: boolean;
}

export const TenantEditModal: React.FC<TenantEditModalProps> = ({ tenant, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<TenantFormData>({
    name: tenant.name,
    slug: tenant.slug,
    subdomain: tenant.subdomain || '',
    companyName: tenant.companyName || '',
    taxNumber: tenant.taxNumber || '',
    email: tenant.email || '',
    phone: tenant.phone || '',
    address: tenant.address || '',
    city: tenant.city || '',
    country: tenant.country || 'Türkiye',
    representativeFirstName: tenant.representativeFirstName || '',
    representativeLastName: tenant.representativeLastName || '',
    representativeTitle: tenant.representativeTitle || '',
    representativeEmail: tenant.representativeEmail || '',
    representativePhone: tenant.representativePhone || '',
    itContactFirstName: tenant.itContactFirstName || '',
    itContactLastName: tenant.itContactLastName || '',
    itContactTitle: tenant.itContactTitle || '',
    itContactEmail: tenant.itContactEmail || '',
    itContactPhone: tenant.itContactPhone || '',
    isActive: tenant.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await tenantService.updateTenant(tenant.id, formData);
      
      alert('✅ Tenant başarıyla güncellendi!');
      onSuccess();
    } catch (error: any) {
      console.error('Update error:', error);
      alert('❌ Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo(() => [
    {
      id: 'basic',
      label: '🏢 Temel Bilgiler',
      content: <BasicInfoTab formData={formData} setFormData={setFormData} />
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
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">✏️ Tenant Düzenle</h2>
            <p className="text-purple-100 mt-1">{tenant.name}</p>
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
                {saving ? '⏳ Kaydediliyor...' : '✓ Güncelle'}
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
}

const BasicInfoTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Not:</strong> Slug ve subdomain değişikliği dikkatli yapılmalıdır
        </p>
      </div>

      <Input
        label="Kurum Adı *"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setFormData({ ...formData, name: e.target.value })}
       
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Slug (URL için) *"
          value={formData.slug}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, slug: e.target.value })}
         
        />
        <Input
          label="Subdomain *"
          value={formData.subdomain}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, subdomain: e.target.value })}
         
        />
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>URL:</strong> https://{formData.subdomain || 'subdomain'}.zerquiz.com
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Şirket Unvanı"
          value={formData.companyName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, companyName: e.target.value })}
        />
        <Input
          label="Vergi Numarası"
          value={formData.taxNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, taxNumber: e.target.value })}
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
         
        />
        <Input
          label="Telefon *"
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, phone: e.target.value })}
         
        />
      </div>

      <Textarea
        label="Adres"
        value={formData.address}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
          setFormData({ ...formData, address: e.target.value })}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Şehir"
          value={formData.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, city: e.target.value })}
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

      {/* Bilgi İşlem */}
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

const SettingsTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-3">⚙️ Durum Ayarları</h3>

      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5"
          />
          <div>
            <div className="font-semibold">Tenant Aktif</div>
            <div className="text-sm text-gray-600">
              {formData.isActive 
                ? '✅ Tenant aktif durumda, kullanıcılar sisteme erişebilir'
                : '⚠️ Tenant pasif, kullanıcılar sisteme erişemez'}
            </div>
          </div>
        </label>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Uyarı:</strong> Branding, lisans ve diğer gelişmiş ayarlar için ilgili modal'ları kullanın.
        </p>
      </div>
    </div>
  );
};

