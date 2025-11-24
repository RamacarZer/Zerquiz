import React from 'react';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import type { CreateLicensePackageRequest } from '../../services/api/licenseService';

interface FormSectionProps {
  formData: CreateLicensePackageRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateLicensePackageRequest>>;
}

// ==================== BASIC INFO FORM ====================
export const BasicInfoForm: React.FC<FormSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Paket Kodu *"
          value={formData.code}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
          placeholder="free, basic, professional"
          required
        />
        <Input
          label="Paket Adı *"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Profesyonel Paket"
          required
        />
      </div>

      <Textarea
        label="Açıklama"
        value={formData.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Orta ölçekli kurumlar için tam özellikli paket"
        rows={3}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Trial Süresi (Gün)"
          type="number"
          value={formData.trialDays}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
        />
        <Input
          label="Sıra"
          type="number"
          value={formData.displayOrder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
        />
        <Input
          label="Para Birimi"
          value={formData.currency}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, currency: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <span className="text-sm font-medium">Aktif</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isPublic: e.target.checked })}
          />
          <span className="text-sm font-medium">Herkese Açık (Fiyatlandırma sayfasında görünsün)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isHighlighted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isHighlighted: e.target.checked })}
          />
          <span className="text-sm font-medium">Öne Çıkan Paket</span>
        </label>
      </div>

      {formData.isHighlighted && (
        <Input
          label="Öne Çıkan Yazısı"
          value={formData.highlightText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, highlightText: e.target.value })}
          placeholder="En Popüler, Tavsiye Edilen"
        />
      )}
    </div>
  );
};

// ==================== QUOTAS FORM ====================
export const QuotasForm: React.FC<FormSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>💡 İpucu:</strong> 0 değeri = Sınırsız kullanım
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="👥 Maksimum Kullanıcı"
          type="number"
          value={formData.maxUsers}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
        <Input
          label="🎓 Maksimum Öğrenci"
          type="number"
          value={formData.maxStudents}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="❓ Maksimum Soru"
          type="number"
          value={formData.maxQuestions}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxQuestions: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
        <Input
          label="📝 Maksimum Sınav"
          type="number"
          value={formData.maxExams}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxExams: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="💾 Maksimum Depolama (GB)"
          type="number"
          value={formData.maxStorageGB}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxStorageGB: parseInt(e.target.value) || 0 })}
        />
        <Input
          label="🔌 API Çağrısı/Ay"
          type="number"
          value={formData.maxApiCallsPerMonth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxApiCallsPerMonth: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="📦 Maksimum Modül"
          type="number"
          value={formData.maxModules}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxModules: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
        <Input
          label="⚖️ Maksimum Dava"
          type="number"
          value={formData.maxCases}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxCases: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
        <Input
          label="📄 Maksimum Döküman"
          type="number"
          value={formData.maxDocuments}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxDocuments: parseInt(e.target.value) || 0 })}
          placeholder="0 = Sınırsız"
        />
      </div>
    </div>
  );
};

