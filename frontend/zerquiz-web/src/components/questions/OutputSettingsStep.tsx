import React from 'react';

const OUTPUT_CHANNELS = [
  { id: 'book', label: 'Kitap', icon: '📚', description: 'Kitap formatında yayın' },
  { id: 'mock_exam', label: 'Deneme', icon: '📝', description: 'Deneme sınavı' },
  { id: 'question_bank', label: 'Soru Bankası', icon: '🗂️', description: 'Soru bankası' },
  { id: 'presentation', label: 'Sunum', icon: '📊', description: 'Sunum materyali' },
  { id: 'exam', label: 'Sınav', icon: '🎓', description: 'Resmi sınav' },
];

const DELIVERY_MODES = [
  { id: 'online', label: 'Online', icon: '🌐', description: 'İnternet üzerinden erişim' },
  { id: 'offline', label: 'Offline', icon: '📄', description: 'Basılı/çevrimdışı format' },
  { id: 'hybrid', label: 'Hibrit', icon: '🔄', description: 'Hem online hem offline' },
];

interface OutputSettingsStepProps {
  selectedOutputs: string[];
  setSelectedOutputs: (outputs: string[]) => void;
  selectedDeliveryModes: string[];
  setSelectedDeliveryModes: (modes: string[]) => void;
}

export default function OutputSettingsStep({
  selectedOutputs,
  setSelectedOutputs,
  selectedDeliveryModes,
  setSelectedDeliveryModes,
}: OutputSettingsStepProps) {
  const toggleSelection = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      if (list.length === 1) return; // En az bir seçim olmalı
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleOutputToggle = (value: string) => {
    toggleSelection(value, selectedOutputs, setSelectedOutputs);
  };

  const handleDeliveryToggle = (value: string) => {
    toggleSelection(value, selectedDeliveryModes, setSelectedDeliveryModes);
  };

  return (
    <div className="space-y-6">
      {/* Çıktı Türleri */}
      <div className="border border-gray-200 rounded-lg p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Çıktı Türleri</h3>
          <p className="text-sm text-gray-600">
            Bu sorunun hangi çıktı türlerinde kullanılabileceğini belirleyin. Birden fazla seçim yapabilirsiniz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {OUTPUT_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              type="button"
              onClick={() => handleOutputToggle(channel.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedOutputs.includes(channel.id)
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{channel.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${
                      selectedOutputs.includes(channel.id) ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {channel.label}
                    </h4>
                    {selectedOutputs.includes(channel.id) && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    selectedOutputs.includes(channel.id) ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {channel.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Teslim Şekli */}
      <div className="border border-gray-200 rounded-lg p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Teslim Şekli</h3>
          <p className="text-sm text-gray-600">
            Sorunun nasıl dağıtılacağını belirleyin. Online, offline veya her ikisini seçebilirsiniz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DELIVERY_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleDeliveryToggle(mode.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedDeliveryModes.includes(mode.id)
                  ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${
                      selectedDeliveryModes.includes(mode.id) ? 'text-emerald-900' : 'text-gray-900'
                    }`}>
                      {mode.label}
                    </h4>
                    {selectedDeliveryModes.includes(mode.id) && (
                      <span className="text-emerald-600">✓</span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    selectedDeliveryModes.includes(mode.id) ? 'text-emerald-700' : 'text-gray-600'
                  }`}>
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Seçim Özeti */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Seçim Özeti</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-blue-800 font-medium mb-1">Çıktı Türleri:</p>
            <p className="text-blue-700">
              {selectedOutputs.length > 0
                ? OUTPUT_CHANNELS.filter(c => selectedOutputs.includes(c.id))
                    .map(c => c.label)
                    .join(', ')
                : 'Seçim yapılmadı'}
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium mb-1">Teslim Şekli:</p>
            <p className="text-blue-700">
              {selectedDeliveryModes.length > 0
                ? DELIVERY_MODES.filter(m => selectedDeliveryModes.includes(m.id))
                    .map(m => m.label)
                    .join(', ')
                : 'Seçim yapılmadı'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

