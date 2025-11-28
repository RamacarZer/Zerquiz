import { generateUUID } from '../lib/mockStorage';

// ==================== TİPLER ve ROL TANIMLARI ====================

export type UserRole = 
  | 'student'          // Öğrenci
  | 'teacher'          // Öğretmen
  | 'parent'           // Veli
  | 'author'           // İçerik Yazarı
  | 'editor'           // İçerik Editörü
  | 'department_head'  // Zümre Başkanı
  | 'personnel'        // Personel
  | 'admin'            // Yönetici
  | 'all';             // Herkes

export type EmailCategory = 
  | 'exam'           // Sınav
  | 'certificate'    // Sertifika
  | 'marketing'      // Pazarlama/Kampanya
  | 'announcement'   // Duyuru/Bilgilendirme
  | 'reminder'       // Hatırlatma
  | 'welcome'        // Hoşgeldin
  | 'course'         // Kurs/Ders
  | 'assignment'     // Ödev/Görev
  | 'license'        // Lisans
  | 'service'        // Hizmet
  | 'report'         // Rapor
  | 'meeting'        // Toplantı
  | 'payment'        // Ödeme
  | 'subscription';  // Abonelik

// ==================== VERİ MODELLERİ ====================

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: EmailCategory;
  targetRole: UserRole[];
  variables: TemplateVariable[];
  isActive: boolean;
  language: 'tr' | 'en';
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  preview?: string;
  tags?: string[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  category: EmailCategory;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  icon?: string;
  actionUrl?: string;
  actionText?: string;
  targetRole: UserRole[];
  variables: TemplateVariable[];
  channels: NotificationChannel[];
  isActive: boolean;
  createdAt: string;
  usageCount: number;
  tags?: string[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url';
  required: boolean;
  defaultValue?: string;
  example: string;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app' | 'whatsapp';

export interface AutomatedTrigger {
  id: string;
  name: string;
  description: string;
  event: TriggerEvent;
  templateId: string;
  templateType: 'email' | 'notification';
  conditions: TriggerCondition[];
  timing: TriggerTiming;
  isActive: boolean;
  createdAt: string;
  executionCount: number;
  lastExecutedAt?: string;
}

export type TriggerEvent = 
  | 'exam_created'
  | 'exam_started'
  | 'exam_completed'
  | 'exam_reminder_24h'
  | 'exam_reminder_1h'
  | 'grade_published'
  | 'certificate_issued'
  | 'course_enrolled'
  | 'assignment_due_soon'
  | 'assignment_submitted'
  | 'user_registered'
  | 'subscription_expiring'
  | 'license_expiring'
  | 'payment_received'
  | 'payment_failed'
  | 'meeting_scheduled'
  | 'content_approved'
  | 'content_rejected';

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface TriggerTiming {
  type: 'immediate' | 'delayed' | 'scheduled';
  delay?: number;
  delayUnit?: 'minutes' | 'hours' | 'days';
  scheduleTime?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  targetAudience: UserRole;
  customFilters?: CampaignFilter[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  createdAt: string;
  createdBy: string;
}

export interface CampaignFilter {
  field: string;
  operator: string;
  value: any;
}

// ==================== ŞABLON VERİLERİ - ÖĞRENCİLER İÇİN ====================

const studentTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-student-exam-reminder',
    name: '[Öğrenci] Sınav Hatırlatma',
    subject: '⏰ Yarın Sınavınız Var - {{examName}}',
    category: 'exam',
    targetRole: ['student'],
    tags: ['sınav', 'hatırlatma', 'öğrenci'],
    htmlContent: `<!-- Sınav hatırlatma içeriği -->`,
    textContent: 'Yarın sınavınız var...',
    variables: [
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 156,
  },
  {
    id: 'tmpl-student-assignment',
    name: '[Öğrenci] Ödev Hatırlatma',
    subject: '📚 Ödev Teslim Tarihi Yaklaşıyor - {{assignmentName}}',
    category: 'assignment',
    targetRole: ['student'],
    tags: ['ödev', 'görev', 'hatırlatma'],
    htmlContent: `<!-- Ödev hatırlatma -->`,
    textContent: 'Ödevinizin son teslim tarihi yaklaşıyor...',
    variables: [
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ayşe Demir' },
      { key: 'assignmentName', label: 'Ödev Adı', type: 'text', required: true, example: 'Matematik Ödevi' },
      { key: 'dueDate', label: 'Son Tarih', type: 'date', required: true, example: '20.06.2025' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 89,
  },
];

// ==================== VELİLER İÇİN ====================

const parentTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-parent-progress',
    name: '[Veli] Öğrenci İlerleme Raporu',
    subject: '📊 {{studentName}} - Aylık İlerleme Raporu',
    category: 'report',
    targetRole: ['parent'],
    tags: ['veli', 'rapor', 'ilerleme'],
    htmlContent: `<!DOCTYPE html>
<html>
<body>
  <h2>Sayın {{parentName}},</h2>
  <p>{{studentName}} öğrencimizin {{month}} ayı ilerleme raporu hazırlanmıştır.</p>
  <div>
    <h3>Genel Durum</h3>
    <p>Ortalama: {{average}}</p>
    <p>Devamsızlık: {{absenceCount}} gün</p>
    <p>Tamamlanan Sınav: {{examCount}}</p>
  </div>
</body>
</html>`,
    textContent: 'Öğrencinizin aylık raporu...',
    variables: [
      { key: 'parentName', label: 'Veli Adı', type: 'text', required: true, example: 'Fatma Yılmaz' },
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'month', label: 'Ay', type: 'text', required: true, example: 'Mayıs' },
      { key: 'average', label: 'Ortalama', type: 'number', required: true, example: '85' },
      { key: 'absenceCount', label: 'Devamsızlık', type: 'number', required: true, example: '2' },
      { key: 'examCount', label: 'Sınav Sayısı', type: 'number', required: true, example: '5' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 234,
  },
  {
    id: 'tmpl-parent-meeting',
    name: '[Veli] Veli Toplantısı Daveti',
    subject: '👨‍👩‍👧 Veli Toplantısı Daveti - {{meetingDate}}',
    category: 'meeting',
    targetRole: ['parent'],
    tags: ['veli', 'toplantı', 'davet'],
    htmlContent: `<!-- Toplantı daveti -->`,
    textContent: 'Veli toplantısına davetlisiniz...',
    variables: [
      { key: 'parentName', label: 'Veli Adı', type: 'text', required: true, example: 'Mehmet Kaya' },
      { key: 'meetingDate', label: 'Toplantı Tarihi', type: 'date', required: true, example: '15.06.2025' },
      { key: 'meetingTime', label: 'Saat', type: 'text', required: true, example: '14:00' },
      { key: 'meetingLocation', label: 'Yer', type: 'text', required: true, example: 'Okul Konferans Salonu' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 67,
  },
];

// ==================== ÖĞRETMENLER İÇİN ====================

const teacherTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-teacher-assignment',
    name: '[Öğretmen] Yeni Görev Atandı',
    subject: '📋 Size Yeni Görev Atandı - {{taskName}}',
    category: 'assignment',
    targetRole: ['teacher'],
    tags: ['öğretmen', 'görev', 'atama'],
    htmlContent: `<!-- Görev atama -->`,
    textContent: 'Size yeni görev atandı...',
    variables: [
      { key: 'teacherName', label: 'Öğretmen Adı', type: 'text', required: true, example: 'Ayşe Öğretmen' },
      { key: 'taskName', label: 'Görev Adı', type: 'text', required: true, example: 'Sınav Hazırlama' },
      { key: 'dueDate', label: 'Son Tarih', type: 'date', required: true, example: '25.06.2025' },
      { key: 'priority', label: 'Öncelik', type: 'text', required: true, example: 'Yüksek' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 123,
  },
  {
    id: 'tmpl-teacher-meeting',
    name: '[Öğretmen] Zümre Toplantısı',
    subject: '🏫 Zümre Toplantısı - {{meetingDate}}',
    category: 'meeting',
    targetRole: ['teacher', 'department_head'],
    tags: ['öğretmen', 'zümre', 'toplantı'],
    htmlContent: `<!-- Zümre toplantısı -->`,
    textContent: 'Zümre toplantısına davetlisiniz...',
    variables: [
      { key: 'teacherName', label: 'Öğretmen Adı', type: 'text', required: true, example: 'Mehmet Öğretmen' },
      { key: 'departmentName', label: 'Zümre', type: 'text', required: true, example: 'Matematik' },
      { key: 'meetingDate', label: 'Tarih', type: 'date', required: true, example: '18.06.2025' },
      { key: 'agenda', label: 'Gündem', type: 'text', required: true, example: 'Yıl sonu değerlendirmesi' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 45,
  },
];

// ==================== ZÜMRE BAŞKANI İÇİN ====================

const departmentHeadTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-dept-monthly-report',
    name: '[Zümre] Aylık Rapor Talebi',
    subject: '📊 Aylık Zümre Raporu Hazırlama - {{month}}',
    category: 'report',
    targetRole: ['department_head'],
    tags: ['zümre', 'rapor', 'yönetim'],
    htmlContent: `<!-- Rapor talebi -->`,
    textContent: 'Aylık zümre raporunu hazırlamanız bekleniyor...',
    variables: [
      { key: 'headName', label: 'Başkan Adı', type: 'text', required: true, example: 'Ali Başkan' },
      { key: 'departmentName', label: 'Zümre', type: 'text', required: true, example: 'Fen Bilgisi' },
      { key: 'month', label: 'Ay', type: 'text', required: true, example: 'Mayıs' },
      { key: 'dueDate', label: 'Son Tarih', type: 'date', required: true, example: '30.05.2025' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 34,
  },
];

// ==================== YAZAR & EDİTÖR İÇİN ====================

const contentCreatorTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-author-content-approved',
    name: '[Yazar] İçerik Onaylandı',
    subject: '✅ İçeriğiniz Onaylandı - {{contentTitle}}',
    category: 'announcement',
    targetRole: ['author'],
    tags: ['yazar', 'onay', 'içerik'],
    htmlContent: `<!-- İçerik onay -->`,
    textContent: 'İçeriğiniz onaylandı ve yayınlandı...',
    variables: [
      { key: 'authorName', label: 'Yazar Adı', type: 'text', required: true, example: 'Can Yazar' },
      { key: 'contentTitle', label: 'İçerik Başlığı', type: 'text', required: true, example: 'Matematik Soruları' },
      { key: 'publishDate', label: 'Yayın Tarihi', type: 'date', required: true, example: '20.06.2025' },
      { key: 'viewCount', label: 'Görüntülenme', type: 'number', required: true, example: '156' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 78,
  },
  {
    id: 'tmpl-editor-review-request',
    name: '[Editör] İçerik İnceleme Talebi',
    subject: '📝 Yeni İçerik İnceleme Talebi - {{contentTitle}}',
    category: 'assignment',
    targetRole: ['editor'],
    tags: ['editör', 'inceleme', 'görev'],
    htmlContent: `<!-- İnceleme talebi -->`,
    textContent: 'İncelemeniz için yeni içerik...',
    variables: [
      { key: 'editorName', label: 'Editör Adı', type: 'text', required: true, example: 'Elif Editör' },
      { key: 'contentTitle', label: 'İçerik', type: 'text', required: true, example: 'Fizik Soruları' },
      { key: 'authorName', label: 'Yazar', type: 'text', required: true, example: 'Can Yazar' },
      { key: 'dueDate', label: 'Son Tarih', type: 'date', required: true, example: '22.06.2025' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 92,
  },
];

// ==================== PERSONEL İÇİN ====================

const personnelTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-personnel-task',
    name: '[Personel] Görev Bildirimi',
    subject: '📋 Yeni Görev - {{taskTitle}}',
    category: 'assignment',
    targetRole: ['personnel'],
    tags: ['personel', 'görev', 'bildirim'],
    htmlContent: `<!-- Görev bildirimi -->`,
    textContent: 'Size yeni görev atandı...',
    variables: [
      { key: 'personnelName', label: 'Personel Adı', type: 'text', required: true, example: 'Zeynep Personel' },
      { key: 'taskTitle', label: 'Görev', type: 'text', required: true, example: 'Sınav Salonu Hazırlama' },
      { key: 'location', label: 'Konum', type: 'text', required: true, example: 'A Blok Salon 3' },
      { key: 'dueDate', label: 'Tarih', type: 'date', required: true, example: '19.06.2025' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 56,
  },
];

// ==================== LİSANS & HİZMET ====================

const serviceTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-license-expiring',
    name: '[Lisans] Lisans Süresi Doluyor',
    subject: '⚠️ Lisansınız 30 Gün İçinde Dolacak',
    category: 'license',
    targetRole: ['admin'],
    tags: ['lisans', 'süre', 'uyarı'],
    htmlContent: `<!-- Lisans uyarısı -->`,
    textContent: 'Lisansınızın süresi doluyor...',
    variables: [
      { key: 'companyName', label: 'Kurum', type: 'text', required: true, example: 'ABC Okulu' },
      { key: 'licenseType', label: 'Lisans Tipi', type: 'text', required: true, example: 'Kurumsal' },
      { key: 'expiryDate', label: 'Son Tarih', type: 'date', required: true, example: '15.07.2025' },
      { key: 'renewUrl', label: 'Yenileme Linki', type: 'url', required: true, example: 'https://zerquiz.com/renew' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 23,
  },
  {
    id: 'tmpl-service-maintenance',
    name: '[Hizmet] Bakım Bildirimi',
    subject: '🔧 Planlı Sistem Bakımı - {{maintenanceDate}}',
    category: 'service',
    targetRole: ['all'],
    tags: ['hizmet', 'bakım', 'bilgilendirme'],
    htmlContent: `<!-- Bakım bildirimi -->`,
    textContent: 'Planlı sistem bakımı yapılacaktır...',
    variables: [
      { key: 'maintenanceDate', label: 'Bakım Tarihi', type: 'date', required: true, example: '25.06.2025' },
      { key: 'startTime', label: 'Başlangıç', type: 'text', required: true, example: '02:00' },
      { key: 'endTime', label: 'Bitiş', type: 'text', required: true, example: '04:00' },
      { key: 'affectedServices', label: 'Etkilenen Hizmetler', type: 'text', required: true, example: 'Tüm sistem' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 12,
  },
];

// ==================== KAMPANYA ====================

const campaignTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-campaign-discount',
    name: '[Kampanya] İndirim Kampanyası',
    subject: '🎉 {{discountPercent}}% İndirim Fırsatı!',
    category: 'marketing',
    targetRole: ['all'],
    tags: ['kampanya', 'indirim', 'pazarlama'],
    htmlContent: `<!-- İndirim kampanyası -->`,
    textContent: 'Özel indirim fırsatını kaçırmayın...',
    variables: [
      { key: 'recipientName', label: 'Alıcı Adı', type: 'text', required: true, example: 'Değerli Müşterimiz' },
      { key: 'discountPercent', label: 'İndirim Oranı', type: 'number', required: true, example: '30' },
      { key: 'campaignName', label: 'Kampanya Adı', type: 'text', required: true, example: 'Yaz İndirimi' },
      { key: 'validUntil', label: 'Son Geçerlilik', type: 'date', required: true, example: '30.06.2025' },
      { key: 'couponCode', label: 'Kupon Kodu', type: 'text', required: true, example: 'YAZ2025' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 456,
  },
];

// ==================== TÜM ŞABLONLARI BİRLEŞTİR ====================

export const emailTemplates: EmailTemplate[] = [
  ...studentTemplates,
  ...parentTemplates,
  ...teacherTemplates,
  ...departmentHeadTemplates,
  ...contentCreatorTemplates,
  ...personnelTemplates,
  ...serviceTemplates,
  ...campaignTemplates,
];

// ==================== BİLDİRİM ŞABLONLARI ====================

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'ntf-exam-reminder-1h',
    name: 'Sınav Hatırlatma - 1 Saat Önce',
    title: '⏰ Sınavınız 1 Saat Sonra!',
    message: '{{examName}} sınavınız {{examTime}} saatinde başlayacak.',
    category: 'exam',
    priority: 'high',
    icon: '⏰',
    actionUrl: '/exams/{{examId}}/session',
    actionText: 'Sınava Git',
    targetRole: ['student'],
    tags: ['sınav', 'hatırlatma'],
    variables: [
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
      { key: 'examTime', label: 'Saat', type: 'text', required: true, example: '10:00' },
      { key: 'examId', label: 'Sınav ID', type: 'text', required: true, example: 'exam-123' },
    ],
    channels: ['in-app', 'push', 'email'],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 2341,
  },
  {
    id: 'ntf-content-approved',
    name: '[Yazar] İçerik Onaylandı',
    title: '✅ İçeriğiniz Onaylandı!',
    message: '{{contentTitle}} içeriğiniz editör tarafından onaylandı ve yayınlandı.',
    category: 'announcement',
    priority: 'normal',
    icon: '✅',
    actionUrl: '/content/{{contentId}}',
    actionText: 'İçeriği Görüntüle',
    targetRole: ['author'],
    tags: ['yazar', 'onay'],
    variables: [
      { key: 'contentTitle', label: 'İçerik', type: 'text', required: true, example: 'Matematik Soruları' },
      { key: 'contentId', label: 'ID', type: 'text', required: true, example: 'content-123' },
    ],
    channels: ['in-app', 'push'],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 156,
  },
];

// ==================== OTOMATİK TETİKLEYİCİLER ====================

export const automatedTriggers: AutomatedTrigger[] = [
  {
    id: 'trigger-exam-reminder-24h',
    name: 'Sınav Hatırlatma - 24 Saat Önce',
    description: 'Sınavdan 24 saat önce öğrencilere e-posta gönderir',
    event: 'exam_reminder_24h',
    templateId: 'tmpl-student-exam-reminder',
    templateType: 'email',
    conditions: [
      { field: 'exam.status', operator: 'equals', value: 'scheduled' },
    ],
    timing: { type: 'scheduled', delay: 24, delayUnit: 'hours' },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 2341,
    lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trigger-assignment-reminder',
    name: 'Ödev Hatırlatma - 48 Saat Önce',
    description: 'Ödev teslim tarihinden 48 saat önce hatırlatır',
    event: 'assignment_due_soon',
    templateId: 'tmpl-student-assignment',
    templateType: 'email',
    conditions: [
      { field: 'assignment.status', operator: 'equals', value: 'active' },
    ],
    timing: { type: 'scheduled', delay: 48, delayUnit: 'hours' },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 567,
  },
  {
    id: 'trigger-license-expiring',
    name: 'Lisans Süre Sonu - 30 Gün Önce',
    description: 'Lisans bitiminden 30 gün önce uyarır',
    event: 'license_expiring',
    templateId: 'tmpl-license-expiring',
    templateType: 'email',
    conditions: [
      { field: 'license.isActive', operator: 'equals', value: true },
    ],
    timing: { type: 'scheduled', delay: 30, delayUnit: 'days' },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 23,
  },
  {
    id: 'trigger-content-approved',
    name: 'İçerik Onaylandığında',
    description: 'İçerik onaylanınca yazara bildirim gönderir',
    event: 'content_approved',
    templateId: 'ntf-content-approved',
    templateType: 'notification',
    conditions: [
      { field: 'content.status', operator: 'equals', value: 'approved' },
    ],
    timing: { type: 'immediate' },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 156,
  },
];

// ==================== KAMPANYALAR ====================

export const emailCampaigns: EmailCampaign[] = [
  {
    id: 'camp-summer-discount',
    name: 'Yaz İndirimi Kampanyası 2025',
    description: 'Tüm kullanıcılara %30 indirim',
    templateId: 'tmpl-campaign-discount',
    targetAudience: 'all',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 5420,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'Marketing Team',
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getTemplatesByRole(role: UserRole): EmailTemplate[] {
  return emailTemplates.filter(t => 
    t.targetRole.includes(role) || t.targetRole.includes('all')
  );
}

export function getTemplatesByCategory(category: EmailCategory): EmailTemplate[] {
  return emailTemplates.filter(t => t.category === category && t.isActive);
}

export function getTemplateById(id: string): EmailTemplate | NotificationTemplate | undefined {
  const emailTemplate = emailTemplates.find(t => t.id === id);
  if (emailTemplate) return emailTemplate;
  return notificationTemplates.find(t => t.id === id);
}

export function renderTemplate(template: EmailTemplate | NotificationTemplate, variables: Record<string, any>): string {
  let content = 'htmlContent' in template ? template.htmlContent : template.message;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, String(value));
  });
  
  return content;
}

export function getActiveTemplates(): EmailTemplate[] {
  return emailTemplates.filter(t => t.isActive);
}

export function getTemplatesByTag(tag: string): EmailTemplate[] {
  return emailTemplates.filter(t => t.tags?.includes(tag));
}

export function calculateCampaignStats(campaign: EmailCampaign) {
  const openRate = campaign.recipientCount > 0 
    ? (campaign.openCount / campaign.recipientCount) * 100 
    : 0;
  const clickRate = campaign.openCount > 0 
    ? (campaign.clickCount / campaign.openCount) * 100 
    : 0;
  const bounceRate = campaign.recipientCount > 0 
    ? (campaign.bounceCount / campaign.recipientCount) * 100 
    : 0;

  return {
    openRate: openRate.toFixed(2),
    clickRate: clickRate.toFixed(2),
    bounceRate: bounceRate.toFixed(2),
  };
}

