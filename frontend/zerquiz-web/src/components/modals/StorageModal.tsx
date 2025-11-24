import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

interface StorageModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface StorageProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxSizeGB: number;
  configFields: string[];
}

const STORAGE_PROVIDERS: StorageProvider[] = [
  {
    id: 'local',
    name: 'Yerel Depolama',
    description: 'Sunucu üzerinde dosya depolama',
    icon: '💾',
    maxSizeGB: 100,
    configFields: ['basePath'],
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'AWS S3 bucket ile depolama',
    icon: '☁️',
    maxSizeGB: 5000,
    configFields: ['accessKey', 'secretKey', 'bucket', 'region'],
  },
  {
    id: 'azure',
    name: 'Azure Blob Storage',
    description: 'Microsoft Azure depolama',
    icon: '🔷',
    maxSizeGB: 5000,
    configFields: ['accountName', 'accountKey', 'containerName'],
  },
  {
    id: 'google_cloud',
    name: 'Google Cloud Storage',
    description: 'GCP storage bucket',
    icon: '🌐',
    maxSizeGB: 5000,
    configFields: ['projectId', 'bucket', 'credentialsJson'],
  },
];

export const StorageModal: React.FC<StorageModalProps> = ({ onClose, onSuccess }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('local');
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isDefault, setIsDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usageData] = useState({
    used: 12.5,
    total: 100,
    fileCount: 1247,
  });

  const provider = STORAGE_PROVIDERS.find(p => p.id === selectedProvider);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('✅ Depolama ayarları kaydedildi!');
      onSuccess();
    } catch (error: any) {
      alert('❌ Hata: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const usagePercent = (usageData.used / usageData.total) * 100;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">💾 Depolama Yönetimi</h2>
            <p className="text-blue-100 mt-1">Dosya depolama sağlayıcısı yapılandırması</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-4xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Usage Statistics */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              📊 Kullanım İstatistikleri
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{usageData.used} GB</div>
                <div className="text-xs text-gray-600">Kullanılan</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-gray-600">{usageData.total} GB</div>
                <div className="text-xs text-gray-600">Toplam</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">{usageData.fileCount}</div>
                <div className="text-xs text-gray-600">Dosya Sayısı</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {usagePercent.toFixed(1)}% kullanılıyor
            </div>
          </div>

          {/* Provider Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">☁️ Depolama Sağlayıcısı</h3>
            <div className="grid grid-cols-2 gap-4">
              {STORAGE_PROVIDERS.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvider(prov.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedProvider === prov.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{prov.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold">{prov.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{prov.description}</div>
                      <div className="text-xs text-blue-600">
                        Max: {prov.maxSizeGB} GB
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          {provider && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">⚙️ Yapılandırma - {provider.name}</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {provider.configFields.map((field) => {
                  const isSecret = field.toLowerCase().includes('key') || 
                                   field.toLowerCase().includes('secret');
                  const isJson = field.toLowerCase().includes('json');
                  
                  return (
                    <div key={field}>
                      {isJson ? (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          </label>
                          <textarea
                            value={config[field] || ''}
                            onChange={(e) => setConfig({...config, [field]: e.target.value})}
                            placeholder={`Enter ${field}...`}
                            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                            rows={4}
                          />
                        </div>
                      ) : (
                        <Input
                          label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          type={isSecret ? 'password' : 'text'}
                          value={config[field] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setConfig({...config, [field]: e.target.value})}
                          placeholder={`Enter ${field}...`}
                        />
                      )}
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-semibold">Varsayılan Depolama Olarak Ayarla</div>
                      <div className="text-xs text-gray-600">
                        Tüm yeni dosyalar bu sağlayıcıda saklanacak
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h4 className="font-bold mb-2 text-blue-800">💡 Bilgi</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Değişiklikler kaydetmeden geçerli olmaz</li>
              <li>• Mevcut dosyalar otomatik taşınmaz</li>
              <li>• Birden fazla sağlayıcı aktif olabilir</li>
              <li>• Yalnızca bir tanesi varsayılan olabilir</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {provider && (
              <span>
                ✅ <strong>{provider.name}</strong> seçili
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              ✗ İptal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Kaydediliyor...' : '✓ Kaydet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