// ==================== FEATURES FORM ====================
export const FeaturesForm: React.FC<FormSectionProps> = ({ formData, setFormData }) => {
  const [newFeature, setNewFeature] = React.useState('');

  const commonFeatures = [
    { id: 'all_question_types', label: '❓ Tüm Soru Tipleri' },
    { id: 'online_exams', label: '💻 Online Sınavlar' },
    { id: 'printed_exams', label: '🖨️ Basılı Sınavlar' },
    { id: 'auto_grading', label: '🤖 Otomatik Değerlendirme' },
    { id: 'manual_grading', label: '✍️ Manuel Değerlendirme' },
    { id: 'basic_analytics', label: '📊 Temel Analitik' },
    { id: 'advanced_analytics', label: '📈 Gelişmiş Analitik' },
    { id: 'export_reports', label: '📤 Rapor Dışa Aktarma' },
    { id: 'certificates', label: '🏆 Sertifikalar' },
    { id: 'custom_domain', label: '🌐 Custom Domain' },
    { id: 'custom_logo', label: '🎨 Logo Özelleştirme' },
    { id: 'custom_colors', label: '🎨 Renk Temaları' },
    { id: 'white_label', label: '⚪ White Label' },
    { id: 'custom_css', label: '💅 Özel CSS' },
    { id: 'custom_js', label: '⚡ Özel JavaScript' },
    { id: 'email_branding', label: '📧 Email Branding' },
    { id: 'subdomain', label: '🔗 Alt Domain' },
    { id: 'api_access', label: '🔌 API Erişimi' },
    { id: 'webhooks', label: '🔔 Webhooks' },
    { id: 'sso', label: '🔐 SSO Entegrasyonu' },
    { id: 'ldap_integration', label: '🏢 LDAP Entegrasyonu' },
    { id: 'priority_support', label: '🚀 Öncelikli Destek' },
    { id: 'dedicated_support', label: '👨‍💼 Özel Destek' },
    { id: 'custom_integrations', label: '🔧 Özel Entegrasyonlar' },
    { id: 'custom_sla', label: '📜 Özel SLA' }
  ];

  const toggleFeature = (featureId: string) => {
    if (formData.features.includes(featureId)) {
      setFormData({
        ...formData,
        features: formData.features.filter(f => f !== featureId)
      });
    } else {
      setFormData({
        ...formData,
        features: [...formData.features, featureId]
      });
    }
  };

  const addCustomFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Yaygın Özellikler</h4>
        <div className="grid grid-cols-2 gap-2">
          {commonFeatures.map((feature) => (
            <label key={feature.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.features.includes(feature.id)}
                onChange={() => toggleFeature(feature.id)}
              />
              <span className="text-sm">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Özel Özellik Ekle</h4>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeature(e.target.value)}
            placeholder="Özellik adı (örn: custom_feature_1)"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
          />
          <button
            type="button"
            onClick={addCustomFeature}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ekle
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Seçili Özellikler ({formData.features.length})</h4>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(feature)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== PRICING FORM ====================
export const PricingForm: React.FC<FormSectionProps> = ({ formData, setFormData }) => {
  const yearlyDiscount = formData.monthlyPrice > 0 && formData.yearlyPrice > 0
    ? Math.round((1 - formData.yearlyPrice / (formData.monthlyPrice * 12)) * 100)
    : 0;

  const suggestedYearly = Math.round(formData.monthlyPrice * 12 * 0.83); // %17 indirim

  return (
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4">
        <h4 className="font-semibold text-green-800 mb-2">💰 Fiyatlandırma Bilgileri</h4>
        <p className="text-sm text-gray-700">
          Yıllık fiyatlandırmada %15-20 indirim uygulamak yaygındır.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="💵 Aylık Fiyat"
            type="number"
            value={formData.monthlyPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
            placeholder="0 = Ücretsiz"
          />
          {formData.monthlyPrice > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <div>Yıllık: ₺{(formData.monthlyPrice * 12).toLocaleString()}</div>
            </div>
          )}
        </div>

        <div>
          <Input
            label="📅 Yıllık Fiyat"
            type="number"
            value={formData.yearlyPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) || 0 })}
            placeholder="0 = Sadece aylık"
          />
          {yearlyDiscount > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-green-600 font-semibold">✓ %{yearlyDiscount} indirim</span>
            </div>
          )}
          {formData.monthlyPrice > 0 && formData.yearlyPrice === 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, yearlyPrice: suggestedYearly })}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Önerilen: ₺{suggestedYearly.toLocaleString()} (%17 indirim)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Fiyat Özeti</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Aylık Fiyat:</span>
            <span className="font-semibold">
              {formData.monthlyPrice === 0 ? 'Ücretsiz' : `₺${formData.monthlyPrice.toLocaleString()}`}
            </span>
          </div>
          {formData.yearlyPrice > 0 && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Yıllık Fiyat:</span>
                <span className="font-semibold">₺{formData.yearlyPrice.toLocaleString()}</span>
              </div>
              {yearlyDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Yıllık İndirim:</span>
                  <span className="font-semibold">%{yearlyDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Yıllık Tasarruf:</span>
                <span className="font-semibold">
                  ₺{((formData.monthlyPrice * 12) - formData.yearlyPrice).toLocaleString()}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600">Para Birimi:</span>
            <span className="font-semibold">{formData.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trial Süresi:</span>
            <span className="font-semibold">{formData.trialDays} gün</span>
          </div>
        </div>
      </div>
    </div>
  );
};

