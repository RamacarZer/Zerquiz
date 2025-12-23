import { Link, Plus, RefreshCw } from 'lucide-react';
import { useIntegrationData } from '../hooks/useIntegrationData';

export default function LTITab() {
  const { ltiConnections } = useIntegrationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">LTI Entegrasyonları</h2>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Bağlantı
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ltiConnections.map((connection) => (
          <div key={connection.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.platform}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                connection.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {connection.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Son Senkronizasyon: <span className="font-semibold">{connection.lastSync}</span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-secondary flex items-center gap-1">
                <RefreshCw className="w-4 h-4" />
                Senkronize Et
              </button>
              <button className="btn btn-sm btn-primary">Ayarlar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

