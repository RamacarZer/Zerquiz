import { generateUUID } from '../lib/mockStorage';

// ==================== GELİŞMİŞ İLETİŞİM VERİ MODELLERİ ====================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientIds: string[];
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  isRead: boolean;
  readBy: { userId: string; readAt: string }[];
  replyTo?: string;
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  attachments: Attachment[];
  reactions: Reaction[];
  mentions: string[];
  sentAt: string;
  deliveredAt?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  description?: string;
  avatar?: string;
  participantIds: string[];
  createdBy: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  settings: ConversationSettings;
}

export interface ConversationSettings {
  allowFileSharing: boolean;
  allowReactions: boolean;
  allowEditing: boolean;
  allowDeletion: boolean;
  notificationsEnabled: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  mimeType: string;
  thumbnail?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'exam' | 'grade' | 'certificate' | 'system' | 'mention' | 'assignment' | 'announcement';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  expiresAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  targetAudience: 'all' | 'students' | 'teachers' | 'admins' | 'parents';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishedAt?: string;
  scheduledFor?: string;
  expiresAt?: string;
  isPinned: boolean;
  allowComments: boolean;
  views: number;
  comments: AnnouncementComment[];
  attachments: Attachment[];
  tags: string[];
  category: string;
}

export interface AnnouncementComment {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isEdited: boolean;
  likes: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  type: 'public' | 'private' | 'restricted';
  memberCount: number;
  createdBy: string;
  createdAt: string;
  category: string;
  tags: string[];
}

// ==================== DEMO KULLANICILAR ====================

