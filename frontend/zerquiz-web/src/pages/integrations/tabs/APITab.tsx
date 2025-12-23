import { Key, Plus, Copy, Trash2 } from 'lucide-react';
import { useIntegrationData } from '../hooks/useIntegrationData';

export default function APITab() {
  const { apiKeys } = useIntegrationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold">API Yönetimi</h2>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni API Key
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{apiKey.name}</h3>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                  <code className="text-sm font-mono flex-1">{apiKey.key}</code>
                  <button className="btn btn-sm btn-secondary">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${
                apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {apiKey.status === 'active' ? 'Aktif' : 'İptal Edildi'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="space-y-1">
                <p>Oluşturulma: <span className="font-semibold">{apiKey.createdAt}</span></p>
                <p>Son Kullanım: <span className="font-semibold">{apiKey.lastUsed}</span></p>
              </div>
              {apiKey.status === 'active' && (
                <button className="btn btn-sm btn-danger flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  İptal Et
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

