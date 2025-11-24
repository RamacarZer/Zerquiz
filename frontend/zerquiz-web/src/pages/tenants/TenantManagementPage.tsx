import React, { useState, useEffect } from "react";
import { tenantService, TenantDto } from "../../services/api/tenantService";
import { getTenantLicense, type TenantLicenseDto } from "../../services/api/licenseService";
import { getBrandingSettings, type BrandingSettingsDto } from "../../services/api/brandingService";
import Button from "../../components/common/Button";
import { TenantCreateModal } from "../../components/modals/TenantCreateModal";
import { TenantEditModal } from "../../components/modals/TenantEditModal";
import { BrandingModal } from "../../components/modals/BrandingModal";
import { LicenseModal } from "../../components/modals/LicenseModal";
import { IntegrationsModal } from "../../components/modals/IntegrationsModal";
import { StorageModal } from "../../components/modals/StorageModal";

interface TenantWithDetails extends TenantDto {
  license?: TenantLicenseDto | null;
  branding?: BrandingSettingsDto | null;
}

type ModalType = 'create' | 'edit' | 'preview' | 'license' | 'branding' | 'integrations' | 'storage' | null;

const TenantManagementPage: React.FC = () => {
  const [tenants, setTenants] = useState<TenantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantWithDetails | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getTenants();
      
      if (!Array.isArray(data) || data.length === 0) {
        setTenants([]);
        return;
      }
      
      const tenantsWithDetails = await Promise.all(
        data.map(async (tenant) => {
          try {
            const [license, branding] = await Promise.all([
              getTenantLicense(tenant.id).catch(() => null),
              getBrandingSettings(tenant.id).catch(() => null)
            ]);
            return { ...tenant, license, branding };
          } catch {
            return { ...tenant, license: null, branding: null };
          }
        })
      );
      
      setTenants(tenantsWithDetails);
    } catch (err: any) {
      setError(err.message || "Failed to load tenants");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: ModalType, tenant?: TenantWithDetails) => {
    setModalType(type);
    setSelectedTenant(tenant || null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTenant(null);
  };

  const handleSaveSuccess = () => {
    closeModal();
    loadTenants();
  };

  const getLicenseStatusBadge = (license: TenantLicenseDto | null | undefined) => {
    if (!license) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">Lisans Yok</span>;
    }

    const colors: Record<string, string> = {
      trial: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      cancelled: "bg-gray-100 text-gray-600",
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[license.status] || "bg-gray-100 text-gray-800"}`}>
        {license.status === 'trial' ? '🔄 Trial' : 
         license.status === 'active' ? '✓ Aktif' :
         license.status === 'suspended' ? '⏸ Askıda' :
         license.status === 'expired' ? '⏰ Süresi Doldu' : '✗ İptal'}
      </span>
    );
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return <span className="text-red-600 font-semibold">Süresi doldu</span>;
    if (diff === 0) return <span className="text-orange-600 font-semibold">Bugün sona eriyor</span>;
    if (diff <= 7) return <span className="text-orange-600 font-semibold">{diff} gün kaldı</span>;
    if (diff <= 30) return <span className="text-yellow-600">{diff} gün kaldı</span>;
    return <span className="text-gray-600">{diff} gün kaldı</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏢 Tenant Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {tenants?.length || 0} kurum</p>
        </div>
        <Button onClick={() => openModal('create')}>+ Yeni Tenant</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Aktif Lisanslar</div>
          <div className="text-2xl font-bold text-green-600">
            {tenants?.filter(t => t.license?.status === 'active').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Trial</div>
          <div className="text-2xl font-bold text-yellow-600">
            {tenants?.filter(t => t.license?.status === 'trial').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Askıda/Süresi Doldu</div>
          <div className="text-2xl font-bold text-red-600">
            {tenants?.filter(t => t.license?.status === 'suspended' || t.license?.status === 'expired').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="text-sm text-gray-600">Lisans Yok</div>
          <div className="text-2xl font-bold text-gray-600">
            {tenants?.filter(t => !t.license).length || 0}
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {tenant.branding?.logoUrl ? (
                    <img 
                      src={tenant.branding.logoUrl} 
                      alt={tenant.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {tenant.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{tenant.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{tenant.subdomain || tenant.slug}</p>
                  </div>
                </div>
                {tenant.license && (
                  <div className="ml-2">
                    {getLicenseStatusBadge(tenant.license)}
                  </div>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* License Info */}
              {tenant.license ? (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Paket:</span>
                    <span className="text-sm font-bold text-blue-600">
                      {tenant.license.packageCode?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Kalan Süre:</span>
                    {tenant.license.endDate && getRemainingDays(tenant.license.endDate)}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded text-center">
                  <p className="text-xs text-yellow-700">⚠️ Lisans atanmamış</p>
                </div>
              )}

              {/* Branding Info */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Branding:</span>
                {tenant.branding?.customDomain || tenant.branding?.subdomain ? (
                  <span className="text-purple-600 font-semibold">🎨 Özelleştirilmiş</span>
                ) : (
                  <span className="text-gray-400">Varsayılan</span>
                )}
              </div>

              {/* Contact */}
              {tenant.email && (
                <div className="text-xs text-gray-600 truncate">
                  📧 {tenant.email}
                </div>
              )}
            </div>

            {/* Card Footer - Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('preview', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors font-medium"
                >
                  👁️ Önizle
                </button>
                <button
                  onClick={() => openModal('edit', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors font-medium"
                >
                  ✏️ Düzenle
                </button>
                <button
                  onClick={() => openModal('license', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors font-medium"
                >
                  🎫 Lisans
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('branding', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-pink-50 text-pink-700 rounded hover:bg-pink-100 transition-colors font-medium"
                >
                  🎨 Branding
                </button>
                <button
                  onClick={() => openModal('integrations', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors font-medium"
                >
                  🔌 Entegrasyon
                </button>
                <button
                  onClick={() => openModal('storage', tenant)}
                  className="flex-1 px-2 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors font-medium"
                >
                  💾 Depolama
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!tenants || tenants.length === 0) && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-lg text-gray-600 mb-4">Henüz tenant oluşturulmamış</p>
          <Button onClick={() => openModal('create')}>+ İlk Tenant'ı Oluştur</Button>
        </div>
      )}

      {/* MODALS */}
      {modalType === 'preview' && selectedTenant && (
        <TenantPreviewModal tenant={selectedTenant} onClose={closeModal} />
      )}
      
      {modalType === 'create' && (
        <TenantCreateModal onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}
      
      {modalType === 'edit' && selectedTenant && (
        <TenantEditModal tenant={selectedTenant} onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}
      
      {modalType === 'branding' && selectedTenant && (
        <BrandingModal tenantId={selectedTenant.id} onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}
      
      {modalType === 'license' && selectedTenant && (
        <LicenseModal tenantId={selectedTenant.id} onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}

      {modalType === 'integrations' && selectedTenant && (
        <IntegrationsModal tenantId={selectedTenant.id} onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}

      {modalType === 'storage' && selectedTenant && (
        <StorageModal tenantId={selectedTenant.id} onClose={closeModal} onSuccess={handleSaveSuccess} />
      )}
    </div>
  );
};

// ==================== PREVIEW MODAL ====================
interface TenantPreviewModalProps {
  tenant: TenantWithDetails;
  onClose: () => void;
}

const TenantPreviewModal: React.FC<TenantPreviewModalProps> = ({ tenant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold mb-2">👁️ {tenant.name}</h2>
            <p className="text-blue-100">{tenant.subdomain || tenant.slug}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* License Info */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              🎫 Lisans Bilgileri
            </h3>
            {tenant.license ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className="font-semibold">{tenant.license.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-semibold">{tenant.license.packageCode?.toUpperCase() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Başlangıç:</span>
                  <span>{new Date(tenant.license.startDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bitiş:</span>
                  <span>{new Date(tenant.license.endDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tutar:</span>
                  <span className="font-bold text-green-600">
                    {tenant.license.currency} {tenant.license.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">⚠️ Bu tenant için lisans atanmamış</p>
              </div>
            )}
          </div>

          {/* Branding Info */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              🎨 Branding Ayarları
            </h3>
            {tenant.branding ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-4">
                  {tenant.branding.logoUrl && (
                    <img 
                      src={tenant.branding.logoUrl} 
                      alt="Logo"
                      className="h-16 w-16 object-contain bg-white p-2 rounded border"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{tenant.branding.displayName || tenant.name}</div>
                    {tenant.branding.customDomain && (
                      <div className="text-sm text-blue-600">
                        🌐 {tenant.branding.customDomain}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <p className="text-gray-600">Branding ayarları yapılmamış</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              📞 İletişim Bilgileri
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Şirket Temsilcisi:</div>
                {tenant.representativeFirstName ? (
                  <div className="text-sm space-y-1">
                    <div>{tenant.representativeFirstName} {tenant.representativeLastName}</div>
                    <div className="text-gray-600">{tenant.representativeEmail}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Tanımlı değil</div>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Bilgi İşlem:</div>
                {tenant.itContactFirstName ? (
                  <div className="text-sm space-y-1">
                    <div>{tenant.itContactFirstName} {tenant.itContactLastName}</div>
                    <div className="text-gray-600">{tenant.itContactEmail}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Tanımlı değil</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end rounded-b-lg">
          <Button onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};



export default TenantManagementPage;