export const demoUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin Kullanıcı',
    email: 'admin@zerquiz.com',
    role: 'Admin',
    department: 'Yönetim',
    status: 'online',
  },
  {
    id: 'u2',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'Öğretmen',
    department: 'Matematik',
    status: 'online',
  },
  {
    id: 'u3',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    role: 'Öğrenci',
    department: '10-A Sınıfı',
    status: 'away',
  },
  {
    id: 'u4',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    role: 'Öğretmen',
    department: 'Fen Bilgisi',
    status: 'busy',
  },
  {
    id: 'u5',
    name: 'Fatma Şahin',
    email: 'fatma@example.com',
    role: 'Öğretmen',
    department: 'Türkçe',
    status: 'online',
  },
  {
    id: 'u6',
    name: 'Ali Çelik',
    email: 'ali@example.com',
    role: 'Öğrenci',
    department: '10-B Sınıfı',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== DEMO KONUŞMALAR ====================

export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    participantIds: ['u1', 'u2'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    settings: {
      allowFileSharing: true,
      allowReactions: true,
      allowEditing: true,
      allowDeletion: true,
      notificationsEnabled: true,
    },
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Matematik Öğretmenleri',
    description: 'Matematik bölümü öğretmenleri iletişim grubu',
    participantIds: ['u1', 'u2', 'u4'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 5,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    settings: {
      allowFileSharing: true,
      allowReactions: true,
      allowEditing: true,
      allowDeletion: false,
      notificationsEnabled: true,
    },
  },
  {
    id: 'conv-3',
    type: 'channel',
    name: '📢 Genel Duyurular',
    description: 'Okul geneli duyurular ve haberler',
    participantIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    settings: {
      allowFileSharing: true,
      allowReactions: true,
      allowEditing: false,
      allowDeletion: false,
      notificationsEnabled: true,
    },
  },
];

// ==================== DEMO MESAJLAR ====================

export const demoMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'u2',
    recipientIds: ['u1'],
    content: 'Merhaba, geçen hafta yapılan matematik sınavının sonuçları ne zaman açıklanacak?',
    type: 'text',
    isRead: false,
    readBy: [],
    isEdited: false,
    isDeleted: false,
    attachments: [],
    reactions: [],
    mentions: [],
    sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'u2',
    recipientIds: ['u1'],
    content: 'Ayrıca sınav kağıtlarını inceleyebilir miyiz?',
    type: 'text',
    isRead: false,
    readBy: [],
    isEdited: false,
    isDeleted: false,
    attachments: [],
    reactions: [],
    mentions: [],
    sentAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'u1',
    recipientIds: ['u2', 'u4'],
    content: 'Yarınki toplantı için gündem maddeleri hazır. Ekli dosyayı inceleyebilir misiniz?',
    type: 'text',
    isRead: true,
    readBy: [
      { userId: 'u2', readAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
    isEdited: false,
    isDeleted: false,
    attachments: [
      {
        id: 'att-1',
        name: 'toplanti-gundemi.pdf',
        url: '/files/toplanti-gundemi.pdf',
        size: 245000,
        type: 'document',
        mimeType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'u1',
      },
    ],
    reactions: [
      { emoji: '👍', userId: 'u2', userName: 'Ahmet Yılmaz', addedAt: new Date().toISOString() },
    ],
    mentions: ['u2', 'u4'],
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== DEMO BİLDİRİMLER ====================

export const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'u1',
    type: 'message',
    title: 'Yeni Mesaj',
    message: 'Ahmet Yılmaz size bir mesaj gönderdi',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/communication?conversation=conv-1',
    actionText: 'Mesajı Görüntüle',
    priority: 'normal',
    category: 'İletişim',
  },
  {
    id: 'notif-2',
    userId: 'u1',
    type: 'exam',
    title: 'Sınav Hatırlatması',
    message: 'Matematik Final Sınavı yarın saat 10:00\'da başlayacak',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/exams/exam-001',
    actionText: 'Sınava Git',
    priority: 'high',
    category: 'Sınav',
  },
  {
    id: 'notif-3',
    userId: 'u1',
    type: 'grade',
    title: 'Notlar Açıklandı',
    message: 'Fen Bilgisi Ara Sınavı notlarınız açıklandı',
    isRead: true,
    readAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/exams/exam-002/grading',
    actionText: 'Notları Gör',
    priority: 'normal',
    category: 'Değerlendirme',
  },
  {
    id: 'notif-4',
    userId: 'u1',
    type: 'mention',
    title: 'Bahsedildiniz',
    message: 'Mehmet Kaya sizi bir grupta bahsetti',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/communication?conversation=conv-2',
    actionText: 'Mesajı Gör',
    priority: 'normal',
    category: 'İletişim',
  },
  {
    id: 'notif-5',
    userId: 'u1',
    type: 'system',
    title: 'Sistem Bakımı',
    message: 'Yarın gece 02:00-04:00 arası sistem bakımı yapılacaktır',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    priority: 'urgent',
    category: 'Sistem',
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== DEMO DUYURULAR ====================

export const demoAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '🎉 Yeni Özellikler Eklendi!',
    excerpt: 'Platformumuza heyecan verici yeni özellikler ekledik...',
    content: `Sevgili kullanıcılar,

Platformumuza heyecan verici yeni özellikler ekledik:

**Yeni Özellikler:**
- 📊 Gelişmiş soru editörü (65 soru tipi)
- 🎯 Akıllı sınav oluşturucu
- 📈 Detaylı analiz raporları
- 🏆 Sertifika sistemi
- 💬 Gelişmiş iletişim modülü

**İyileştirmeler:**
- Daha hızlı performans
- Kullanıcı arayüzü güncellemeleri
- Mobil uyumluluk iyileştirmeleri

İyi çalışmalar!`,
    author: demoUsers[0],
    targetAudience: 'all',
    priority: 'high',
    status: 'published',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    allowComments: true,
    views: 234,
    comments: [
      {
        id: 'com-1',
        announcementId: 'ann-1',
        userId: 'u2',
        userName: 'Ahmet Yılmaz',
        content: 'Harika! Yeni özellikler çok kullanışlı olmuş.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isEdited: false,
        likes: 12,
      },
      {
        id: 'com-2',
        announcementId: 'ann-1',
        userId: 'u3',
        userName: 'Ayşe Demir',
        content: 'Sınav sistemi çok daha kolay kullanılıyor şimdi 👍',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        isEdited: false,
        likes: 8,
      },
    ],
    attachments: [],
    tags: ['güncelleme', 'özellikler', 'yenilik'],
    category: 'Sistem',
  },
  {
    id: 'ann-2',
    title: '📅 Yaz Dönemi Sınav Takvimi',
    excerpt: 'Yaz dönemi final sınavları 15 Haziran\'da başlayacaktır...',
    content: `Değerli öğrenciler,

Yaz dönemi final sınavları **15 Haziran 2025** tarihinde başlayacaktır.

**Önemli Bilgiler:**
- Sınav programı kontrol panelinde yayınlandı
- Her sınav 90 dakika sürecektir
- Geç kalma toleransı 15 dakikadır
- Kimlik kartınızı yanınızda bulundurun

**Sınav Hazırlığı:**
- Ders notlarınızı gözden geçirin
- Örnek soruları çözün
- Konu anlatım videolarını izleyin

Başarılar dileriz!`,
    author: demoUsers[1],
    targetAudience: 'students',
    priority: 'high',
    status: 'published',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    allowComments: true,
    views: 189,
    comments: [],
    attachments: [
      {
        id: 'att-2',
        name: 'sinav-takvimi.pdf',
        url: '/files/sinav-takvimi.pdf',
        size: 320000,
        type: 'document',
        mimeType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'u1',
      },
    ],
    tags: ['sınav', 'takvim', 'önemli'],
    category: 'Eğitim',
  },
  {
    id: 'ann-3',
    title: '👨‍🏫 Öğretmenler İçin Eğitim Semineri',
    excerpt: 'Platform kullanımı ve yeni özellikler hakkında online eğitim...',
    content: `Sayın öğretmenler,

Platform kullanımı ve yeni özellikler hakkında **online eğitim semineri** düzenlenecektir.

**Detaylar:**
- **Tarih:** 20 Mayıs 2025
- **Saat:** 14:00 - 16:00
- **Platform:** Zoom
- **Katılım Linki:** zoom.us/j/123456789

**Gündem:**
1. Yeni soru editörü tanıtımı
2. Sınav oluşturma ipuçları
3. Analiz raporları kullanımı
4. Soru-cevap

Katılımınızı bekliyoruz!`,
    author: demoUsers[0],
    targetAudience: 'teachers',
    priority: 'normal',
    status: 'published',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    allowComments: true,
    views: 67,
    comments: [],
    attachments: [],
    tags: ['eğitim', 'seminer', 'öğretmen'],
    category: 'Eğitim',
  },
];

// ==================== MESAJ ŞABLONLARI ====================

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Sınav Hatırlatması',
    content: 'Merhaba, [Sınav Adı] sınavı [Tarih] tarihinde saat [Saat]\'te başlayacaktır. Hazırlıklarınızı tamamlamanızı hatırlatmak isteriz.',
    category: 'Sınav',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 45,
  },
  {
    id: 'tmpl-2',
    name: 'Ödev Teslim Hatırlatması',
    content: '[Ödev Adı] ödevinin son teslim tarihi [Tarih]\'dir. Lütfen ödevinizi zamanında teslim ediniz.',
    category: 'Ödev',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 78,
  },
  {
    id: 'tmpl-3',
    name: 'Toplantı Daveti',
    content: '[Tarih] tarihinde saat [Saat]\'te [Yer]\'de toplantımız bulunmaktadır. Katılımınızı rica ederiz.',
    category: 'Toplantı',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 23,
  },
];

