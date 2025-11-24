import React from "react";
import { Link } from "react-router-dom";

const SimpleDashboard: React.FC = () => {
  const stats = [
    { label: 'Toplam Tenant', value: '24', icon: '🏢', color: 'blue', change: '+12%' },
    { label: 'Aktif Kullanıcı', value: '1,247', icon: '👥', color: 'green', change: '+8%' },
    { label: 'Toplam Soru', value: '8,542', icon: '❓', color: 'purple', change: '+15%' },
    { label: 'Aktif Sınav', value: '36', icon: '📄', color: 'orange', change: '+5%' },
  ];

  const quickLinks = [
    { title: 'Tenant Yönetimi', description: 'Kurumları yönet', icon: '🏢', path: '/tenants', color: 'blue' },
    { title: 'Lisans Paketleri', description: 'Paketleri düzenle', icon: '🎫', path: '/licenses', color: 'green' },
    { title: 'Kullanıcılar', description: 'Kullanıcıları görüntüle', icon: '👥', path: '/users', color: 'purple' },
    { title: 'Müfredat', description: 'Eğitim modellerini yönet', icon: '📚', path: '/curriculum', color: 'pink' },
    { title: 'Soru Bankası', description: 'Soruları incele', icon: '❓', path: '/questions', color: 'indigo' },
    { title: 'Sınavlar', description: 'Sınavları yönet', icon: '📄', path: '/exams', color: 'yellow' },
  ];

  const recentActivity = [
    { action: 'Yeni tenant oluşturuldu', detail: 'Demo Okul', time: '5 dakika önce', icon: '🏢' },
    { action: 'Lisans atandı', detail: 'Professional Paketi', time: '12 dakika önce', icon: '🎫' },
    { action: 'Yeni kullanıcı', detail: 'ahmet@demo.com', time: '1 saat önce', icon: '👤' },
    { action: 'Sınav başlatıldı', detail: 'Matematik Ara Sınavı', time: '2 saat önce', icon: '📄' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">👋 Hoş Geldiniz!</h1>
        <p className="text-blue-100 text-lg">
          Zerquiz SuperAdmin Panel'e hoş geldiniz. Sistemdeki tüm işlemleri buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stat.icon}</span>
              <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>⚡</span> Hızlı Erişim
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                  {link.title}
                </div>
                <div className="text-xs text-gray-500">{link.description}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📊</span> Son Aktiviteler
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.detail}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🔧</span> Sistem Durumu
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-900">API</div>
            <div className="text-xs text-green-600">Çalışıyor</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-900">Database</div>
            <div className="text-xs text-green-600">Çalışıyor</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-900">Redis</div>
            <div className="text-xs text-green-600">Çalışıyor</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-900">Storage</div>
            <div className="text-xs text-green-600">Çalışıyor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;

