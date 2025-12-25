import { useState, useEffect } from 'react';
import { 
  Users, Building2, CreditCard, Settings as SettingsIcon, 
  TrendingUp, AlertCircle, CheckCircle, Clock, Calendar,
  Search, Filter, Download, Plus, Edit, Pause, Play,
  Award, Package, Activity, BarChart3
} from 'lucide-react';

interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  packageName: string;
  status: 'active' | 'suspended' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  userLimit: number;
  currentUsers: number;
  features: string[];
  monthlyRevenue: number;
  contactPerson: string;
  contactEmail: string;
}

interface LicenseStats {
  totalLicenses: number;
  activeLicenses: number;
  totalRevenue: number;
  totalUsers: number;
}

export default function LicenseManagementPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<LicenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'expired' | 'trial'>('all');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

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
        packageName: 'Kurumsal Pro',
        status: 'active',
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        userLimit: 500,
        currentUsers: 420,
        features: ['Sınırsız Kitap', 'AI Asistan', 'API Erişimi', '7/24 Destek'],
        monthlyRevenue: 2999,
        contactPerson: 'Ahmet Yılmaz',
        contactEmail: 'ahmet@ataturklisesi.edu.tr',
      },
      {
        id: '2',
        tenantId: 'tenant_2',
        tenantName: 'ABC Yayınevi',
        packageName: 'Profesyonel',
        status: 'active',
        startDate: '2025-06-01',
        endDate: '2025-12-31',
        userLimit: 100,
        currentUsers: 85,
        features: ['50 Kitap', 'Smartboard', 'Raporlama'],
        monthlyRevenue: 999,
        contactPerson: 'Ayşe Demir',
        contactEmail: 'ayse@abcyayinevi.com',
      },
      {
        id: '3',
        tenantId: 'tenant_3',
        tenantName: 'Özel Bilim Koleji',
        packageName: 'Kurumsal',
        status: 'trial',
        startDate: '2025-12-15',
        endDate: '2026-01-15',
        userLimit: 300,
        currentUsers: 25,
        features: ['100 Kitap', 'Smartboard', 'AI Asistan'],
        monthlyRevenue: 0,
        contactPerson: 'Mehmet Kaya',
        contactEmail: 'mehmet@bilimkoleji.edu.tr',
      },
      {
        id: '4',
        tenantId: 'tenant_4',
        tenantName: 'İstanbul Anadolu Lisesi',
        packageName: 'Temel',
        status: 'expired',
        startDate: '2024-09-01',
        endDate: '2025-12-01',
        userLimit: 50,
        currentUsers: 0,
        features: ['5 Kitap', 'Temel Okuyucu'],
        monthlyRevenue: 0,
        contactPerson: 'Fatma Şahin',
        contactEmail: 'fatma@anadolulisesi.edu.tr',
      },
    ];

    const mockStats: LicenseStats = {
      totalLicenses: mockData.length,
      activeLicenses: mockData.filter(l => l.status === 'active').length,
      totalRevenue: mockData.reduce((sum, l) => sum + l.monthlyRevenue, 0),
      totalUsers: mockData.reduce((sum, l) => sum + l.currentUsers, 0),
    };

    setLicenses(mockData);
    setStats(mockStats);
    setLoading(false);
  };

  const handleExtendLicense = (id: string) => {
    const license = licenses.find(l => l.id === id);
    if (license) {
      const newEndDate = new Date(license.endDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      setLicenses(prev =>
        prev.map(l => l.id === id ? { ...l, endDate: newEndDate.toISOString().split('T')[0] } : l)
      );
      alert(`${license.tenantName} lisansı 1 ay uzatıldı!`);
    }
  };

  const handleSuspendLicense = (id: string) => {
    if (window.confirm('Lisansı askıya almak istediğinize emin misiniz?')) {
      setLicenses(prev =>
        prev.map(lic => (lic.id === id ? { ...lic, status: 'suspended' as const } : lic))
      );
    }
  };

  const handleActivateLicense = (id: string) => {
    setLicenses(prev =>
      prev.map(lic => (lic.id === id ? { ...lic, status: 'active' as const } : lic))
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"><CheckCircle className="w-4 h-4" />Aktif</span>;
      case 'suspended':
        return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"><Pause className="w-4 h-4" />Askıda</span>;
      case 'expired':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"><AlertCircle className="w-4 h-4" />Süresi Doldu</span>;
      case 'trial':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"><Clock className="w-4 h-4" />Deneme</span>;
      default:
        return null;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || license.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Lisanslar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lisans Yönetimi</h1>
          <p className="text-gray-600">Tüm kurumsal lisansları görüntüleyin ve yönetin</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalLicenses}</div>
              <div className="text-sm text-gray-600">Toplam Lisans</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeLicenses}</div>
              <div className="text-sm text-gray-600">Aktif Lisans</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalRevenue.toLocaleString()}₺</div>
              <div className="text-sm text-gray-600">Aylık Gelir</div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Kurum adı veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tümü ({licenses.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setFilterStatus('trial')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === 'trial'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Deneme
              </button>
              <button
                onClick={() => setFilterStatus('expired')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === 'expired'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Süresi Dolmuş
              </button>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Lisans
            </button>
          </div>
        </div>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredLicenses.map((license) => {
            const daysRemaining = getDaysRemaining(license.endDate);
            const usagePercent = Math.round((license.currentUsers / license.userLimit) * 100);

            return (
              <div key={license.id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{license.tenantName}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {license.packageName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {license.currentUsers} / {license.userLimit} kullanıcı
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {license.monthlyRevenue > 0 ? `${license.monthlyRevenue}₺/ay` : 'Ücretsiz'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          İletişim: {license.contactPerson} ({license.contactEmail})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(license.status)}
                      {license.status === 'active' && daysRemaining < 30 && (
                        <div className="mt-2 text-sm text-orange-600 font-semibold">
                          ⚠️ {daysRemaining} gün kaldı
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600 font-medium">Kullanıcı Kullanımı</span>
                      <span className="font-bold text-gray-900">{usagePercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Özellikler:</div>
                    <div className="flex flex-wrap gap-2">
                      {license.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Başlangıç Tarihi</div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(license.startDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Bitiş Tarihi</div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500" />
                        {new Date(license.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {license.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleExtendLicense(license.id)}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Clock className="w-5 h-5" />
                          Süre Uzat
                        </button>
                        <button
                          onClick={() => handleSuspendLicense(license.id)}
                          className="py-3 px-4 bg-orange-100 text-orange-700 rounded-xl font-semibold hover:bg-orange-200 transition-all flex items-center gap-2"
                        >
                          <Pause className="w-5 h-5" />
                          Askıya Al
                        </button>
                      </>
                    )}
                    {license.status === 'suspended' && (
                      <button
                        onClick={() => handleActivateLicense(license.id)}
                        className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Aktif Et
                      </button>
                    )}
                    <button className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Düzenle
                    </button>
                    <button className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Rapor
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLicenses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lisans Bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun lisans bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}
