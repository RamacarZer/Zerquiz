import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { getLicensePackages, getTenantLicense, assignTenantLicense, type LicensePackageDto } from "../../services/api/licenseService";

interface LicenseModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ tenantId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState<LicensePackageDto[]>([]);
  const [currentLicense, setCurrentLicense] = useState<any>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customLimits, setCustomLimits] = useState({
    maxUsers: '',
    maxModules: '',
    maxCases: '',
    maxDocuments: '',
    maxStorageGB: '',
  });

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesData, licenseData] = await Promise.all([
        getLicensePackages(),
        getTenantLicense(tenantId).catch(() => null)
      ]);
      
      setPackages(Array.isArray(packagesData) ? packagesData : (packagesData as any).data || []);
      setCurrentLicense(licenseData);
      
      if (licenseData) {
        setSelectedPackageId(licenseData.licensePackageId);
        setBillingPeriod(licenseData.billingPeriod || 'monthly');
      }
    } catch (error) {
      console.error('Failed to load license data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPackageId) {
      alert('⚠️ Lütfen bir paket seçin!');
      return;
    }

    setSaving(true);
    try {
      const expiryDate = new Date(startDate);
      expiryDate.setMonth(expiryDate.getMonth() + (billingPeriod === 'yearly' ? 12 : 1));

      await assignTenantLicense(tenantId, {
        packageId: selectedPackageId,
        startDate,
        endDate: expiryDate.toISOString().split('T')[0],
        autoRenew: false,
        billingPeriod,
        customLimitsJson: Object.keys(customLimits).some(k => customLimits[k as keyof typeof customLimits])
          ? JSON.stringify(customLimits)
          : undefined,
      });

      alert('✅ Lisans başarıyla atandı!');
      onSuccess();
    } catch (error: any) {
      console.error('Assign error:', error);
      alert('❌ Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const price = selectedPackage 
    ? (billingPeriod === 'yearly' ? selectedPackage.yearlyPrice : selectedPackage.monthlyPrice)
    : 0;

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
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">🎫 Lisans Yönetimi</h2>
            <p className="text-green-100 mt-1">Paket seçimi ve özel limitler</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-4xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current License Info */}
          {currentLicense && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-bold text-blue-800 mb-2">📋 Mevcut Lisans</h3>
              <div className="text-sm text-blue-700 grid grid-cols-3 gap-4">
                <div>
                  <span className="font-semibold">Paket:</span> {currentLicense.packageName}
                </div>
                <div>
                  <span className="font-semibold">Durum:</span> {currentLicense.status}
                </div>
                <div>
                  <span className="font-semibold">Bitiş:</span> {new Date(currentLicense.expiryDate).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          )}

          {/* Package Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">📦 Paket Seçimi</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPackageId === pkg.id
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{pkg.name}</h4>
                    {pkg.isHighlighted && (
                      <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                        {pkg.highlightText || 'Popüler'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{pkg.description}</p>
                  <div className="text-sm space-y-1">
                    <div>👥 {pkg.maxUsers} kullanıcı</div>
                    <div>📚 {pkg.maxModules} modül</div>
                    <div>💾 {pkg.maxStorageGB} GB</div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-2xl font-bold text-green-600">
                      {billingPeriod === 'yearly' ? pkg.yearlyPrice : pkg.monthlyPrice} {pkg.currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      /{billingPeriod === 'yearly' ? 'yıl' : 'ay'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Billing Period */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Faturalama Dönemi</label>
              <select
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık (2 ay bedava!)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Başlangıç Tarihi</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tahmini Ücret</label>
              <div className="px-3 py-2 bg-green-100 border border-green-300 rounded-md">
                <div className="text-2xl font-bold text-green-700">
                  {price} {selectedPackage?.currency || 'TRY'}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Limits (Optional) */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">⚙️ Özel Limitler (Opsiyonel - Override)</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Seçili paketten farklı limitler uygulamak için doldurun. Boş bırakırsanız paket limitleri kullanılır.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Max Kullanıcı"
                  type="number"
                  value={customLimits.maxUsers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setCustomLimits({...customLimits, maxUsers: e.target.value})}
                  placeholder={selectedPackage?.maxUsers?.toString() || ''}
                />
                <Input
                  label="Max Modül"
                  type="number"
                  value={customLimits.maxModules}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setCustomLimits({...customLimits, maxModules: e.target.value})}
                  placeholder={selectedPackage?.maxModules?.toString() || ''}
                />
                <Input
                  label="Max Depolama (GB)"
                  type="number"
                  value={customLimits.maxStorageGB}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setCustomLimits({...customLimits, maxStorageGB: e.target.value})}
                  placeholder={selectedPackage?.maxStorageGB?.toString() || ''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedPackage && (
              <span>
                ✅ <strong>{selectedPackage.name}</strong> paketi seçildi
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              ✗ İptal
            </Button>
            <Button onClick={handleAssign} disabled={saving || !selectedPackageId}>
              {saving ? '⏳ Atanıyor...' : '✓ Lisans Ata'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

