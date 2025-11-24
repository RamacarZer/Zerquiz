import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

interface IntegrationsModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  config: Record<string, string>;
}

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Bildirimler ve mesajlar için Slack entegrasyonu',
    icon: '💬',
    configFields: ['webhookUrl', 'channel'],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Teams kanallarına bildirim gönderme',
    icon: '👥',
    configFields: ['webhookUrl'],
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Online sınav için Zoom entegrasyonu',
    icon: '🎥',
    configFields: ['apiKey', 'apiSecret'],
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Dosya saklama için Google Drive',
    icon: '📁',
    configFields: ['clientId', 'clientSecret', 'folderId'],
  },
  {
    id: 'smtp',
    name: 'SMTP Email',
    description: 'Özel email sunucusu ayarları',
    icon: '📧',
    configFields: ['host', 'port', 'username', 'password'],
  },
  {
    id: 'sms',
    name: 'SMS Gateway',
    description: 'SMS bildirimleri için gateway',
    icon: '📱',
    configFields: ['apiKey', 'senderId'],
  },
];

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ onClose, onSuccess }) => {
  const [integrations, setIntegrations] = useState<Integration[]>(
    AVAILABLE_INTEGRATIONS.map(i => ({
      ...i,
      enabled: false,
      config: {},
    }))
  );
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const selected = integrations.find(i => i.id === selectedIntegration);

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ));
  };

  const handleConfigChange = (field: string, value: string) => {
    setIntegrations(integrations.map(i => 
      i.id === selectedIntegration 
        ? { ...i, config: { ...i.config, [field]: value } }
        : i
    ));
  };

  const handleTest = async () => {
    if (!selected) return;
    
    setTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('✅ Bağlantı başarılı!');
    } catch (error) {
      alert('❌ Bağlantı hatası!');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('✅ Entegrasyonlar kaydedildi!');
      onSuccess();
    } catch (error: any) {
      alert('❌ Hata: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">🔌 Entegrasyonlar</h2>
            <p className="text-orange-100 mt-1">Harici servislerle bağlantı kurun</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-4xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Integration List */}
          <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-50">
            <h3 className="font-bold mb-4">Mevcut Entegrasyonlar</h3>
            <div className="space-y-2">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => setSelectedIntegration(integration.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedIntegration === integration.id
                      ? 'border-orange-500 bg-white shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <div className="font-bold">{integration.name}</div>
                        <div className="text-xs text-gray-500">{integration.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className={`text-xs px-2 py-1 rounded ${
                      integration.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {integration.enabled ? '✓ Aktif' : '○ Pasif'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(integration.id);
                      }}
                      className={`text-xs px-3 py-1 rounded ${
                        integration.enabled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {integration.enabled ? 'Devre Dışı' : 'Etkinleştir'}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Config Panel */}
          <div className="flex-1 overflow-y-auto p-6">
            {selected ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{selected.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{selected.name}</h3>
                    <p className="text-gray-600">{selected.description}</p>
                  </div>
                </div>

                {!selected.enabled && (
                  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Bu entegrasyon henüz etkinleştirilmedi. Yapılandırmayı tamamlayıp "Etkinleştir" butonuna basın.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {AVAILABLE_INTEGRATIONS.find(i => i.id === selected.id)?.configFields.map((field) => {
                    const isSecret = field.toLowerCase().includes('password') || 
                                     field.toLowerCase().includes('secret') ||
                                     field.toLowerCase().includes('key');
                    
                    return (
                      <div key={field}>
                        <Input
                          label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          type={isSecret ? 'password' : 'text'}
                          value={selected.config[field] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            handleConfigChange(field, e.target.value)}
                          placeholder={`Enter ${field}...`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button 
                    onClick={handleTest} 
                    disabled={testing || !selected.enabled}
                    variant="secondary"
                  >
                    {testing ? '⏳ Test Ediliyor...' : '🧪 Bağlantıyı Test Et'}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-2">📘 Kurulum Bilgisi</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tüm alanları doldurun</li>
                    <li>• "Etkinleştir" butonuna basın</li>
                    <li>• Bağlantıyı test edin</li>
                    <li>• Kaydet butonuna basarak değişiklikleri uygulayın</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔌</div>
                  <p>Yapılandırmak için bir entegrasyon seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {integrations.filter(i => i.enabled).length} / {integrations.length} entegrasyon aktif
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

