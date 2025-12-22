import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Database,
  Bot,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Save,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  SystemDefinition,
  AuditLog,
  AIConfiguration,
  getSystemDefinitions,
  getSystemDefinitionCategories,
  createSystemDefinition,
  updateSystemDefinition,
  deleteSystemDefinition,
  getAuditLogs,
  getAIConfiguration,
  updateAIConfiguration,
} from '@/services/api/systemService';
import SystemDefinitionModal from '@/components/modals/SystemDefinitionModal';
import AIConfigModal from '@/components/modals/AIConfigModal';
import { toast } from '@/components/common/Alert';

export default function AdminSystemPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'definitions' | 'ai-config' | 'audit-logs'>('definitions');
  const [searchTerm, setSearchTerm] = useState('');

  // System Definitions State
  const [definitions, setDefinitions] = useState<SystemDefinition[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<SystemDefinition | null>(null);
  const [isDefinitionModalOpen, setIsDefinitionModalOpen] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // AI Config State
  const [aiConfig, setAiConfig] = useState<AIConfiguration | null>(null);
  const [isLoadingAIConfig, setIsLoadingAIConfig] = useState(false);
  const [isAIConfigModalOpen, setIsAIConfigModalOpen] = useState(false);

  // Load System Definitions
  useEffect(() => {
    if (activeTab === 'definitions') {
      loadSystemDefinitions();
      loadCategories();
    }
  }, [activeTab]);

  // Load Audit Logs
  useEffect(() => {
    if (activeTab === 'audit-logs') {
      loadAuditLogs();
    }
  }, [activeTab]);

  // Load AI Config
  useEffect(() => {
    if (activeTab === 'ai-config') {
      loadAIConfig();
    }
  }, [activeTab]);

  const loadSystemDefinitions = async () => {
    setIsLoadingDefinitions(true);
    try {
      const data = await getSystemDefinitions();
      setDefinitions(data);
    } catch (error) {
      console.error('Error loading system definitions:', error);
      toast.error('Sistem tanımları yüklenemedi');
    } finally {
      setIsLoadingDefinitions(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getSystemDefinitionCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const response = await getAuditLogs({ page: 1, pageSize: 50 });
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Denetim kayıtları yüklenemedi');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const loadAIConfig = async () => {
    setIsLoadingAIConfig(true);
    try {
      const config = await getAIConfiguration();
      setAiConfig(config);
    } catch (error) {
      console.error('Error loading AI config:', error);
      toast.error('AI yapılandırması yüklenemedi');
    } finally {
      setIsLoadingAIConfig(false);
    }
  };

  const handleCreateDefinition = () => {
    setSelectedDefinition(null);
    setIsDefinitionModalOpen(true);
  };

  const handleEditDefinition = (definition: SystemDefinition) => {
    setSelectedDefinition(definition);
    setIsDefinitionModalOpen(true);
  };

  const handleSaveDefinition = async (definition: Partial<SystemDefinition>) => {
    try {
      if (selectedDefinition) {
        await updateSystemDefinition(selectedDefinition.id, definition);
        toast.success('Sistem tanımı güncellendi');
      } else {
        await createSystemDefinition(definition);
        toast.success('Sistem tanımı oluşturuldu');
      }
      await loadSystemDefinitions();
      setIsDefinitionModalOpen(false);
    } catch (error: any) {
      console.error('Error saving definition:', error);
      toast.error(error.response?.data?.message || 'Kaydetme başarısız');
    }
  };

  const handleDeleteDefinition = async (id: string) => {
    if (!confirm('Bu sistem tanımını silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteSystemDefinition(id);
      toast.success('Sistem tanımı silindi');
      await loadSystemDefinitions();
    } catch (error: any) {
      console.error('Error deleting definition:', error);
      toast.error(error.response?.data?.message || 'Silme başarısız');
    }
  };

  const handleSaveAIConfig = async (config: Partial<AIConfiguration>) => {
    try {
      await updateAIConfiguration(config);
      toast.success('AI yapılandırması güncellendi');
      await loadAIConfig();
      setIsAIConfigModalOpen(false);
    } catch (error: any) {
      console.error('Error saving AI config:', error);
      toast.error('AI yapılandırması kaydedilemedi');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredDefinitions = definitions.filter(
    (def) =>
      def.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-red-600" />
          {t('system_management') || 'Sistem Yönetimi'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistem ayarları, tanımlamaları ve yapılandırma
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('definitions')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'definitions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-5 h-5" />
              Sistem Tanımlamaları
            </button>
            <button
              onClick={() => setActiveTab('ai-config')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'ai-config'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-5 h-5" />
              AI Yapılandırması
            </button>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'audit-logs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Denetim Kayıtları
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* System Definitions Tab */}
          {activeTab === 'definitions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tanımlama ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSystemDefinitions}
                    disabled={isLoadingDefinitions}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoadingDefinitions ? 'animate-spin' : ''}`} />
                    Yenile
                  </button>
                  <button
                    onClick={handleCreateDefinition}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Yeni Tanımlama
                  </button>
                </div>
              </div>

              {isLoadingDefinitions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredDefinitions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz tanımlama bulunmuyor'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDefinitions.map((def) => (
                    <div
                      key={def.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm font-mono rounded">
                              {def.code}
                            </code>
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
                              {def.category}
                            </span>
                            {!def.isActive && (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded">
                                Pasif
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            {def.nameTr || def.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {def.descriptionTr || def.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              Sıra: {def.displayOrder}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              Güncelleme: {new Date(def.updatedAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEditDefinition(def)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {!def.isSystemReserved && (
                            <button
                              onClick={() => handleDeleteDefinition(def.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Configuration Tab */}
          {activeTab === 'ai-config' && (
            <div className="space-y-6">
              {isLoadingAIConfig ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : aiConfig ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Sağlayıcı</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {aiConfig.provider}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Model</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {aiConfig.model}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temperature</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {aiConfig.temperature}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Tokens</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {aiConfig.maxTokens}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Aktif Özellikler</h3>
                    <div className="space-y-2">
                      {aiConfig.questionGenerationEnabled && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            Otomatik Soru Üretimi Aktif
                          </span>
                        </div>
                      )}
                      {aiConfig.contentSummarizationEnabled && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            İçerik Özetleme Aktif
                          </span>
                        </div>
                      )}
                      {aiConfig.autoTranslationEnabled && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            Otomatik Çeviri Aktif
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAIConfigModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    Yapılandırmayı Düzenle
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  AI yapılandırması yüklenemedi
                </div>
              )}
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Son Sistem İşlemleri
                </h3>
                <button
                  onClick={loadAuditLogs}
                  disabled={isLoadingLogs}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                  Yenile
                </button>
              </div>

              {isLoadingLogs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Henüz denetim kaydı bulunmuyor
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {log.details || `${log.entityType} üzerinde işlem`}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor('info')}`}
                      >
                        info
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>IP: {log.ipAddress}</span>
                      <span>•</span>
                      <span>{new Date(log.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SystemDefinitionModal
        isOpen={isDefinitionModalOpen}
        onClose={() => setIsDefinitionModalOpen(false)}
        onSave={handleSaveDefinition}
        definition={selectedDefinition}
        categories={categories}
      />

      <AIConfigModal
        isOpen={isAIConfigModalOpen}
        onClose={() => setIsAIConfigModalOpen(false)}
        onSave={handleSaveAIConfig}
        config={aiConfig}
      />
    </div>
  );
}

