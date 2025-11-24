import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import {
  getLicensePackages,
  createLicensePackage,
  updateLicensePackage,
  deleteLicensePackage,
  type LicensePackageDto,
  type CreateLicensePackageRequest
} from '../../services/api/licenseService';
import { BasicInfoForm, QuotasForm, FeaturesForm, PricingForm } from './PackageFormSections';

export const LicensePackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<LicensePackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [isCreating, setIsCreating] = useState(false);
  const [editingPackage, setEditingPackage] = useState<LicensePackageDto | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await getLicensePackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Paketler yüklenemedi:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPackage(null);
    setIsCreating(true);
    setActiveTab('form');
  };

  const handleEdit = (pkg: LicensePackageDto) => {
    setEditingPackage(pkg);
    setIsCreating(false);
    setActiveTab('form');
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingPackage(null);
    setActiveTab('list');
  };

  const handleSaveSuccess = () => {
    setIsCreating(false);
    setEditingPackage(null);
    setActiveTab('list');
    loadPackages();
  };

  const tabs = useMemo(() => [
    {
      id: 'list',
      label: '📋 Paket Listesi',
      content: <PackageListTab packages={packages} loading={loading} onEdit={handleEdit} onDelete={async (id) => {
        if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
          await deleteLicensePackage(id);
          loadPackages();
        }
      }} />
    },
    {
      id: 'form',
      label: isCreating ? '➕ Yeni Paket' : '✏️ Paket Düzenle',
      content: <PackageFormTab 
        package={editingPackage} 
        onCancel={handleCancelForm}
        onSuccess={handleSaveSuccess}
      />
    }
  ], [packages, loading, isCreating, editingPackage]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Lisans Paketleri Yönetimi</h1>
        {activeTab === 'list' && (
          <Button onClick={handleCreateNew}>➕ Yeni Paket Oluştur</Button>
        )}
      </div>

      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

// ===================== PACKAGE LIST TAB =====================
interface PackageListTabProps {
  packages: LicensePackageDto[];
  loading: boolean;
  onEdit: (pkg: LicensePackageDto) => void;
  onDelete: (id: string) => void;
}

