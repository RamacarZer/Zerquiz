import { generateUUID } from '../lib/mockStorage';

// ==================== MAİL & BİLDİRİM ŞABLONLARI ====================

export type UserRole = 
  | 'student'      // Öğrenci
  | 'teacher'      // Öğretmen
  | 'parent'       // Veli
  | 'author'       // İçerik Yazarı
  | 'editor'       // İçerik Editörü
  | 'department_head'  // Zümre Başkanı
  | 'personnel'    // Personel
  | 'admin'        // Yönetici
  | 'all';         // Herkes

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
  category: 'exam' | 'certificate' | 'marketing' | 'announcement' | 'reminder' | 'grade' | 'assignment';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  icon?: string;
  actionUrl?: string;
  actionText?: string;
  variables: TemplateVariable[];
  channels: NotificationChannel[];
  isActive: boolean;
  createdAt: string;
  usageCount: number;
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
  | 'user_registered'
  | 'subscription_expiring';

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface TriggerTiming {
  type: 'immediate' | 'delayed' | 'scheduled';
  delay?: number; // minutes
  delayUnit?: 'minutes' | 'hours' | 'days';
  scheduleTime?: string; // HH:mm
}

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'custom';
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

// ==================== E-POSTA ŞABLONLARI ====================

export const emailTemplates: EmailTemplate[] = [
  // Sınav Öncesi
  {
    id: 'tmpl-exam-reminder-24h',
    name: 'Sınav Hatırlatma - 24 Saat Önce',
    subject: '⏰ Yarın Sınavınız Var - {{examName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .exam-info { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Sınav Hatırlatması</h1>
    </div>
    <div class="content">
      <p>Merhaba <strong>{{studentName}}</strong>,</p>
      <p>Yarın sınavınız bulunmaktadır. Hazırlıklarınızı tamamlamanızı hatırlatmak isteriz.</p>
      
      <div class="exam-info">
        <h3>📝 {{examName}}</h3>
        <p><strong>📅 Tarih:</strong> {{examDate}}</p>
        <p><strong>🕐 Saat:</strong> {{examTime}}</p>
        <p><strong>⏱️ Süre:</strong> {{examDuration}} dakika</p>
        <p><strong>📊 Soru Sayısı:</strong> {{questionCount}} soru</p>
      </div>
      
      <p><strong>Dikkat Edilmesi Gerekenler:</strong></p>
      <ul>
        <li>Sınav saatinden 15 dakika önce sisteme giriş yapın</li>
        <li>İnternet bağlantınızı kontrol edin</li>
        <li>Kimlik belgelerinizi hazırlayın</li>
        <li>Geç kalma toleransı 15 dakikadır</li>
      </ul>
      
      <center>
        <a href="{{examUrl}}" class="button">Sınava Git</a>
      </center>
      
      <p>Başarılar dileriz! 🎓</p>
    </div>
    <div class="footer">
      <p>Bu e-posta Zerquiz platformu tarafından otomatik olarak gönderilmiştir.</p>
      <p>© 2025 Zerquiz. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `,
    textContent: `Merhaba {{studentName}},\n\nYarın {{examName}} sınavınız bulunmaktadır.\n\nTarih: {{examDate}}\nSaat: {{examTime}}\nSüre: {{examDuration}} dakika\n\nBaşarılar dileriz!\n\nZerquiz`,
    category: 'exam',
    variables: [
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
      { key: 'examDate', label: 'Sınav Tarihi', type: 'date', required: true, example: '15.06.2025' },
      { key: 'examTime', label: 'Sınav Saati', type: 'text', required: true, example: '10:00' },
      { key: 'examDuration', label: 'Süre (dk)', type: 'number', required: true, example: '90' },
      { key: 'questionCount', label: 'Soru Sayısı', type: 'number', required: true, example: '50' },
      { key: 'examUrl', label: 'Sınav Linki', type: 'url', required: true, example: 'https://zerquiz.com/exam/123' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 156,
  },

  // Sınav Sonrası - Sonuçlar
  {
    id: 'tmpl-exam-results',
    name: 'Sınav Sonuçları Açıklandı',
    subject: '📊 Sınav Sonuçlarınız Açıklandı - {{examName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .result-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0; }
    .score { font-size: 48px; font-weight: bold; margin: 10px 0; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; text-align: center; }
    .stat { background-color: #f8f9fa; padding: 15px; border-radius: 8px; flex: 1; margin: 0 5px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Sınav Sonuçlarınız Hazır!</h1>
    </div>
    <div class="content">
      <p>Merhaba <strong>{{studentName}}</strong>,</p>
      <p><strong>{{examName}}</strong> sınavının sonuçları açıklandı.</p>
      
      <div class="result-card">
        <h2>Notunuz</h2>
        <div class="score">{{score}}</div>
        <p style="font-size: 18px; margin: 0;">{{grade}}</p>
      </div>
      
      <div class="stats">
        <div class="stat">
          <h4 style="color: #667eea; margin: 0;">Doğru</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #28a745;">{{correctCount}}</p>
        </div>
        <div class="stat">
          <h4 style="color: #667eea; margin: 0;">Yanlış</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #dc3545;">{{wrongCount}}</p>
        </div>
        <div class="stat">
          <h4 style="color: #667eea; margin: 0;">Boş</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #ffc107;">{{emptyCount}}</p>
        </div>
      </div>
      
      <p><strong>📈 Sınıf Ortalaması:</strong> {{classAverage}}</p>
      <p><strong>🏆 Sınıf Sıralaması:</strong> {{rank}} / {{totalStudents}}</p>
      
      <center>
        <a href="{{resultUrl}}" class="button">Detaylı Sonuçları Gör</a>
      </center>
      
      <p>Tebrikler! 🎓</p>
    </div>
    <div class="footer">
      <p>Bu e-posta Zerquiz platformu tarafından otomatik olarak gönderilmiştir.</p>
      <p>© 2025 Zerquiz. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `,
    textContent: `Merhaba {{studentName}},\n\n{{examName}} sınavı sonuçlarınız açıklandı.\n\nNotunuz: {{score}} ({{grade}})\nDoğru: {{correctCount}}\nYanlış: {{wrongCount}}\nBoş: {{emptyCount}}\n\nSınıf Ortalaması: {{classAverage}}\nSıralamanız: {{rank}}/{{totalStudents}}\n\nDetaylar için: {{resultUrl}}\n\nZerquiz`,
    category: 'exam',
    variables: [
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
      { key: 'score', label: 'Puan', type: 'number', required: true, example: '85' },
      { key: 'grade', label: 'Harf Notu', type: 'text', required: true, example: 'B+' },
      { key: 'correctCount', label: 'Doğru Sayısı', type: 'number', required: true, example: '42' },
      { key: 'wrongCount', label: 'Yanlış Sayısı', type: 'number', required: true, example: '6' },
      { key: 'emptyCount', label: 'Boş Sayısı', type: 'number', required: true, example: '2' },
      { key: 'classAverage', label: 'Sınıf Ortalaması', type: 'number', required: true, example: '78.5' },
      { key: 'rank', label: 'Sıralama', type: 'number', required: true, example: '3' },
      { key: 'totalStudents', label: 'Toplam Öğrenci', type: 'number', required: true, example: '25' },
      { key: 'resultUrl', label: 'Sonuç Linki', type: 'url', required: true, example: 'https://zerquiz.com/results/123' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 234,
  },

  // Sertifika
  {
    id: 'tmpl-certificate-issued',
    name: 'Sertifika Hazır',
    subject: '🎓 Tebrikler! Sertifikanız Hazır - {{certificateName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .certificate-preview { background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border: 3px solid #d63031; border-radius: 10px; padding: 40px; text-align: center; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background-color: #d63031; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .share-buttons { text-align: center; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Tebrikler!</h1>
      <p style="font-size: 18px;">Sertifikanız Hazır</p>
    </div>
    <div class="content">
      <p>Sayın <strong>{{studentName}}</strong>,</p>
      <p>Başarıyla tamamladığınız <strong>{{courseName}}</strong> eğitimi için sertifikanız oluşturuldu!</p>
      
      <div class="certificate-preview">
        <h2 style="color: #d63031; margin: 0;">🏆 BAŞARI SERTİFİKASI</h2>
        <h3 style="margin: 20px 0;">{{certificateName}}</h3>
        <p style="font-size: 16px;">Sertifika No: <strong>{{certificateNumber}}</strong></p>
        <p style="font-size: 14px; color: #636e72;">Tarih: {{issueDate}}</p>
      </div>
      
      <p><strong>📊 Başarı Detayları:</strong></p>
      <ul>
        <li>Toplam Puan: <strong>{{totalScore}}</strong></li>
        <li>Başarı Oranı: <strong>{{successRate}}%</strong></li>
        <li>Tamamlama Tarihi: <strong>{{completionDate}}</strong></li>
      </ul>
      
      <div class="share-buttons">
        <a href="{{downloadUrl}}" class="button">📥 Sertifikayı İndir (PDF)</a>
        <a href="{{verifyUrl}}" class="button" style="background-color: #0984e3;">🔍 Doğrula</a>
      </div>
      
      <p style="text-align: center; color: #636e72; font-size: 14px;">
        <strong>Sertifikanızı Paylaşın:</strong><br>
        LinkedIn • Facebook • Twitter
      </p>
      
      <p>Başarılarınızın devamını dileriz! 🎓</p>
    </div>
    <div class="footer">
      <p>Bu e-posta Zerquiz platformu tarafından otomatik olarak gönderilmiştir.</p>
      <p>© 2025 Zerquiz. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `,
    textContent: `Tebrikler {{studentName}}!\n\n{{courseName}} eğitimi için sertifikanız hazır.\n\nSertifika No: {{certificateNumber}}\nToplam Puan: {{totalScore}}\nBaşarı Oranı: {{successRate}}%\n\nİndirmek için: {{downloadUrl}}\n\nZerquiz`,
    category: 'certificate',
    variables: [
      { key: 'studentName', label: 'Öğrenci Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'courseName', label: 'Kurs Adı', type: 'text', required: true, example: 'İleri Matematik' },
      { key: 'certificateName', label: 'Sertifika Adı', type: 'text', required: true, example: 'Başarı Sertifikası' },
      { key: 'certificateNumber', label: 'Sertifika No', type: 'text', required: true, example: 'CERT-2025-001234' },
      { key: 'issueDate', label: 'Düzenlenme Tarihi', type: 'date', required: true, example: '15.06.2025' },
      { key: 'totalScore', label: 'Toplam Puan', type: 'number', required: true, example: '95' },
      { key: 'successRate', label: 'Başarı Oranı', type: 'number', required: true, example: '95' },
      { key: 'completionDate', label: 'Tamamlama Tarihi', type: 'date', required: true, example: '14.06.2025' },
      { key: 'downloadUrl', label: 'İndirme Linki', type: 'url', required: true, example: 'https://zerquiz.com/cert/download/123' },
      { key: 'verifyUrl', label: 'Doğrulama Linki', type: 'url', required: true, example: 'https://zerquiz.com/cert/verify/123' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 89,
  },

  // Marketing - Yeni Özellikler
  {
    id: 'tmpl-marketing-features',
    name: 'Pazarlama - Yeni Özellikler',
    subject: '🚀 Heyecan Verici Yenilikler - Zerquiz Platformu',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 30px; }
    .feature { display: flex; align-items: start; margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
    .feature-icon { font-size: 36px; margin-right: 15px; }
    .button { display: inline-block; padding: 15px 40px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Yeni Özellikler</h1>
      <p style="font-size: 18px;">Platformumuzu Geliştirmeye Devam Ediyoruz!</p>
    </div>
    <div class="content">
      <p>Merhaba <strong>{{recipientName}}</strong>,</p>
      <p>Zerquiz platformuna eklediğimiz heyecan verici yeni özellikleri sizlerle paylaşmaktan mutluluk duyuyoruz!</p>
      
      <div class="feature">
        <div class="feature-icon">📊</div>
        <div>
          <h3 style="margin: 0 0 10px 0;">Gelişmiş Soru Editörü</h3>
          <p style="margin: 0; color: #636e72;">65 farklı soru tipi ile zengin içerik oluşturun. Video, ses, görsel desteği!</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🎯</div>
        <div>
          <h3 style="margin: 0 0 10px 0;">Akıllı Sınav Sistemi</h3>
          <p style="margin: 0; color: #636e72;">Otomatik değerlendirme, detaylı analiz ve yapay zeka destekli raporlama.</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🏆</div>
        <div>
          <h3 style="margin: 0 0 10px 0;">Dijital Sertifikalar</h3>
          <p style="margin: 0; color: #636e72;">QR kodlu, doğrulanabilir sertifikalar. LinkedIn entegrasyonu!</p>
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-icon">💬</div>
        <div>
          <h3 style="margin: 0 0 10px 0;">Gelişmiş İletişim</h3>
          <p style="margin: 0; color: #636e72;">Slack benzeri mesajlaşma, dosya paylaşımı ve grup sohbetleri.</p>
        </div>
      </div>
      
      <center>
        <a href="{{platformUrl}}" class="button">Platformu Keşfet</a>
      </center>
      
      <p style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
        <strong>💡 İpucu:</strong> Yeni özellikleri denemek için ücretsiz deneme hesabınız devam ediyor!
      </p>
    </div>
    <div class="footer">
      <p>Bu e-postayı almak istemiyorsanız <a href="{{unsubscribeUrl}}">abonelikten çıkabilirsiniz</a>.</p>
      <p>© 2025 Zerquiz. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `,
    textContent: `Merhaba {{recipientName}},\n\nZerquiz platformuna yeni özellikler eklendi!\n\n- Gelişmiş Soru Editörü (65 soru tipi)\n- Akıllı Sınav Sistemi\n- Dijital Sertifikalar\n- Gelişmiş İletişim\n\nKeşfetmek için: {{platformUrl}}\n\nZerquiz`,
    category: 'marketing',
    variables: [
      { key: 'recipientName', label: 'Alıcı Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'platformUrl', label: 'Platform URL', type: 'url', required: true, example: 'https://zerquiz.com' },
      { key: 'unsubscribeUrl', label: 'Abonelik İptal URL', type: 'url', required: true, example: 'https://zerquiz.com/unsubscribe' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 1250,
  },

  // Hoşgeldin
  {
    id: 'tmpl-welcome',
    name: 'Hoşgeldin E-postası',
    subject: '🎉 Hoş Geldiniz - Zerquiz Platformuna Katıldınız!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 30px; }
    .steps { margin: 30px 0; }
    .step { display: flex; margin: 20px 0; }
    .step-number { width: 40px; height: 40px; background-color: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; margin-right: 15px; }
    .button { display: inline-block; padding: 15px 40px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Hoş Geldiniz!</h1>
      <p style="font-size: 18px;">Zerquiz Ailesine Katıldığınız İçin Teşekkürler</p>
    </div>
    <div class="content">
      <p>Merhaba <strong>{{userName}}</strong>,</p>
      <p>Zerquiz platformuna hoş geldiniz! Hesabınız başarıyla oluşturuldu ve artık eğitim dünyasının kapılarını aralayabilirsiniz.</p>
      
      <div class="steps">
        <h3>🚀 Başlamak İçin:</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div>
            <h4 style="margin: 0 0 5px 0;">Profilinizi Tamamlayın</h4>
            <p style="margin: 0; color: #636e72;">Fotoğraf ve bilgilerinizi ekleyin</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div>
            <h4 style="margin: 0 0 5px 0;">İlk Sınavınızı Oluşturun</h4>
            <p style="margin: 0; color: #636e72;">Soru bankasından yararlanın</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div>
            <h4 style="margin: 0 0 5px 0;">Öğrencilerinizi Davet Edin</h4>
            <p style="margin: 0; color: #636e72;">Toplu davet ile kolayca ekleyin</p>
          </div>
        </div>
      </div>
      
      <center>
        <a href="{{dashboardUrl}}" class="button">Dashboard'a Git</a>
      </center>
      
      <p style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
        <strong>💡 İpucu:</strong> İlk 30 gün ücretsiz deneme hakkınız var. Tüm özellikleri keşfedin!
      </p>
      
      <p><strong>Yardıma mı ihtiyacınız var?</strong></p>
      <p>Dokümantasyon • Video Rehberler • Canlı Destek</p>
    </div>
    <div class="footer">
      <p>© 2025 Zerquiz. Tüm hakları saklıdır.</p>
      <p>Destek: support@zerquiz.com</p>
    </div>
  </div>
</body>
</html>
    `,
    textContent: `Hoş Geldiniz {{userName}}!\n\nZerquiz platformuna katıldığınız için teşekkürler.\n\nBaşlamak için:\n1. Profilinizi tamamlayın\n2. İlk sınavınızı oluşturun\n3. Öğrencilerinizi davet edin\n\nDashboard: {{dashboardUrl}}\n\nZerquiz`,
    category: 'welcome',
    variables: [
      { key: 'userName', label: 'Kullanıcı Adı', type: 'text', required: true, example: 'Ahmet Yılmaz' },
      { key: 'dashboardUrl', label: 'Dashboard URL', type: 'url', required: true, example: 'https://zerquiz.com/dashboard' },
    ],
    isActive: true,
    language: 'tr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 567,
  },
];

// ==================== BİLDİRİM ŞABLONLARI ====================

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'ntf-exam-reminder-1h',
    name: 'Sınav Hatırlatma - 1 Saat Önce',
    title: '⏰ Sınavınız 1 Saat Sonra Başlıyor!',
    message: '{{examName}} sınavınız {{examTime}} saatinde başlayacak. Hazır olun!',
    category: 'exam',
    priority: 'high',
    icon: '⏰',
    actionUrl: '/exams/{{examId}}/session',
    actionText: 'Sınava Git',
    variables: [
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
      { key: 'examTime', label: 'Sınav Saati', type: 'text', required: true, example: '10:00' },
      { key: 'examId', label: 'Sınav ID', type: 'text', required: true, example: 'exam-123' },
    ],
    channels: ['in-app', 'push', 'email'],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 2341,
  },
  {
    id: 'ntf-grade-published',
    name: 'Notlar Açıklandı',
    title: '📊 Sınav Notlarınız Açıklandı',
    message: '{{examName}} sınavı sonuçlarınız yayınlandı. Notunuz: {{score}}',
    category: 'grade',
    priority: 'normal',
    icon: '📊',
    actionUrl: '/exams/{{examId}}/grading',
    actionText: 'Sonuçları Gör',
    variables: [
      { key: 'examName', label: 'Sınav Adı', type: 'text', required: true, example: 'Matematik Final' },
      { key: 'score', label: 'Puan', type: 'number', required: true, example: '85' },
      { key: 'examId', label: 'Sınav ID', type: 'text', required: true, example: 'exam-123' },
    ],
    channels: ['in-app', 'push', 'email'],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 1876,
  },
  {
    id: 'ntf-certificate-ready',
    name: 'Sertifika Hazır',
    title: '🎓 Sertifikanız Hazır!',
    message: '{{courseName}} kursu için başarı sertifikanız oluşturuldu.',
    category: 'certificate',
    priority: 'normal',
    icon: '🎓',
    actionUrl: '/certificates',
    actionText: 'Sertifikayı Gör',
    variables: [
      { key: 'courseName', label: 'Kurs Adı', type: 'text', required: true, example: 'İleri Matematik' },
    ],
    channels: ['in-app', 'push', 'email'],
    isActive: true,
    createdAt: new Date().toISOString(),
    usageCount: 456,
  },
];

// ==================== OTOMATİK TETİKLEYİCİLER ====================

export const automatedTriggers: AutomatedTrigger[] = [
  {
    id: 'trigger-exam-reminder-24h',
    name: 'Sınav Hatırlatma - 24 Saat Önce',
    description: 'Sınavdan 24 saat önce öğrencilere e-posta gönderir',
    event: 'exam_reminder_24h',
    templateId: 'tmpl-exam-reminder-24h',
    templateType: 'email',
    conditions: [
      { field: 'exam.status', operator: 'equals', value: 'scheduled' },
      { field: 'student.isActive', operator: 'equals', value: true },
    ],
    timing: {
      type: 'scheduled',
      delay: 24,
      delayUnit: 'hours',
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 2341,
    lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trigger-exam-reminder-1h',
    name: 'Sınav Hatırlatma - 1 Saat Önce',
    description: 'Sınavdan 1 saat önce öğrencilere bildirim gönderir',
    event: 'exam_reminder_1h',
    templateId: 'ntf-exam-reminder-1h',
    templateType: 'notification',
    conditions: [
      { field: 'exam.status', operator: 'equals', value: 'scheduled' },
    ],
    timing: {
      type: 'scheduled',
      delay: 1,
      delayUnit: 'hours',
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 2341,
    lastExecutedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'trigger-grade-published',
    name: 'Notlar Açıklandığında',
    description: 'Sınav notları yayınlandığında öğrencilere bildirir',
    event: 'grade_published',
    templateId: 'tmpl-exam-results',
    templateType: 'email',
    conditions: [
      { field: 'exam.status', operator: 'equals', value: 'graded' },
      { field: 'student.notifications', operator: 'equals', value: true },
    ],
    timing: {
      type: 'immediate',
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 1876,
    lastExecutedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trigger-certificate-issued',
    name: 'Sertifika Düzenlendiğinde',
    description: 'Sertifika oluşturulduğunda öğrenciye gönderir',
    event: 'certificate_issued',
    templateId: 'tmpl-certificate-issued',
    templateType: 'email',
    conditions: [
      { field: 'certificate.status', operator: 'equals', value: 'issued' },
    ],
    timing: {
      type: 'immediate',
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 456,
    lastExecutedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trigger-user-registered',
    name: 'Yeni Kullanıcı Kaydında',
    description: 'Yeni kullanıcıya hoşgeldin e-postası gönderir',
    event: 'user_registered',
    templateId: 'tmpl-welcome',
    templateType: 'email',
    conditions: [
      { field: 'user.emailVerified', operator: 'equals', value: true },
    ],
    timing: {
      type: 'delayed',
      delay: 5,
      delayUnit: 'minutes',
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    executionCount: 567,
    lastExecutedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// ==================== E-POSTA KAMPANYALARI ====================

export const emailCampaigns: EmailCampaign[] = [
  {
    id: 'camp-001',
    name: 'Yeni Özellikler Duyurusu - Haziran 2025',
    description: 'Platform yeniliklerinin duyurulması',
    templateId: 'tmpl-marketing-features',
    targetAudience: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 2450,
    openCount: 1715,
    clickCount: 823,
    bounceCount: 12,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Admin',
  },
  {
    id: 'camp-002',
    name: 'Öğretmenlere Özel Kampanya',
    description: 'Öğretmenlere yönelik eğitim semineri duyurusu',
    templateId: 'tmpl-marketing-features',
    targetAudience: 'teachers',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    recipientCount: 345,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getTemplateById(id: string): EmailTemplate | NotificationTemplate | undefined {
  const emailTemplate = emailTemplates.find(t => t.id === id);
  if (emailTemplate) return emailTemplate;
  return notificationTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): EmailTemplate[] {
  return emailTemplates.filter(t => t.category === category && t.isActive);
}

export function getActiveEmailTemplates(): EmailTemplate[] {
  return emailTemplates.filter(t => t.isActive);
}

export function getActiveNotificationTemplates(): NotificationTemplate[] {
  return notificationTemplates.filter(t => t.isActive);
}

export function getActiveTriggers(): AutomatedTrigger[] {
  return automatedTriggers.filter(t => t.isActive);
}

export function getTriggersByEvent(event: TriggerEvent): AutomatedTrigger[] {
  return automatedTriggers.filter(t => t.event === event && t.isActive);
}

export function getCampaignsByStatus(status: EmailCampaign['status']): EmailCampaign[] {
  return emailCampaigns.filter(c => c.status === status);
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

export function renderTemplate(template: EmailTemplate | NotificationTemplate, variables: Record<string, any>): string {
  let content = 'htmlContent' in template ? template.htmlContent : template.message;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, String(value));
  });
  
  return content;
}

