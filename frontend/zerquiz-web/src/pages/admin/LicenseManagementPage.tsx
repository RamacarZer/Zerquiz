import { useState, useEffect } from 'react';
import { Users, Building2, CreditCard, Settings as SettingsIcon } from 'lucide-react';

interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  packageName: string;
  status: string;
  startDate: string;
  endDate: string;
  userLimit: number;
  currentUsers: number;
}

export default function LicenseManagementPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setLoading(true);
    // Mock data
    const mockData: License[] = [
      {
        id: '1',
        tenantId: 'tenant_1',
        tenantName: 'Atatürk Lisesi',
        packageName: 'Kurumsal',
        status: 'active',
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        userLimit: 500,
        currentUsers: 420,
      },
      {
        id: '2',
        tenantId: 'tenant_2',
        tenantName: 'ABC Yayınevi',
        packageName: 'Profesyonel',
        status: 'active',
        startDate: '2025-06-01',
        endDate: '2025-12-01',
        userLimit: 100,
        currentUsers: 85,
      },
    ];
    setLicenses(mockData);
    setLoading(false);
  };

  const handleExtendLicense = (id: string) => {
    alert(`Lisans ${id} uzatıldı`);
  };

  const handleSuspendLicense = (id: string) => {
    if (window.confirm('Lisansı askıya almak istediğinize emin misiniz?')) {
      setLicenses((prev) =>
        prev.map((lic) => (lic.id === id ? { ...lic, status: 'suspended' } : lic))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Lisans Yönetimi</h1>

      <div className="grid grid-cols-1 gap-6">
        {licenses.map((license) => (
          <div key={license.id} className="card bg-white shadow-xl">
            <div className="card-body">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-white rounded-full w-16">
                      <Building2 size={32} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{license.tenantName}</h2>
                    <p className="text-gray-600">Paket: {license.packageName}</p>
                  </div>
                </div>
                <div
                  className={`badge badge-lg ${
                    license.status === 'active' ? 'badge-success' : 'badge-error'
                  }`}
                >
                  {license.status === 'active' ? 'Aktif' : 'Askıda'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Kullanıcı Limiti</div>
                  <div className="stat-value text-xl">
                    {license.currentUsers} / {license.userLimit}
                  </div>
                  <div className="stat-desc">
                    %{Math.round((license.currentUsers / license.userLimit) * 100)} dolu
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Başlangıç</div>
                  <div className="stat-value text-lg">
                    {new Date(license.startDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Bitiş</div>
                  <div className="stat-value text-lg">
                    {new Date(license.endDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Kalan Süre</div>
                  <div className="stat-value text-lg">
                    {Math.ceil(
                      (new Date(license.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    )}{' '}
                    gün
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleExtendLicense(license.id)}
                  className="btn btn-primary"
                >
                  Süre Uzat
                </button>
                <button className="btn btn-outline">Detayları Düzenle</button>
                {license.status === 'active' && (
                  <button
                    onClick={() => handleSuspendLicense(license.id)}
                    className="btn btn-outline btn-error"
                  >
                    Askıya Al
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

