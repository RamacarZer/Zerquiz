import React, { useState } from 'react';
import { MessageSquare, Bell, Megaphone, Send, Pin, Eye, Search } from 'lucide-react';
import {
  demoMessages,
  demoNotifications,
  demoAnnouncements,
  getUnreadMessagesCount,
  getUnreadNotificationsCount,
  getPinnedAnnouncements,
  type Message,
  type Notification,
  type Announcement,
} from '../../mocks/communicationData';

export default function CommunicationCenterPage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications' | 'announcements'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const unreadMessages = getUnreadMessagesCount();
  const unreadNotifications = getUnreadNotificationsCount();
  const pinnedAnnouncements = getPinnedAnnouncements();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return '💬';
      case 'exam': return '📝';
      case 'grade': return '📊';
      case 'certificate': return '🎓';
      case 'system': return '⚙️';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">🚨 Acil</span>;
      case 'high':
        return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">⚠️ Yüksek</span>;
      case 'normal':
        return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">📋 Normal</span>;
      case 'low':
        return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">ℹ️ Düşük</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">İletişim Merkezi</h1>
                <p className="text-sm text-gray-600">Mesajlar, bildirimler ve duyurular</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={() => alert('Yeni mesaj oluşturuluyor...')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Send className="h-4 w-4" />
                Yeni Mesaj
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'messages'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              Mesajlar
              {unreadMessages > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="h-5 w-5" />
              Bildirimler
              {unreadNotifications > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'announcements'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Megaphone className="h-5 w-5" />
              Duyurular
              {pinnedAnnouncements.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                  {pinnedAnnouncements.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {demoMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg border p-4 cursor-pointer transition ${
                  message.isRead ? 'border-gray-200' : 'border-blue-300 bg-blue-50'
                } hover:shadow-lg`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {message.sender.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{message.sender.name}</div>
                        <div className="text-xs text-gray-600">{message.sender.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(message.priority)}
                    {!message.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">{message.content}</p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>{new Date(message.sentAt).toLocaleString('tr-TR')}</span>
                    {message.hasAttachments && <span>📎 {message.attachments.length} ek</span>}
                    {message.labels.length > 0 && (
                      <div className="flex gap-1">
                        {message.labels.map((label) => (
                          <span key={label} className="px-2 py-0.5 bg-gray-100 rounded-full">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {demoNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-4 transition ${
                  notification.isRead ? 'border-gray-200' : 'border-blue-300 bg-blue-50'
                } hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {new Date(notification.createdAt).toLocaleString('tr-TR')}
                      </span>
                      {notification.actionUrl && (
                        <button
                          onClick={() => alert(`Yönlendiriliyor: ${notification.actionUrl}`)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Git →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {demoAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {announcement.isPinned && (
                      <Pin className="h-5 w-5 text-yellow-600" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                  </div>
                  {getPriorityBadge(announcement.priority)}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 whitespace-pre-wrap text-sm text-gray-700">
                  {announcement.content}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {announcement.author.name.charAt(0)}
                      </div>
                      <span>{announcement.author.name}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(announcement.publishedAt).toLocaleDateString('tr-TR')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {announcement.views} görüntüleme
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {announcement.targetAudience === 'all' ? '👥 Herkes' :
                     announcement.targetAudience === 'students' ? '🎓 Öğrenciler' :
                     announcement.targetAudience === 'teachers' ? '👨‍🏫 Öğretmenler' : '👑 Yöneticiler'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedMessage(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedMessage.sender.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selectedMessage.sender.name}</div>
                  <div className="text-sm text-gray-600">{selectedMessage.sender.email}</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedMessage.subject}</h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>

              {selectedMessage.attachments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Ekler</h3>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span>📎</span>
                        <span className="flex-1 text-sm text-gray-700">{att.name}</span>
                        <span className="text-xs text-gray-500">
                          {(att.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button className="text-blue-600 text-sm hover:text-blue-700">İndir</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => alert('Yanıt veriliyor...')}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Yanıtla
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
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

