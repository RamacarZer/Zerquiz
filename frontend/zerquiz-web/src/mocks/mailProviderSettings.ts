import { generateUUID } from '../lib/mockStorage';

// ==================== MAİL PROVIDER ENTEGRASYONLARI ====================

export type MailProvider = 
  | 'smtp'           // Custom SMTP
  | 'sendgrid'       // SendGrid
  | 'mailgun'        // Mailgun
  | 'aws-ses'        // Amazon SES
  | 'postmark'       // Postmark
  | 'sparkpost'      // SparkPost
  | 'mailjet'        // Mailjet
  | 'mandrill'       // Mandrill (Mailchimp)
  | 'sendinblue'     // Sendinblue (Brevo)
  | 'resend';        // Resend

export type SMSProvider =
  | 'twilio'         // Twilio
  | 'vonage'         // Vonage (Nexmo)
  | 'aws-sns'        // AWS SNS
  | 'messagebird'    // MessageBird
  | 'plivo'          // Plivo
  | 'netgsm'         // NetGSM (Türkiye)
  | 'iletimerkezi';  // İleti Merkezi (Türkiye)

export type PushProvider =
  | 'firebase'       // Firebase Cloud Messaging
  | 'onesignal'      // OneSignal
  | 'pusher'         // Pusher Beams
  | 'airship';       // Airship

export interface MailProviderConfig {
  id: string;
  provider: MailProvider;
  name: string;
  isActive: boolean;
  isPrimary: boolean;
  credentials: MailCredentials;
  settings: MailSettings;
  quotas: ProviderQuotas;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastTestDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MailCredentials {
  // SMTP
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean; // SSL/TLS
  smtpUser?: string;
  smtpPassword?: string;
  
  // API Key based
  apiKey?: string;
  apiSecret?: string;
  
  // AWS SES
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  
  // Domain
  domain?: string;
  
  // Webhook
  webhookUrl?: string;
  webhookSecret?: string;
}

export interface MailSettings {
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  bccEmail?: string;
  
  // Features
  trackOpens: boolean;
  trackClicks: boolean;
  enableUnsubscribe: boolean;
  enableBounceTracking: boolean;
  
  // Limits
  dailyLimit?: number;
  hourlyLimit?: number;
  rateLimit?: number; // emails per second
  
  // Retry
  maxRetries: number;
  retryDelay: number; // seconds
}

export interface ProviderQuotas {
  dailyQuota: number;
  monthlyQuota: number;
  dailyUsed: number;
  monthlyUsed: number;
  lastResetDate: string;
}

export interface SMSProviderConfig {
  id: string;
  provider: SMSProvider;
  name: string;
  isActive: boolean;
  credentials: SMSCredentials;
  settings: SMSSettings;
  quotas: ProviderQuotas;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

export interface SMSCredentials {
  accountSid?: string; // Twilio
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
  senderId?: string; // Sender ID
}

export interface SMSSettings {
  defaultSender: string;
  enableDeliveryReports: boolean;
  maxLength: number;
  allowUnicode: boolean;
}

export interface PushProviderConfig {
  id: string;
  provider: PushProvider;
  name: string;
  isActive: boolean;
  credentials: PushCredentials;
  settings: PushSettings;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

export interface PushCredentials {
  serverKey?: string;
  senderId?: string;
  appId?: string;
  apiKey?: string;
  projectId?: string; // Firebase
}

export interface PushSettings {
  enableSound: boolean;
  enableBadge: boolean;
  defaultTTL: number; // Time to live (seconds)
  priority: 'high' | 'normal';
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  whatsappEnabled: boolean;
  
  // Global settings
  enableBatchSending: boolean;
  batchSize: number;
  enableRetries: boolean;
  maxRetries: number;
  
