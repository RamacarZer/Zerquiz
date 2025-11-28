import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Settings, Plus, Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  demoMailProviders,
  demoSMSProviders,
  demoPushProviders,
  notificationSettings,
  demoDeliveryLogs,
  getActiveMailProvider,
  calculateQuotaUsage,
  getProviderIcon,
  getProviderDisplayName,
  getDeliveryStats,
  type MailProviderConfig,
  type SMSProviderConfig,
  type PushProviderConfig,
} from '../../mocks/mailProviderSettings';

type TabType = 'email' | 'sms' | 'push' | 'settings' | 'logs';

export default function MailProviderSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [selectedProvider, setSelectedProvider] = useState<MailProviderConfig | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const deliveryStats = getDeliveryStats(demoDeliveryLogs);

  const handleTestConnection = async (providerId: string) => {
    setIsTestingConnection(true);
    // Simulated test
    setTimeout(() => {
      alert('Bağlantı başarılı! ✅');
      setIsTestingConnection(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <Check className="h-3 w-3" />
            Bağlı
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            <X className="h-3 w-3" />
            Bağlı Değil
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            Hata
          </span>
        );
      case 'testing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Test Ediliyor
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mail & Bildirim Ayarları</h1>
                <p className="text-sm text-gray-600">E-posta, SMS ve Push bildirim provider entegrasyonları</p>
              </div>
            </div>

            <button
              onClick={() => alert('Yeni provider ekleniyor...')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Yeni Provider
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Gönderilen</div>
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{deliveryStats.sent.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">
              Teslimat Oranı: {deliveryStats.deliveryRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Açılma Oranı</div>
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{deliveryStats.openRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {deliveryStats.opened} açılma
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Tıklama Oranı</div>
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{deliveryStats.clickRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {deliveryStats.clicked} tıklama
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Bounce Oranı</div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{deliveryStats.bounceRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {deliveryStats.bounced} bounce
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'email'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="h-5 w-5" />
              E-posta Providers
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                {demoMailProviders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'sms'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              SMS Providers
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                {demoSMSProviders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('push')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'push'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="h-5 w-5" />
              Push Providers
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                {demoPushProviders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'settings'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5" />
              Genel Ayarlar
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'logs'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <RefreshCw className="h-5 w-5" />
              Delivery Logs
            </button>
          </div>
        </div>

        {/* Email Providers Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            {demoMailProviders.map((provider) => {
              const quotaUsage = calculateQuotaUsage(provider.quotas);
              return (
                <div key={provider.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{getProviderIcon(provider.provider)}</div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                          {getStatusBadge(provider.status)}
                          {provider.isPrimary && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Birincil
                            </span>
                          )}
                          {provider.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {getProviderDisplayName(provider.provider)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTestConnection(provider.id)}
                        disabled={isTestingConnection}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium disabled:opacity-50"
                      >
                        {isTestingConnection ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
                      </button>
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                      >
                        Düzenle
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Günlük Limit</div>
                      <div className="text-sm font-bold text-gray-900">
                        {provider.settings.dailyLimit?.toLocaleString() || '∞'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Günlük Kullanım</div>
                      <div className="text-sm font-bold text-gray-900">
                        {provider.quotas.dailyUsed.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Aylık Kota</div>
                      <div className="text-sm font-bold text-gray-900">
                        {provider.quotas.monthlyQuota.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Aylık Kullanım</div>
                      <div className="text-sm font-bold text-gray-900">
                        {provider.quotas.monthlyUsed.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Günlük Kullanım</span>
                      <span>{quotaUsage.dailyPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          quotaUsage.dailyPercentage > 80 ? 'bg-red-500' : 
                          quotaUsage.dailyPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${quotaUsage.dailyPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Aylık Kullanım</span>
                      <span>{quotaUsage.monthlyPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          quotaUsage.monthlyPercentage > 80 ? 'bg-red-500' : 
                          quotaUsage.monthlyPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${quotaUsage.monthlyPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600">From Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{provider.settings.fromEmail}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reply To:</span>
                        <span className="ml-2 font-medium text-gray-900">{provider.settings.replyToEmail || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tracking:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {provider.settings.trackOpens && provider.settings.trackClicks ? 'Açık + Tıklama' : 
                           provider.settings.trackOpens ? 'Sadece Açık' : 'Kapalı'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SMS Providers Tab */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            {demoSMSProviders.map((provider) => {
              const quotaUsage = calculateQuotaUsage(provider.quotas);
              return (
                <div key={provider.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{getProviderIcon(provider.provider)}</div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                          {getStatusBadge(provider.status)}
                          {provider.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {getProviderDisplayName(provider.provider)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('SMS provider düzenleniyor...')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                      Düzenle
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Günlük Kullanım</div>
                      <div className="text-sm font-bold text-gray-900">{provider.quotas.dailyUsed.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Aylık Kullanım</div>
                      <div className="text-sm font-bold text-gray-900">{provider.quotas.monthlyUsed.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Sender ID</div>
                      <div className="text-sm font-bold text-gray-900">{provider.settings.defaultSender}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Max Uzunluk</div>
                      <div className="text-sm font-bold text-gray-900">{provider.settings.maxLength} karakter</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Aylık Kullanım</span>
                      <span>{quotaUsage.monthlyPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          quotaUsage.monthlyPercentage > 80 ? 'bg-red-500' : 
                          quotaUsage.monthlyPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${quotaUsage.monthlyPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Push Providers Tab */}
        {activeTab === 'push' && (
          <div className="space-y-4">
            {demoPushProviders.map((provider) => (
              <div key={provider.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getProviderIcon(provider.provider)}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                        {getStatusBadge(provider.status)}
                        {provider.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getProviderDisplayName(provider.provider)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Push provider düzenleniyor...')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                  >
                    Düzenle
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600 mb-1">Ses</div>
                    <div className="text-sm font-bold text-gray-900">
                      {provider.settings.enableSound ? '✓ Aktif' : '✗ Kapalı'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600 mb-1">Badge</div>
                    <div className="text-sm font-bold text-gray-900">
                      {provider.settings.enableBadge ? '✓ Aktif' : '✗ Kapalı'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600 mb-1">TTL</div>
                    <div className="text-sm font-bold text-gray-900">
                      {Math.floor(provider.settings.defaultTTL / 86400)} gün
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600 mb-1">Öncelik</div>
                    <div className="text-sm font-bold text-gray-900 capitalize">{provider.settings.priority}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Genel Bildirim Ayarları</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">E-posta Bildirimleri</div>
                    <div className="text-sm text-gray-600">E-posta gönderimini etkinleştir</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailEnabled}
                    readOnly
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">SMS Bildirimleri</div>
                    <div className="text-sm text-gray-600">SMS gönderimini etkinleştir</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsEnabled}
                    readOnly
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Push Bildirimleri</div>
                    <div className="text-sm text-gray-600">Push notification gönderimini etkinleştir</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushEnabled}
                    readOnly
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Toplu Gönderim</div>
                    <div className="text-sm text-gray-600">Batch sending (Grup: {notificationSettings.batchSize})</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.enableBatchSending}
                    readOnly
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Queue Ayarları</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded p-4">
                    <div className="text-xs text-gray-600 mb-1">Queue Provider</div>
                    <div className="text-sm font-bold text-gray-900 capitalize">{notificationSettings.queueProvider}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="text-xs text-gray-600 mb-1">Max Retry</div>
                    <div className="text-sm font-bold text-gray-900">{notificationSettings.maxRetries} deneme</div>
                  </div>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="text-xs text-gray-600 mb-1">Öncelik Sistemi</div>
                    <div className="text-sm font-bold text-gray-900">
                      {notificationSettings.queuePriority ? '✓ Aktif' : '✗ Kapalı'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Son Gönderimler</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Zaman</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Kanal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Alıcı</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Konu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {demoDeliveryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(log.sentAt).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="capitalize">{log.provider}</span>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{log.channel}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.recipient}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.subject || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'opened' ? 'bg-green-100 text-green-800' :
                          log.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          log.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                          log.status === 'bounced' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

