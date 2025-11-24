import { Link } from 'react-router-dom'

export default function SuperAdminDashboard() {
  const modules = [
    {
      title: '🏢 Tenant Yönetimi',
      description: 'Organizasyonları yönetin',
      link: '/tenants',
      icon: '🏢',
      color: 'bg-blue-500'
    },
    {
      title: '👥 Kullanıcı Yönetimi',
      description: 'Kullanıcıları ve rolleri yönetin',
      link: '/users',
      icon: '👥',
      color: 'bg-green-500'
    },
    {
      title: '📚 Müfredat Yönetimi',
      description: 'Eğitim modelleri, branşlar, konular',
      link: '/curriculum',
      icon: '📚',
      color: 'bg-purple-500'
    },
    {
      title: '❓ Soru Bankası',
      description: 'Soruları oluşturun ve yönetin',
      link: '/questions',
      icon: '❓',
      color: 'bg-yellow-500'
    },
    {
      title: '📝 Sınav Yönetimi',
      description: 'Sınavları oluşturun ve yönetin',
      link: '/exams',
      icon: '📝',
      color: 'bg-red-500'
    },
    {
      title: '📊 Değerlendirme',
      description: 'Sonuçları görüntüleyin ve analiz edin',
      link: '/grading',
      icon: '📊',
      color: 'bg-indigo-500'
    },
    {
      title: '💰 Telif Yönetimi',
      description: 'Yazar telif haklarını yönetin',
      link: '/royalty',
      icon: '💰',
      color: 'bg-pink-500'
    },
    {
      title: '📈 Raporlar',
      description: 'İstatistikler ve analizler',
      link: '/reports',
      icon: '📈',
      color: 'bg-teal-500'
    },
    {
      title: '🎓 Sertifikalar',
      description: 'Sertifika oluştur ve yönet',
      link: '/certificates',
      icon: '🎓',
      color: 'bg-orange-500'
    },
    {
      title: '⚙️ Sistem Ayarları',
      description: 'Platform ayarlarını yapılandırın',
      link: '/settings',
      icon: '⚙️',
      color: 'bg-gray-500'
    },
    {
      title: '📋 Audit Logları',
      description: 'Sistem aktivitelerini izleyin',
      link: '/audit-logs',
      icon: '📋',
      color: 'bg-cyan-500'
    },
    {
      title: '🔔 Bildirimler',
      description: 'Bildirimleri yönetin',
      link: '/notifications',
      icon: '🔔',
      color: 'bg-lime-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Zerquiz Platform</h1>
              <p className="text-sm text-gray-600 mt-1">Süper Admin Kontrol Paneli</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@demo.com</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Soru</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                ❓
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Sınav</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                📝
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Tenant</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                🏢
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tüm Modüller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link
                key={index}
                to={module.link}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className={`${module.color} h-2`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {module.description}
                      </p>
                    </div>
                    <div className="text-3xl ml-4">
                      {module.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>Modülü Aç</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <span className="mr-2">➕</span>
              Yeni Soru Ekle
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              <span className="mr-2">📝</span>
              Sınav Oluştur
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
              <span className="mr-2">👤</span>
              Kullanıcı Ekle
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              <span className="mr-2">📊</span>
              Rapor Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