  // Queue settings
  useQueue: boolean;
  queueProvider?: 'redis' | 'rabbitmq' | 'aws-sqs';
  queuePriority: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  preheader?: string; // Email preview text
  category: string;
  isActive: boolean;
}

export interface WebhookLog {
  id: string;
  provider: MailProvider | SMSProvider;
  event: string;
  payload: any;
  receivedAt: string;
  processed: boolean;
}

export interface DeliveryLog {
  id: string;
  provider: MailProvider | SMSProvider;
  channel: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  error?: string;
}

// ==================== DEMO VERİLERİ ====================

export const demoMailProviders: MailProviderConfig[] = [
  {
    id: 'provider-1',
    provider: 'sendgrid',
    name: 'SendGrid - Primary',
    isActive: true,
    isPrimary: true,
    credentials: {
      apiKey: 'SG.xxxxxxxxxxxxxxxxxx',
      domain: 'mail.zerquiz.com',
      webhookUrl: 'https://api.zerquiz.com/webhooks/sendgrid',
      webhookSecret: 'whsec_xxxxxxxxxxxxxx',
    },
    settings: {
      fromName: 'Zerquiz Platform',
      fromEmail: 'no-reply@zerquiz.com',
      replyToEmail: 'support@zerquiz.com',
      bccEmail: 'archive@zerquiz.com',
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true,
      enableBounceTracking: true,
      dailyLimit: 100000,
      hourlyLimit: 10000,
      rateLimit: 100,
      maxRetries: 3,
      retryDelay: 300,
    },
    quotas: {
      dailyQuota: 100000,
      monthlyQuota: 3000000,
      dailyUsed: 2450,
      monthlyUsed: 45670,
      lastResetDate: new Date().toISOString(),
    },
    status: 'connected',
    lastTestDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'provider-2',
    provider: 'aws-ses',
    name: 'Amazon SES - Backup',
    isActive: true,
    isPrimary: false,
    credentials: {
      awsRegion: 'eu-west-1',
      awsAccessKeyId: 'AKIAXXXXXXXXXX',
      awsSecretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      domain: 'mail.zerquiz.com',
    },
    settings: {
      fromName: 'Zerquiz Platform',
      fromEmail: 'no-reply@zerquiz.com',
      replyToEmail: 'support@zerquiz.com',
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true,
      enableBounceTracking: true,
      dailyLimit: 50000,
      maxRetries: 3,
      retryDelay: 300,
    },
    quotas: {
      dailyQuota: 50000,
      monthlyQuota: 1500000,
      dailyUsed: 0,
      monthlyUsed: 0,
      lastResetDate: new Date().toISOString(),
    },
    status: 'connected',
    lastTestDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'provider-3',
    provider: 'smtp',
    name: 'Custom SMTP Server',
    isActive: false,
    isPrimary: false,
    credentials: {
      smtpHost: 'smtp.zerquiz.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: 'noreply@zerquiz.com',
      smtpPassword: '********************',
    },
    settings: {
      fromName: 'Zerquiz',
      fromEmail: 'noreply@zerquiz.com',
      trackOpens: false,
      trackClicks: false,
      enableUnsubscribe: false,
      enableBounceTracking: false,
      maxRetries: 3,
      retryDelay: 300,
    },
    quotas: {
      dailyQuota: 10000,
      monthlyQuota: 300000,
      dailyUsed: 0,
      monthlyUsed: 0,
      lastResetDate: new Date().toISOString(),
    },
    status: 'disconnected',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoSMSProviders: SMSProviderConfig[] = [
  {
    id: 'sms-1',
    provider: 'twilio',
    name: 'Twilio SMS',
    isActive: true,
    credentials: {
      accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      authToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      senderId: '+90850XXXXXXX',
    },
    settings: {
      defaultSender: 'Zerquiz',
      enableDeliveryReports: true,
      maxLength: 160,
      allowUnicode: true,
    },
    quotas: {
      dailyQuota: 10000,
      monthlyQuota: 300000,
      dailyUsed: 234,
      monthlyUsed: 5678,
      lastResetDate: new Date().toISOString(),
    },
    status: 'connected',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sms-2',
    provider: 'netgsm',
    name: 'NetGSM (Türkiye)',
    isActive: true,
    credentials: {
      apiKey: 'xxxxxxxxxxxxxxxx',
      senderId: 'ZERQUIZ',
    },
    settings: {
      defaultSender: 'ZERQUIZ',
      enableDeliveryReports: true,
      maxLength: 160,
      allowUnicode: true,
    },
    quotas: {
      dailyQuota: 5000,
      monthlyQuota: 150000,
      dailyUsed: 123,
      monthlyUsed: 3456,
      lastResetDate: new Date().toISOString(),
    },
    status: 'connected',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoPushProviders: PushProviderConfig[] = [
  {
    id: 'push-1',
    provider: 'firebase',
    name: 'Firebase Cloud Messaging',
    isActive: true,
    credentials: {
      serverKey: 'AAAAxxxxxxxx:APA91bGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      senderId: '123456789012',
      projectId: 'zerquiz-app',
    },
    settings: {
      enableSound: true,
      enableBadge: true,
      defaultTTL: 2419200, // 28 days
      priority: 'high',
    },
    status: 'connected',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'push-2',
    provider: 'onesignal',
    name: 'OneSignal',
    isActive: false,
    credentials: {
      appId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      apiKey: 'YTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    settings: {
      enableSound: true,
      enableBadge: true,
      defaultTTL: 259200, // 3 days
      priority: 'normal',
    },
    status: 'disconnected',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const notificationSettings: NotificationSettings = {
  emailEnabled: true,
  smsEnabled: true,
  pushEnabled: true,
  inAppEnabled: true,
  whatsappEnabled: false,
  enableBatchSending: true,
  batchSize: 100,
  enableRetries: true,
  maxRetries: 3,
  useQueue: true,
  queueProvider: 'redis',
  queuePriority: true,
};

export const demoDeliveryLogs: DeliveryLog[] = [
  {
    id: 'log-1',
    provider: 'sendgrid',
    channel: 'email',
    recipient: 'ahmet@example.com',
    subject: 'Sınav Hatırlatması - Matematik Final',
    status: 'opened',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    openedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    provider: 'twilio',
    channel: 'sms',
    recipient: '+905551234567',
    status: 'delivered',
    sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    provider: 'sendgrid',
    channel: 'email',
    recipient: 'invalid@example.com',
    subject: 'Hoşgeldin E-postası',
    status: 'bounced',
    sentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    error: 'Recipient email address does not exist',
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getActiveMailProvider(): MailProviderConfig | undefined {
  return demoMailProviders.find(p => p.isActive && p.isPrimary);
}

export function getAllActiveMailProviders(): MailProviderConfig[] {
  return demoMailProviders.filter(p => p.isActive);
}

export function getActiveSMSProvider(): SMSProviderConfig | undefined {
  return demoSMSProviders.find(p => p.isActive);
}

export function getActivePushProvider(): PushProviderConfig | undefined {
  return demoPushProviders.find(p => p.isActive);
}

export function calculateQuotaUsage(quotas: ProviderQuotas): {
  dailyPercentage: number;
  monthlyPercentage: number;
  dailyRemaining: number;
  monthlyRemaining: number;
} {
  const dailyPercentage = (quotas.dailyUsed / quotas.dailyQuota) * 100;
  const monthlyPercentage = (quotas.monthlyUsed / quotas.monthlyQuota) * 100;
  const dailyRemaining = quotas.dailyQuota - quotas.dailyUsed;
  const monthlyRemaining = quotas.monthlyQuota - quotas.monthlyUsed;

  return {
    dailyPercentage: Math.round(dailyPercentage * 100) / 100,
    monthlyPercentage: Math.round(monthlyPercentage * 100) / 100,
    dailyRemaining,
    monthlyRemaining,
  };
}

export function getProviderIcon(provider: MailProvider | SMSProvider | PushProvider): string {
  const icons: Record<string, string> = {
    // Email
    'smtp': '📧',
    'sendgrid': '📨',
    'mailgun': '🔫',
    'aws-ses': '☁️',
    'postmark': '📮',
    'sparkpost': '✨',
    'mailjet': '✈️',
    'mandrill': '🐒',
    'sendinblue': '💙',
    'resend': '🔄',
    // SMS
    'twilio': '📱',
    'vonage': '📞',
    'aws-sns': '☁️',
    'messagebird': '🐦',
    'plivo': '📲',
    'netgsm': '🇹🇷',
    'iletimerkezi': '🇹🇷',
    // Push
    'firebase': '🔥',
    'onesignal': '🔔',
    'pusher': '📣',
    'airship': '🚀',
  };
  return icons[provider] || '📧';
}

export function getProviderDisplayName(provider: MailProvider | SMSProvider | PushProvider): string {
  const names: Record<string, string> = {
    'smtp': 'Custom SMTP',
    'sendgrid': 'SendGrid',
    'mailgun': 'Mailgun',
    'aws-ses': 'Amazon SES',
    'postmark': 'Postmark',
    'sparkpost': 'SparkPost',
    'mailjet': 'Mailjet',
    'mandrill': 'Mandrill',
    'sendinblue': 'Sendinblue (Brevo)',
    'resend': 'Resend',
    'twilio': 'Twilio',
    'vonage': 'Vonage',
    'aws-sns': 'AWS SNS',
    'messagebird': 'MessageBird',
    'plivo': 'Plivo',
    'netgsm': 'NetGSM',
    'iletimerkezi': 'İleti Merkezi',
    'firebase': 'Firebase FCM',
    'onesignal': 'OneSignal',
    'pusher': 'Pusher Beams',
    'airship': 'Airship',
  };
  return names[provider] || provider;
}

export function testMailConnection(config: MailProviderConfig): Promise<boolean> {
  // Simulated test
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config.status === 'connected');
    }, 1000);
  });
}

export function getDeliveryStats(logs: DeliveryLog[]) {
  const total = logs.length;
  const sent = logs.filter(l => l.status !== 'failed').length;
  const delivered = logs.filter(l => l.status === 'delivered' || l.status === 'opened' || l.status === 'clicked').length;
  const opened = logs.filter(l => l.status === 'opened' || l.status === 'clicked').length;
  const clicked = logs.filter(l => l.status === 'clicked').length;
  const bounced = logs.filter(l => l.status === 'bounced').length;
  const failed = logs.filter(l => l.status === 'failed').length;

  return {
    total,
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    failed,
    deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
    openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
    clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
    bounceRate: total > 0 ? (bounced / total) * 100 : 0,
  };
}

