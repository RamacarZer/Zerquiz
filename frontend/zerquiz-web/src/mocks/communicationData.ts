import { generateUUID } from '../lib/mockStorage';

// ==================== İLETİŞİM VERİLERİ ====================

export interface Message {
  id: string;
  threadId: string;
  sender: User;
  recipients: User[];
  subject: string;
  content: string;
  isRead: boolean;
  hasAttachments: boolean;
  attachments: Attachment[];
  sentAt: string;
  readAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  labels: string[];
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: User[];
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'exam' | 'grade' | 'certificate' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  targetAudience: 'all' | 'students' | 'teachers' | 'admins';
  priority: 'low' | 'normal' | 'high';
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  views: number;
}

// ==================== DEMO KULLANICILAR ====================

const demoUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin Kullanıcı',
    email: 'admin@zerquiz.com',
    role: 'Admin',
  },
  {
    id: 'u2',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'Öğretmen',
  },
  {
    id: 'u3',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    role: 'Öğrenci',
  },
  {
    id: 'u4',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    role: 'Öğretmen',
  },
];

// ==================== DEMO MESAJLAR ====================

export const demoMessages: Message[] = [
  {
    id: generateUUID(),
    threadId: 'thread-1',
    sender: demoUsers[1],
    recipients: [demoUsers[0]],
    subject: 'Sınav Sonuçları Hakkında',
    content: 'Merhaba, geçen hafta yapılan matematik sınavının sonuçları ne zaman açıklanacak?',
    isRead: false,
    hasAttachments: false,
    attachments: [],
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: 'normal',
    labels: ['sınav', 'matematik'],
  },
  {
    id: generateUUID(),
    threadId: 'thread-2',
    sender: demoUsers[2],
    recipients: [demoUsers[1]],
    subject: 'Ödev Teslimi',
    content: 'Hocam, ödevi sisteme yükledim ama onaylanmadı. Kontrol edebilir misiniz?',
    isRead: true,
    hasAttachments: true,
    attachments: [
      {
        id: 'a1',
        name: 'odev.pdf',
        url: '/files/odev.pdf',
        size: 1500000,
        type: 'application/pdf',
      },
    ],
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    labels: ['ödev'],
  },
  {
    id: generateUUID(),
    threadId: 'thread-3',
    sender: demoUsers[0],
    recipients: [demoUsers[1], demoUsers[3]],
    subject: 'Yeni Sistem Güncellemesi',
    content: 'Sevgili öğretmenler, sistemimize yeni özellikler eklendi. Lütfen duyuruları kontrol edin.',
    isRead: true,
    hasAttachments: false,
    attachments: [],
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    priority: 'urgent',
    labels: ['sistem', 'duyuru'],
  },
];

// ==================== BİLDİRİMLER ====================

export const demoNotifications: Notification[] = [
  {
    id: generateUUID(),
    type: 'message',
    title: 'Yeni Mesaj',
    message: 'Ahmet Yılmaz size bir mesaj gönderdi',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/messages',
  },
  {
    id: generateUUID(),
    type: 'exam',
    title: 'Sınav Hatırlatması',
    message: 'Matematik Final Sınavı yarın başlıyor',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/exams',
  },
  {
    id: generateUUID(),
    type: 'grade',
    title: 'Notlar Açıklandı',
    message: 'Fen Bilgisi Ara Sınavı notlarınız açıklandı',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/grades',
  },
  {
    id: generateUUID(),
    type: 'certificate',
    title: 'Sertifika Hazır',
    message: 'Başarı sertifikanız oluşturuldu',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/certificates',
  },
  {
    id: generateUUID(),
    type: 'system',
    title: 'Sistem Bakımı',
    message: 'Yarın gece 02:00-04:00 arası sistem bakımı yapılacaktır',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== DUYURULAR ====================

export const demoAnnouncements: Announcement[] = [
  {
    id: generateUUID(),
    title: 'Yeni Özellikler Eklendi! 🎉',
    content: `Sevgili kullanıcılar,

Platformumuza heyecan verici yeni özellikler ekledik:
- 📊 Gelişmiş soru editörü (65 soru tipi)
- 🎯 Akıllı sınav oluşturucu
- 📈 Detaylı analiz raporları
- 🏆 Sertifika sistemi

İyi çalışmalar!`,
    author: demoUsers[0],
    targetAudience: 'all',
    priority: 'high',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    views: 156,
  },
  {
    id: generateUUID(),
    title: 'Yaz Dönemi Sınav Takvimi',
    content: `Değerli öğrenciler,

Yaz dönemi final sınavları 15 Haziran'da başlayacaktır.
Sınav programını kontrol panelinden inceleyebilirsiniz.

Başarılar dileriz!`,
    author: demoUsers[1],
    targetAudience: 'students',
    priority: 'normal',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    views: 89,
  },
  {
    id: generateUUID(),
    title: 'Öğretmenler İçin Eğitim Semineri',
    content: `Sayın öğretmenler,

Platform kullanımı ve yeni özellikler hakkında online eğitim semineri düzenlenecektir.
Tarih: 20 Mayıs 2025, Saat: 14:00

Katılım linki: zoom.us/j/123456789`,
    author: demoUsers[0],
    targetAudience: 'teachers',
    priority: 'normal',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    views: 34,
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getUnreadMessagesCount(): number {
  return demoMessages.filter(m => !m.isRead).length;
}

export function getUnreadNotificationsCount(): number {
  return demoNotifications.filter(n => !n.isRead).length;
}

export function getMessagesByLabel(label: string): Message[] {
  return demoMessages.filter(m => m.labels.includes(label));
}

export function getPinnedAnnouncements(): Announcement[] {
  return demoAnnouncements.filter(a => a.isPinned);
}

export function getAnnouncementsByAudience(audience: Announcement['targetAudience']): Announcement[] {
  return demoAnnouncements.filter(a => a.targetAudience === audience || a.targetAudience === 'all');
}

