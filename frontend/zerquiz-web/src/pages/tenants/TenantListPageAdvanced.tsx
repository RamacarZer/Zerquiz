import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tenantService, TenantDto } from "../../services/api/tenantService";
import { getTenantLicense, type TenantLicenseDto } from "../../services/api/licenseService";
import { getBrandingSettings, type BrandingSettingsDto } from "../../services/api/brandingService";
import Button from "../../components/common/Button";

interface TenantWithLicense extends TenantDto {
  license?: TenantLicenseDto | null;
  branding?: BrandingSettingsDto | null;
}

const TenantListPageAdvanced: React.FC = () => {
  const [tenants, setTenants] = useState<TenantWithLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTenant, setPreviewTenant] = useState<TenantWithLicense | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getTenants();
      
      // Load license info for each tenant
      const tenantsWithLicense = await Promise.all(
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
      
      setTenants(tenantsWithLicense);
    } catch (err: any) {
      setError(err.message || "Failed to load tenants");
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏢 Tenant Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {tenants.length} kurum</p>
        </div>
        <Link to="/tenants/create">
          <Button>+ Yeni Tenant</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Aktif Lisanslar</div>
          <div className="text-2xl font-bold text-green-600">
            {tenants.filter(t => t.license?.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Trial</div>
          <div className="text-2xl font-bold text-yellow-600">
            {tenants.filter(t => t.license?.status === 'trial').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Askıda/Süresi Doldu</div>
          <div className="text-2xl font-bold text-red-600">
            {tenants.filter(t => t.license?.status === 'suspended' || t.license?.status === 'expired').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="text-sm text-gray-600">Lisans Yok</div>
          <div className="text-2xl font-bold text-gray-600">
            {tenants.filter(t => !t.license).length}
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kurum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lisans
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kalan Süre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branding
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {tenant.branding?.logoUrl ? (
                      <img 
                        src={tenant.branding.logoUrl} 
                        alt={tenant.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.subdomain || 'Subdomain yok'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getLicenseStatusBadge(tenant.license)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tenant.license ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.license.packageCode?.toUpperCase() || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tenant.license.billingPeriod === 'monthly' ? 'Aylık' : 'Yıllık'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {tenant.license?.endDate ? (
                    <div>
                      {getRemainingDays(tenant.license.endDate)}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(tenant.license.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {tenant.branding?.customDomain || tenant.branding?.subdomain ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        🎨 Özel
                      </span>
                      {tenant.branding.customDomain && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          🌐 Domain
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Varsayılan</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setPreviewTenant(tenant)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Önizleme"
                    >
                      👁️
                    </button>
                    <Link
                      to={`/tenants/${tenant.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Detay"
                    >
                      📋
                    </Link>
                    <Link
                      to={`/tenants/${tenant.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Düzenle"
                    >
                      ✏️
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tenants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Henüz tenant oluşturulmamış</p>
            <p className="text-sm">Yeni tenant eklemek için yukarıdaki butona tıklayın</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTenant && (
        <TenantPreviewModal 
          tenant={previewTenant} 
          onClose={() => setPreviewTenant(null)} 
        />
      )}
    </div>
  );
};

// ==================== PREVIEW MODAL ====================
interface TenantPreviewModalProps {
  tenant: TenantWithLicense;
  onClose: () => void;
}

const TenantPreviewModal: React.FC<TenantPreviewModalProps> = ({ tenant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">👁️ {tenant.name}</h2>
            <p className="text-blue-100">{tenant.subdomain || 'Subdomain tanımlı değil'}</p>
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
                  <span className="text-gray-600">Ödeme Periyodu:</span>
                  <span>{tenant.license.billingPeriod === 'monthly' ? 'Aylık' : 'Yıllık'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tutar:</span>
                  <span className="font-bold text-green-600">
                    {tenant.license.currency} {tenant.license.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Otomatik Yenileme:</span>
                  <span>{tenant.license.autoRenew ? '✓ Açık' : '✗ Kapalı'}</span>
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
                        {tenant.branding.domainVerified && <span className="text-green-600 ml-2">✓ Doğrulandı</span>}
                      </div>
                    )}
                    {tenant.branding.subdomain && (
                      <div className="text-sm text-gray-600">
                        {tenant.branding.subdomain}.zerquiz.com
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO */}
                {tenant.branding.metaTitle && (
                  <div className="pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-1">SEO:</div>
                    <div className="text-sm font-medium">{tenant.branding.metaTitle}</div>
                    {tenant.branding.metaDescription && (
                      <div className="text-xs text-gray-500 mt-1">{tenant.branding.metaDescription}</div>
                    )}
                  </div>
                )}

                {/* Email */}
                {tenant.branding.emailSenderName && (
                  <div className="pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-1">Email Gönderici:</div>
                    <div className="text-sm">
                      {tenant.branding.emailSenderName} &lt;{tenant.branding.emailSenderAddress}&gt;
                    </div>
                  </div>
                )}

                {/* Social */}
                {(tenant.branding.facebookUrl || tenant.branding.twitterUrl || tenant.branding.linkedinUrl) && (
                  <div className="pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-2">Sosyal Medya:</div>
                    <div className="flex gap-2">
                      {tenant.branding.facebookUrl && <a href={tenant.branding.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">Facebook</a>}
                      {tenant.branding.twitterUrl && <a href={tenant.branding.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sky-500">Twitter</a>}
                      {tenant.branding.linkedinUrl && <a href={tenant.branding.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700">LinkedIn</a>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <p className="text-gray-600">Branding ayarları yapılmamış (Varsayılan tema kullanılıyor)</p>
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
                    <div className="text-gray-600">{tenant.representativeTitle}</div>
                    <div className="text-gray-600">{tenant.representativeEmail}</div>
                    <div className="text-gray-600">{tenant.representativePhone}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Tanımlı değil</div>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Bilgi İşlem Sorumlusu:</div>
                {tenant.itContactFirstName ? (
                  <div className="text-sm space-y-1">
                    <div>{tenant.itContactFirstName} {tenant.itContactLastName}</div>
                    <div className="text-gray-600">{tenant.itContactTitle}</div>
                    <div className="text-gray-600">{tenant.itContactEmail}</div>
                    <div className="text-gray-600">{tenant.itContactPhone}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Tanımlı değil</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-between">
          <Link to={`/tenants/${tenant.id}/edit`}>
            <Button variant="secondary">✏️ Düzenle</Button>
          </Link>
          <Button onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};

export default TenantListPageAdvanced;

