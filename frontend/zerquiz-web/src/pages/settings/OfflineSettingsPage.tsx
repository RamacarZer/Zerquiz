import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Download, HardDrive, Trash2, Settings, 
  CheckCircle, XCircle, RefreshCw, Database, Clock, Info 
} from 'lucide-react';

export function OfflineSettingsPage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [downloadedExams, setDownloadedExams] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estimate storage usage (simulated)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setStorageUsed(estimate.usage || 0);
        setStorageQuota(estimate.quota || 0);
      });
    } else {
      // Mock data for browsers that don't support Storage API
      setStorageUsed(25 * 1024 * 1024); // 25 MB
      setStorageQuota(100 * 1024 * 1024); // 100 MB
    }

    // Mock downloaded exams
    setDownloadedExams([
      { id: 'exam-001', name: 'Matematik Deneme Sınavı #1', size: 5.2, downloadedAt: '2024-11-27T10:00:00Z' },
      { id: 'exam-002', name: 'Fizik Ara Sınav', size: 3.8, downloadedAt: '2024-11-26T14:30:00Z' },
      { id: 'exam-003', name: 'Türkçe Test', size: 2.1, downloadedAt: '2024-11-25T09:15:00Z' },
    ]);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercentage = (storageUsed / storageQuota) * 100;

  const handleClearCache = () => {
    if (confirm('Tüm çevrimdışı veriler silinecek. Devam etmek istiyor musunuz?')) {
      // In real app: Clear IndexedDB, Cache API
      alert('Önbellek temizlendi! (Demo)');
      setStorageUsed(0);
      setDownloadedExams([]);
    }
  };

  const handleDeleteExam = (examId: string) => {
    setDownloadedExams(prev => prev.filter(e => e.id !== examId));
    alert(`Sınav silindi! (Demo)`);
  };

  const handleToggleOffline = () => {
    setOfflineEnabled(!offlineEnabled);
    if (!offlineEnabled) {
      alert('Çevrimdışı mod etkinleştirildi! Sınavlar artık offline çalışabilir.');
    } else {
      alert('Çevrimdışı mod devre dışı bırakıldı. Aktif internet bağlantısı gerekir.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <WifiOff className="h-8 w-8 text-blue-600" />
            Çevrimdışı Mod Ayarları
          </h1>
          <p className="text-gray-600 mt-2">
            İnternet bağlantınız olmadan sınavlara devam edebilmeniz için çevrimdışı mod özelliklerini yapılandırın.
          </p>
        </div>

        {/* Network Status Card */}
        <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${
          isOnline ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            {isOnline ? (
              <>
                <Wifi className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Çevrimiçi</h3>
                  <p className="text-sm text-green-700">İnternet bağlantınız aktif</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="h-6 w-6 text-yellow-600 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Çevrimdışı</h3>
                  <p className="text-sm text-yellow-700">İnternet bağlantısı yok - Offline mod aktif</p>
                </div>
              </>
            )}
          </div>
          {offlineEnabled ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mod: Aktif</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mod: Devre Dışı</span>
            </div>
          )}
        </div>

        {/* Main Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Genel Ayarlar
            </h2>

            <div className="space-y-4">
              {/* Enable Offline Mode */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Çevrimdışı Modu Etkinleştir</h3>
                  <p className="text-sm text-gray-600">Sınavları internetsiz çözebilirsiniz</p>
                </div>
                <button
                  onClick={handleToggleOffline}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    offlineEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      offlineEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-save Interval */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Otomatik Kayıt Aralığı
                </label>
                <select
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 saniye</option>
                  <option value={30}>30 saniye (Önerilen)</option>
                  <option value={60}>1 dakika</option>
                  <option value={120}>2 dakika</option>
                  <option value={300}>5 dakika</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Cevaplarınız her {autoSaveInterval} saniyede bir otomatik kaydedilir
                </p>
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Çevrimdışı Mod Nasıl Çalışır?</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Sınavlar cihazınıza indirilir</li>
                    <li>Cevaplarınız yerel olarak kaydedilir</li>
                    <li>İnternet geldiğinde otomatik senkronize olur</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              Depolama Alanı
            </h2>

            <div className="space-y-4">
              {/* Storage Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Kullanılan Alan</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatBytes(storageUsed)} / {formatBytes(storageQuota)}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      storagePercentage > 80 ? 'bg-red-500' : storagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${storagePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  %{storagePercentage.toFixed(1)} kullanımda
                </p>
              </div>

              {/* Storage Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Sınav Verileri</span>
                  <span className="text-sm font-medium text-gray-900">18.3 MB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Cevap Kayıtları</span>
                  <span className="text-sm font-medium text-gray-900">4.7 MB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Önbellek</span>
                  <span className="text-sm font-medium text-gray-900">2.1 MB</span>
                </div>
              </div>

              {/* Clear Cache Button */}
              <button
                onClick={handleClearCache}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Tüm Çevrimdışı Verileri Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Downloaded Exams */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            İndirilen Sınavlar ({downloadedExams.length})
          </h2>

          {downloadedExams.length === 0 ? (
            <div className="text-center py-12">
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Henüz çevrimdışı kullanım için sınav indirilmedi</p>
              <p className="text-sm text-gray-500 mt-1">
                Sınav sayfasından "Çevrimdışı İçin İndir" butonuna tıklayabilirsiniz
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloadedExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exam.size} MB • İndirildi: {new Date(exam.downloadedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