// ==================== SOHBET GRUPLARI ====================

export const chatGroups: ChatGroup[] = [
  {
    id: 'group-1',
    name: 'Matematik Öğretmenleri',
    description: 'Matematik bölümü öğretmenleri iletişim grubu',
    type: 'private',
    memberCount: 12,
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Departman',
    tags: ['matematik', 'öğretmen'],
  },
  {
    id: 'group-2',
    name: '10-A Sınıfı',
    description: '10-A sınıfı öğrencileri',
    type: 'public',
    memberCount: 28,
    createdBy: 'u2',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Sınıf',
    tags: ['10-a', 'öğrenci'],
  },
  {
    id: 'group-3',
    name: 'Proje Ekibi',
    description: 'Yıl sonu projesi çalışma grubu',
    type: 'restricted',
    memberCount: 5,
    createdBy: 'u3',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Proje',
    tags: ['proje', 'çalışma'],
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getUserById(id: string): User | undefined {
  return demoUsers.find(u => u.id === id);
}

export function getConversationById(id: string): Conversation | undefined {
  return demoConversations.find(c => c.id === id);
}

export function getMessagesByConversation(conversationId: string): Message[] {
  return demoMessages.filter(m => m.conversationId === conversationId);
}

export function getUnreadNotificationsCount(userId: string): number {
  return demoNotifications.filter(n => n.userId === userId && !n.isRead).length;
}

export function getUnreadMessagesCount(userId: string): number {
  return demoConversations
    .filter(c => c.participantIds.includes(userId))
    .reduce((sum, c) => sum + c.unreadCount, 0);
}

export function getPinnedAnnouncements(): Announcement[] {
  return demoAnnouncements.filter(a => a.isPinned && a.status === 'published');
}

export function getAnnouncementsByAudience(audience: Announcement['targetAudience']): Announcement[] {
  return demoAnnouncements.filter(
    a => (a.targetAudience === audience || a.targetAudience === 'all') && a.status === 'published'
  );
}

export function getOnlineUsers(): User[] {
  return demoUsers.filter(u => u.status === 'online');
}

export function searchUsers(query: string): User[] {
  const lowerQuery = query.toLowerCase();
  return demoUsers.filter(u =>
    u.name.toLowerCase().includes(lowerQuery) ||
    u.email.toLowerCase().includes(lowerQuery) ||
    u.role.toLowerCase().includes(lowerQuery)
  );
}

export function getNotificationsByCategory(category: string): Notification[] {
  return demoNotifications.filter(n => n.category === category);
}

export function getNotificationsByPriority(priority: Notification['priority']): Notification[] {
  return demoNotifications.filter(n => n.priority === priority);
}