const PackageListTab: React.FC<PackageListTabProps> = ({ packages, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">Henüz lisans paketi oluşturulmamış</p>
        <p className="text-sm text-gray-400">Yeni paket eklemek için yukarıdaki butona tıklayın</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
      {packages.map((pkg) => (
        <div key={pkg.id} className="bg-white rounded-lg shadow-md border-2 hover:border-blue-400 transition-all relative">
          {pkg.isHighlighted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              {pkg.highlightText || '⭐ Öne Çıkan'}
            </div>
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <span className="text-xs text-gray-500 font-mono">{pkg.code}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {pkg.isActive ? '✓ Aktif' : '✗ Pasif'}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  {pkg.monthlyPrice === 0 ? 'Ücretsiz' : `₺${pkg.monthlyPrice.toLocaleString()}`}
                </span>
                {pkg.monthlyPrice > 0 && <span className="text-gray-500 text-sm">/ay</span>}
              </div>
              {pkg.yearlyPrice > 0 && (
                <div className="text-sm text-gray-600">
                  Yıllık: ₺{pkg.yearlyPrice.toLocaleString()} 
                  {pkg.monthlyPrice > 0 && pkg.yearlyPrice < pkg.monthlyPrice * 12 && (
                    <span className="ml-2 text-green-600 font-semibold">
                      %{Math.round((1 - pkg.yearlyPrice / (pkg.monthlyPrice * 12)) * 100)} tasarruf
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">👥 Kullanıcı:</span>
                <span className="font-semibold">{pkg.maxUsers === 0 ? '∞ Sınırsız' : pkg.maxUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">❓ Soru:</span>
                <span className="font-semibold">{pkg.maxQuestions === 0 ? '∞ Sınırsız' : pkg.maxQuestions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">📝 Sınav:</span>
                <span className="font-semibold">{pkg.maxExams === 0 ? '∞ Sınırsız' : pkg.maxExams}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">💾 Depolama:</span>
                <span className="font-semibold">{pkg.maxStorageGB} GB</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-xs text-gray-500 mb-2">Özellikler:</div>
              <div className="flex flex-wrap gap-1 mb-4">
                {pkg.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {pkg.features.length > 3 && (
                  <span className="text-xs text-gray-500">+{pkg.features.length - 3}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={() => onEdit(pkg)} className="flex-1">
                  ✏️ Düzenle
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(pkg.id)} className="flex-1">
                  🗑️ Sil
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===================== PACKAGE FORM TAB =====================
interface PackageFormTabProps {
  package: LicensePackageDto | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const PackageFormTab: React.FC<PackageFormTabProps> = ({ package: pkg, onCancel, onSuccess }) => {
  const [formTab, setFormTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateLicensePackageRequest>({
    code: '',
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'TRY',
    trialDays: 14,
    maxUsers: 0,
    maxStudents: 0,
    maxQuestions: 0,
    maxExams: 0,
    maxStorageGB: 0,
    maxApiCallsPerMonth: 0,
    maxModules: 0,
    maxCases: 0,
    maxDocuments: 0,
    features: [],
    isActive: true,
    isPublic: true,
    isHighlighted: false,
    highlightText: '',
    displayOrder: 1
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        code: pkg.code,
        name: pkg.name,
        description: pkg.description || '',
        monthlyPrice: pkg.monthlyPrice,
        yearlyPrice: pkg.yearlyPrice,
        currency: pkg.currency,
        trialDays: pkg.trialDays,
        maxUsers: pkg.maxUsers,
        maxStudents: pkg.maxStudents,
        maxQuestions: pkg.maxQuestions,
        maxExams: pkg.maxExams,
        maxStorageGB: pkg.maxStorageGB,
        maxApiCallsPerMonth: pkg.maxApiCallsPerMonth,
        maxModules: pkg.maxModules,
        maxCases: pkg.maxCases,
        maxDocuments: pkg.maxDocuments,
        features: pkg.features,
        isActive: pkg.isActive,
        isPublic: pkg.isPublic,
        isHighlighted: pkg.isHighlighted,
        highlightText: pkg.highlightText || '',
        displayOrder: pkg.displayOrder
      });
    }
  }, [pkg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (pkg) {
        await updateLicensePackage(pkg.id, { ...formData, id: pkg.id });
      } else {
        await createLicensePackage(formData);
      }
      alert('Paket başarıyla kaydedildi!');
      onSuccess();
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Paket kaydedilemedi!');
    } finally {
      setSaving(false);
    }
  };

  const formTabs = useMemo(() => [
    {
      id: 'basic',
      label: 'Temel Bilgiler',
      content: <BasicInfoForm formData={formData} setFormData={setFormData} />
    },
    {
      id: 'quotas',
      label: 'Kotalar',
      content: <QuotasForm formData={formData} setFormData={setFormData} />
    },
    {
      id: 'features',
      label: 'Özellikler',
      content: <FeaturesForm formData={formData} setFormData={setFormData} />
    },
    {
      id: 'pricing',
      label: 'Fiyatlandırma',
      content: <PricingForm formData={formData} setFormData={setFormData} />
    }
  ], [formData]);

  const currentTabIndex = formTabs.findIndex(t => t.id === formTab);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <Tabs tabs={formTabs} activeTab={formTab} onTabChange={setFormTab} />

      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <div className="flex gap-2">
          {currentTabIndex > 0 && (
            <Button type="button" variant="secondary" onClick={() => setFormTab(formTabs[currentTabIndex - 1].id)}>
              ← Önceki
            </Button>
          )}
          {currentTabIndex < formTabs.length - 1 && (
            <Button type="button" variant="secondary" onClick={() => setFormTab(formTabs[currentTabIndex + 1].id)}>
              Sonraki →
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            ✗ İptal
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : '✓ Kaydet'}
          </Button>
        </div>
      </div>
    </form>
  );
};


