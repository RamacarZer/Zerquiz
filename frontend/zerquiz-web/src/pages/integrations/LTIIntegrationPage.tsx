import React, { useState } from 'react';
import { 
  Link2, Plus, X, Settings, Key, 
  RefreshCw, AlertCircle, CheckCircle, Loader
} from 'lucide-react';
import { toast } from '@/components/common/Alert';

interface LTIPlatform {
  id: string;
  name: string;
  type: 'canvas' | 'moodle' | 'blackboard' | 'google_classroom' | 'microsoft_teams';
  logo: string;
  status: 'connected' | 'disconnected' | 'error';
  clientId?: string;
  lastSync?: string;
  studentsCount?: number;
  coursesCount?: number;
}

export default function LTIIntegrationPage() {
  const [platforms, setPlatforms] = useState<LTIPlatform[]>([
    {
      id: 'canvas-1',
      name: 'Canvas LMS',
      type: 'canvas',
      logo: '🎨',
      status: 'connected',
      clientId: 'canvas_client_***45',
      lastSync: '2024-11-28T10:30:00Z',
      studentsCount: 450,
      coursesCount: 12,
    },
    {
      id: 'moodle-1',
      name: 'Moodle Platform',
      type: 'moodle',
      logo: '🎓',
      status: 'connected',
      clientId: 'moodle_client_***67',
      lastSync: '2024-11-28T09:15:00Z',
      studentsCount: 320,
      coursesCount: 8,
    },
    {
      id: 'blackboard-1',
      name: 'Blackboard Learn',
      type: 'blackboard',
      logo: '📚',
      status: 'error',
      clientId: 'bb_client_***23',
      lastSync: '2024-11-27T18:45:00Z',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<LTIPlatform | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const availablePlatforms = [
    { type: 'canvas', name: 'Canvas LMS', logo: '🎨', description: 'Instructure Canvas integration' },
    { type: 'moodle', name: 'Moodle', logo: '🎓', description: 'Moodle LMS integration' },
    { type: 'blackboard', name: 'Blackboard Learn', logo: '📚', description: 'Blackboard integration' },
    { type: 'google_classroom', name: 'Google Classroom', logo: '🏫', description: 'Google Classroom sync' },
    { type: 'microsoft_teams', name: 'Microsoft Teams', logo: '💼', description: 'MS Teams Education' },
  ];

  const handleSync = async (platformId: string) => {
    setIsSyncing(platformId);
    try {
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, lastSync: new Date().toISOString(), status: 'connected' as const }
        : p
    ));
      toast.success('Senkronizasyon tamamlandı!');
    } catch (error) {
      toast.error('Senkronizasyon başarısız!');
    } finally {
    setIsSyncing(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    if (confirm('Bu platformla bağlantıyı kesmek istediğinize emin misiniz?')) {
      setPlatforms(prev => prev.filter(p => p.id !== platformId));
      toast.success('Bağlantı kesildi!');
    }
  };

  const handleAddPlatform = (type: string) => {
    setShowAddModal(false);
    toast.info(`${type} için LTI kurulum sihirbazı açılıyor... (Demo)`);
    // In real app: Open OAuth flow or config wizard
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
          <CheckCircle className="h-3 w-3" /> Bağlı
        </span>;
      case 'error':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-medium rounded-full">
          <AlertCircle className="h-3 w-3" /> Hata
        </span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded-full">
          <X className="h-3 w-3" /> Bağlı Değil
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Link2 className="h-8 w-8 text-blue-600" />
              LTI Entegrasyonları
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Diğer eğitim platformlarıyla entegrasyon ayarlarını yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Yeni Platform Ekle
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">LTI (Learning Tools Interoperability) Nedir?</p>
              <p>LTI, farklı eğitim platformlarının birbirleriyle iletişim kurmasını sağlayan standart bir protokoldür. 
              Zerquiz sınavlarını Canvas, Moodle veya Blackboard gibi LMS'lere entegre edebilir, 
              öğrenci listelerini senkronize edebilir ve notları otomatik aktarabilirsiniz.</p>
            </div>
          </div>
        </div>

        {/* Connected Platforms */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bağlı Platformlar ({platforms.length})</h2>
          
          {platforms.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
              <Link2 className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Henüz bağlı platform yok</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Başlamak için yukarıdaki "Yeni Platform Ekle" butonuna tıklayın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map(platform => (
                <div key={platform.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{platform.logo}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{platform.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{platform.clientId}</p>
                      </div>
                    </div>
                    {getStatusBadge(platform.status)}
                  </div>

                  {platform.status === 'connected' && (
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Öğrenci Sayısı</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{platform.studentsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Kurs Sayısı</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{platform.coursesCount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Son Senkronizasyon</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(platform.lastSync!).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )}

                  {platform.status === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-400">
                        <strong>Bağlantı hatası:</strong> OAuth token süresi dolmuş. Lütfen yeniden yetkilendirin.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSync(platform.id)}
                      disabled={isSyncing === platform.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700"
                    >
                      {isSyncing === platform.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Senkronize Ediliyor...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Senkronize
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPlatform(platform)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
                      title="Ayarlar"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Bağlantıyı Kes"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LTI Configuration Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Entegrasyon Kurulum Rehberi</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">LMS'nizde LTI Tool Ekleyin</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Canvas/Moodle/Blackboard admin panelinden "External Tool" veya "LTI Provider" seçeneğini bulun.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Zerquiz Bilgilerini Girin</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-900 dark:text-gray-100">Launch URL: https://zerquiz.com/lti/launch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-900 dark:text-gray-100">Consumer Key: your_client_id</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-900 dark:text-gray-100">Shared Secret: your_client_secret</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Yetkileri Ayarlayın</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Zerquiz'in öğrenci listesine erişmesi ve notları geri göndermesi için gerekli yetkileri verin.</p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <li>Roster/Membership okuma</li>
                  <li>Grade passback (Not gönderme)</li>
                  <li>Content-item placement (Deep linking)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Bağlantıyı Test Edin</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">LMS'nizdeki bir kursa Zerquiz sınavı ekleyin ve öğrenci olarak test edin. Notların otomatik aktarıldığını doğrulayın.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-100 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>
                <strong>Not:</strong> LTI 1.3 kurulumu için teknik dokümantasyona ihtiyacınız varsa, 
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">kurulum kılavuzumuzu</a> inceleyebilir 
                veya <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">destek ekibimizle</a> iletişime geçebilirsiniz.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Add Platform Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Seçin</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availablePlatforms.map(plat => (
                <button
                  key={plat.type}
                  onClick={() => handleAddPlatform(plat.name)}
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg transition-all hover:shadow-md text-left bg-white dark:bg-gray-800"
                >
                  <div className="text-3xl">{plat.logo}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{plat.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Settings Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPlatform.name} Ayarları</h2>
              <button onClick={() => setSelectedPlatform(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                <input
                  type="text"
                  value={selectedPlatform.clientId}
                  disabled
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İzinler</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Öğrenci listesi okuma</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Not gönderme (Grade passback)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Deep linking</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toast.info('Yeniden yetkilendirme başlatılıyor... (Demo)');
                    setSelectedPlatform(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Yeniden Yetkilendir
                </button>
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


