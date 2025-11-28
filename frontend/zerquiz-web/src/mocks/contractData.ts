import { generateUUID } from '../lib/mockStorage';

// ==================== SÖZLEŞME VERİLERİ ====================

export interface Contract {
  id: string;
  title: string;
  type: 'subscription' | 'license' | 'partnership' | 'nda' | 'employment';
  status: 'draft' | 'pending_review' | 'active' | 'expired' | 'terminated';
  parties: ContractParty[];
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  terms: string;
  attachments: ContractAttachment[];
  signatures: ContractSignature[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ContractParty {
  id: string;
  name: string;
  role: 'provider' | 'client' | 'partner';
  email: string;
  phone?: string;
  address?: string;
}

export interface ContractAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface ContractSignature {
  id: string;
  partyId: string;
  partyName: string;
  signedAt: string;
  ipAddress: string;
  status: 'signed' | 'pending';
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: Contract['type'];
  description: string;
  terms: string;
  category: string;
}

export type AdvancedContractCategoryId =
  | 'kvk_customer'
  | 'service_license'
  | 'royalty'
  | 'royalty_transfer'
  | 'royalty_lease'
  | 'platform_corporate'
  | 'platform_individual'
  | 'institution_usage'
  | 'personnel';

export interface AdvancedContractTemplate {
  id: string;
  category: AdvancedContractCategoryId | string;
  icon: string;
  name: string;
  description: string;
  clientTypes: Array<'corporate' | 'individual' | 'author' | 'personnel' | 'platform' | 'institution'>;
  variables: string[];
  languages: Array<{
    code: 'tr' | 'en';
    label: string;
    sections: Array<{ title: string; content: string }>;
  }>;
  recommendedAttachments: string[];
  digitalSignatureSteps: string[];
}

export interface DigitalSignatureProvider {
  id: string;
  name: string;
  country: string;
  compliance: string[];
  avgTurnaround: string;
  successRate: string;
  logo: string;
}

export interface ContractCustomerProfile {
  id: string;
  label: string;
  type: 'corporate' | 'individual' | 'author' | 'personnel' | 'platform' | 'institution';
  description: string;
  contactPerson: string;
  defaults: Record<string, string>;
}

// ==================== DEMO SÖZLEŞMELER ====================

export const demoContracts: Contract[] = [
  {
    id: generateUUID(),
    title: 'Kurumsal Lisans Sözleşmesi - ABC Okulu',
    type: 'license',
    status: 'active',
    parties: [
      {
        id: 'p1',
        name: 'Zerquiz Platform',
        role: 'provider',
        email: 'info@zerquiz.com',
        phone: '+90 555 123 4567',
      },
      {
        id: 'p2',
        name: 'ABC Özel Okulu',
        role: 'client',
        email: 'info@abcokul.com',
        phone: '+90 555 987 6543',
      },
    ],
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(),
    value: 50000,
    currency: 'TRY',
    terms: 'Kurumsal lisans, 500 öğrenci, sınırsız soru ve sınav...',
    attachments: [
      {
        id: 'a1',
        name: 'sozlesme.pdf',
        url: '/files/contract-001.pdf',
        size: 1500000,
        uploadedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    signatures: [
      {
        id: 's1',
        partyId: 'p1',
        partyName: 'Zerquiz Platform',
        signedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        status: 'signed',
      },
      {
        id: 's2',
        partyId: 'p2',
        partyName: 'ABC Özel Okulu',
        signedAt: new Date(Date.now() - 179 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.101',
        status: 'signed',
      },
    ],
    createdAt: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Admin User',
  },
  {
    id: generateUUID(),
    title: 'Abonelik Sözleşmesi - XYZ Koleji',
    type: 'subscription',
    status: 'active',
    parties: [
      {
        id: 'p3',
        name: 'Zerquiz Platform',
        role: 'provider',
        email: 'info@zerquiz.com',
      },
      {
        id: 'p4',
        name: 'XYZ Koleji',
        role: 'client',
        email: 'info@xyzkolej.com',
      },
    ],
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
    value: 9588, // 799 x 12
    currency: 'TRY',
    terms: 'Yıllık abonelik, Pro paket, otomatik yenileme...',
    attachments: [],
    signatures: [
      {
        id: 's3',
        partyId: 'p3',
        partyName: 'Zerquiz Platform',
        signedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        status: 'signed',
      },
      {
        id: 's4',
        partyId: 'p4',
        partyName: 'XYZ Koleji',
        signedAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.102',
        status: 'signed',
      },
    ],
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Admin User',
  },
  {
    id: generateUUID(),
    title: 'Gizlilik Sözleşmesi - Partner Firma',
    type: 'nda',
    status: 'pending_review',
    parties: [
      {
        id: 'p5',
        name: 'Zerquiz Platform',
        role: 'provider',
        email: 'info@zerquiz.com',
      },
      {
        id: 'p6',
        name: 'Partner Teknoloji A.Ş.',
        role: 'partner',
        email: 'info@partnertek.com',
      },
    ],
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString(), // 3 yıl
    value: 0,
    currency: 'TRY',
    terms: 'Taraflar arasında paylaşılacak gizli bilgilerin korunması...',
    attachments: [],
    signatures: [
      {
        id: 's5',
        partyId: 'p5',
        partyName: 'Zerquiz Platform',
        signedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        status: 'signed',
      },
      {
        id: 's6',
        partyId: 'p6',
        partyName: 'Partner Teknoloji A.Ş.',
        signedAt: '',
        ipAddress: '',
        status: 'pending',
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Admin User',
  },
];

// ==================== ŞABLONLAR ====================

export const contractTemplates: ContractTemplate[] = [
  {
    id: 't1',
    name: 'Standart Lisans Sözleşmesi',
    type: 'license',
    description: 'Yazılım lisansı için standart sözleşme şablonu',
    terms: 'MADDE 1: Lisans Hakları\nMüşteri, Zerquiz platformunu...',
    category: 'Yazılım',
  },
  {
    id: 't2',
    name: 'Abonelik Sözleşmesi',
    type: 'subscription',
    description: 'Aylık/Yıllık abonelik sözleşmesi',
    terms: 'MADDE 1: Abonelik Süresi\nAbonelik süresi...',
    category: 'Hizmet',
  },
  {
    id: 't3',
    name: 'Gizlilik Sözleşmesi (NDA)',
    type: 'nda',
    description: 'Gizli bilgilerin korunması sözleşmesi',
    terms: 'MADDE 1: Gizli Bilgiler\nGizli bilgiler...',
    category: 'Yasal',
  },
];

export const advancedContractTemplates: AdvancedContractTemplate[] = [
  {
    id: 'adv-1',
    category: 'kvk_customer',
    icon: '🔐',
    name: 'KVK Müşteri Sözleşmesi',
    description: 'Bireysel / kurumsal müşteriler için KVKK uyumlu veri işleme sözleşmesi.',
    clientTypes: ['corporate', 'individual', 'platform'],
    variables: ['company_name', 'customer_type', 'data_processing_scope', 'retention_period'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: '1. Amaç',
            content:
              '{{company_name}} ile {{customer_type}} müşteri arasında KVKK kapsamında {{data_processing_scope}} verilerinin işlenmesi ve saklanmasına ilişkin esaslar belirlenmiştir.',
          },
          {
            title: '2. Saklama Süresi',
            content:
              'Veriler {{retention_period}} boyunca saklanacak olup süre sonunda imha politikalarımıza uygun olarak anonimleştirilecektir.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: '1. Purpose',
            content:
              'This agreement defines the processing scope of {{data_processing_scope}} data between {{company_name}} and the {{customer_type}} customer under GDPR/KVKK.',
          },
          {
            title: '2. Retention',
            content:
              'Personal data will be retained for {{retention_period}} and securely destroyed or anonymized afterwards.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Veri işleme envanteri', 'Aydınlatma metni'],
    digitalSignatureSteps: ['Müşteri onayı', 'DPO onayı', 'Arşivleme'],
  },
  {
    id: 'adv-2',
    category: 'service_license',
    icon: '📜',
    name: 'Hizmet & Lisans Sözleşmesi',
    description: 'Platform hizmeti ve lisans kullanım koşulları.',
    clientTypes: ['corporate', 'platform'],
    variables: ['service_scope', 'license_users', 'payment_terms', 'sla'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Hizmet Kapsamı',
            content:
              '{{service_scope}} kapsamındaki hizmetler {{license_users}} kullanıcıya atanmıştır. Hizmet seviyesi anlaşması: {{sla}}.',
          },
          {
            title: 'Ücretlendirme',
            content: '{{payment_terms}} ödeme planına göre faturalanacaktır.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Service Scope',
            content:
              'Services defined as {{service_scope}} will be available for {{license_users}} seats with SLA {{sla}}.',
          },
          {
            title: 'Billing',
            content: 'Billing will follow {{payment_terms}} schedule.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Fiyat teklifi', 'SLA dokümanı'],
    digitalSignatureSteps: ['Satış', 'Operasyon', 'Müşteri'],
  },
  {
    id: 'adv-3',
    category: 'royalty',
    icon: '✍️',
    name: 'Telif Sözleşmesi',
    description: 'İçerik üreticileri için telif paylaşım sözleşmesi.',
    clientTypes: ['author'],
    variables: ['author_name', 'royalty_rate', 'content_scope', 'payout_cycle'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Haklar',
            content:
              '{{author_name}} tarafından üretilen {{content_scope}} içeriklerin yayın hakları Zerquiz’e devredilmiş, telif payı %{{royalty_rate}} olarak belirlenmiştir.',
          },
          {
            title: 'Ödeme Planı',
            content: 'Telif ödemeleri {{payout_cycle}} dönemlerinde yapılacaktır.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Rights',
            content:
              '{{author_name}} grants Zerquiz the publishing rights for {{content_scope}} with a royalty share of {{royalty_rate}}%.',
          },
          {
            title: 'Payment',
            content: 'Royalty payments will be made every {{payout_cycle}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['İçerik listesi', 'Vergi beyannamesi'],
    digitalSignatureSteps: ['Yazar', 'Editör', 'Finans'],
  },
  {
    id: 'adv-4',
    category: 'royalty_transfer',
    icon: '🔄',
    name: 'Telif Devri Sözleşmesi',
    description: 'Telif haklarının üçüncü tarafa devri.',
    clientTypes: ['author', 'platform'],
    variables: ['transfer_party', 'transfer_scope', 'transfer_fee', 'effective_date'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Devir',
            content:
              '{{transfer_party}} ile yapılan anlaşma gereği {{transfer_scope}} üzerindeki tüm haklar devredilmiş, karşılık olarak {{transfer_fee}} bedel ödenecektir.',
          },
          {
            title: 'Yürürlük',
            content: 'Devir {{effective_date}} tarihinde yürürlüğe girer.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Assignment',
            content:
              '{{transfer_party}} assigns all rights over {{transfer_scope}} to Zerquiz for a consideration of {{transfer_fee}}.',
          },
          {
            title: 'Effective Date',
            content: 'Agreement becomes effective on {{effective_date}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Telif listesi'],
    digitalSignatureSteps: ['Yazar', 'Yeni hak sahibi', 'Noter'],
  },
  {
    id: 'adv-5',
    category: 'royalty_lease',
    icon: '📄',
    name: 'Telif Kiralama Sözleşmesi',
    description: 'Belirli süreli içerik kiralama modeli.',
    clientTypes: ['author', 'platform'],
    variables: ['lease_term', 'usage_limit', 'leasing_fee'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Kiralama Süresi',
            content: '{{lease_term}} boyunca {{usage_limit}} kullanım hakkı tanınmıştır.',
          },
          {
            title: 'Ücret',
            content: 'Kiralama bedeli {{leasing_fee}} olarak belirlenmiştir.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Term',
            content: '{{lease_term}} lease grants {{usage_limit}} usage rights.',
          },
          {
            title: 'Fee',
            content: 'Leasing fee: {{leasing_fee}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['İçerik listesi'],
    digitalSignatureSteps: ['Yazar', 'Platform', 'Finans'],
  },
  {
    id: 'adv-6',
    category: 'platform_corporate',
    icon: '🏢',
    name: 'Kurumsal Platform Sözleşmesi',
    description: 'Kurumsal müşteriler için master sözleşme.',
    clientTypes: ['corporate', 'platform'],
    variables: ['organization_name', 'user_limit', 'support_plan', 'billing_cycle'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Kapsam',
            content:
              '{{organization_name}} kurumu için {{user_limit}} kullanıcıya kadar erişim tanımlanmış, destek planı {{support_plan}} olarak seçilmiştir.',
          },
          {
            title: 'Faturalama',
            content: 'Faturalar {{billing_cycle}} döngüsünde düzenlenecektir.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Scope',
            content:
              '{{organization_name}} receives access for up to {{user_limit}} users. Support plan: {{support_plan}}.',
          },
          {
            title: 'Billing',
            content: 'Invoices follow {{billing_cycle}} cycle.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Kullanıcı listesi', 'Destek SLA'],
    digitalSignatureSteps: ['Satış', 'Müşteri temsilcisi', 'Yetkili imza'],
  },
  {
    id: 'adv-7',
    category: 'platform_individual',
    icon: '🧑‍💻',
    name: 'Bireysel Platform Sözleşmesi',
    description: 'Öğretmen / veli gibi bireysel kullanıcılar için şartlar.',
    clientTypes: ['individual', 'platform'],
    variables: ['user_name', 'plan_name', 'auto_renewal'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Plan',
            content:
              '{{user_name}} kullanıcısına {{plan_name}} planı tanımlanmış olup otomatik yenileme {{auto_renewal}}.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Plan',
            content:
              '{{user_name}} is subscribed to {{plan_name}} plan. Auto renewal: {{auto_renewal}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Plan şartları'],
    digitalSignatureSteps: ['Kullanıcı', 'Platform'],
  },
  {
    id: 'adv-8',
    category: 'institution_usage',
    icon: '🏫',
    name: 'Kurum Platform Kullanım Sözleşmesi',
    description: 'Okul/kurum iç kullanım koşulları ve yönetmelik uyumu.',
    clientTypes: ['institution', 'platform'],
    variables: ['institution_name', 'compliance_notes', 'device_policy'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Politikalar',
            content:
              '{{institution_name}} için kurum içi kullanım politikası: {{device_policy}}. Uyum notları: {{compliance_notes}}.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Policies',
            content:
              '{{institution_name}} usage policy: {{device_policy}}. Compliance notes: {{compliance_notes}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['İç politika dokümanı'],
    digitalSignatureSteps: ['İK', 'BT', 'Yetkili'],
  },
  {
    id: 'adv-9',
    category: 'personnel',
    icon: '👔',
    name: 'Personel Sözleşmesi',
    description: 'Platform çalışanları / editörleri için istihdam koşulları.',
    clientTypes: ['personnel'],
    variables: ['employee_name', 'position', 'salary', 'start_date', 'probation'],
    languages: [
      {
        code: 'tr',
        label: 'Türkçe',
        sections: [
          {
            title: 'Görev Tanımı',
            content:
              '{{employee_name}} {{position}} pozisyonunda {{start_date}} tarihinde göreve başlayacaktır. Deneme süresi {{probation}}.',
          },
          {
            title: 'Ücret',
            content: 'Aylık brüt maaş: {{salary}}.',
          },
        ],
      },
      {
        code: 'en',
        label: 'English',
        sections: [
          {
            title: 'Role',
            content:
              '{{employee_name}} will start as {{position}} on {{start_date}}. Probation: {{probation}}.',
          },
          {
            title: 'Compensation',
            content: 'Monthly gross salary: {{salary}}.',
          },
        ],
      },
    ],
    recommendedAttachments: ['Kimlik', 'Bordro'],
    digitalSignatureSteps: ['İK', 'Çalışan', 'CEO'],
  },
];

export const digitalSignatureProviders: DigitalSignatureProvider[] = [
  {
    id: 'signtr',
    name: 'SignTR',
    country: 'Türkiye',
    compliance: ['KVKK', '5070 EİK'],
    avgTurnaround: '5 dk',
    successRate: '99.2%',
    logo: '🇹🇷',
  },
  {
    id: 'eidaseu',
    name: 'EidasEU Sign',
    country: 'EU',
    compliance: ['eIDAS', 'GDPR'],
    avgTurnaround: '8 dk',
    successRate: '98.5%',
    logo: '🇪🇺',
  },
  {
    id: 'globalSign',
    name: 'GlobalSign Pro',
    country: 'Global',
    compliance: ['ISO 27001', 'SOC2'],
    avgTurnaround: '6 dk',
    successRate: '99.0%',
    logo: '🌐',
  },
];

export const contractCustomerProfiles: ContractCustomerProfile[] = [
  {
    id: 'corp-school',
    label: 'Kurumsal Okul',
    type: 'corporate',
    description: '500+ öğrenciye sahip özel eğitim kurumları.',
    contactPerson: 'Müdür Yardımcısı',
    defaults: {
      company_name: 'Örnek Koleji',
      organization_name: 'Örnek Koleji',
      user_limit: '750',
      support_plan: '7/24 Premium',
      billing_cycle: 'Aylık',
      data_processing_scope: 'Öğrenci, veli ve öğretmen verileri',
      retention_period: '10 yıl',
      service_scope: 'Öğrenme yönetimi + değerlendirme paketi',
      license_users: '750',
      payment_terms: 'Peşin + 12 taksit',
      sla: '99.5%',
    },
  },
  {
    id: 'indiv-teacher',
    label: 'Bireysel Öğretmen',
    type: 'individual',
    description: 'Part-time platform kullanan öğretmenler.',
    contactPerson: 'Öğretmen',
    defaults: {
      user_name: 'Öğrt. Ayşe Demir',
      plan_name: 'Pro Bireysel',
      auto_renewal: 'Evet',
      company_name: 'Ayşe Demir',
      data_processing_scope: 'Öğrenci sonuçları',
      retention_period: '3 yıl',
    },
  },
  {
    id: 'author-pro',
    label: 'Profesyonel Yazar',
    type: 'author',
    description: 'Telifli içerik üreten yazarlar.',
    contactPerson: 'Yazar',
    defaults: {
      author_name: 'Ahmet Yazar',
      content_scope: 'Matematik soru bankası',
      royalty_rate: '35',
      payout_cycle: 'Aylık',
      transfer_party: 'Yayıncı A.Ş.',
      transfer_scope: '2025 LGS kitap seti',
      transfer_fee: '150.000 ₺',
      effective_date: '01.01.2025',
    },
  },
  {
    id: 'institution-public',
    label: 'Kamu Kurumu',
    type: 'institution',
    description: 'Kamu okul veya belediye projeleri.',
    contactPerson: 'Proje Koordinatörü',
    defaults: {
      institution_name: 'İstanbul İl MEM',
      device_policy: 'Sadece kurum cihazları',
      compliance_notes: 'KVKK + e-Devlet entegrasyonu',
      service_scope: 'Karma öğrenme platformu',
      support_plan: 'Kamu Premier',
      billing_cycle: 'Yıllık',
    },
  },
  {
    id: 'personnel-editor',
    label: 'Editör Personel',
    type: 'personnel',
    description: 'Platformda tam zamanlı çalışan içerik editörleri.',
    contactPerson: 'İK Uzmanı',
    defaults: {
      employee_name: 'Zeynep Kaya',
      position: 'Kıdemli İçerik Editörü',
      salary: '45.000 ₺',
      start_date: '15.02.2025',
      probation: '2 ay',
    },
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getContractsByStatus(status: Contract['status']): Contract[] {
  return demoContracts.filter(c => c.status === status);
}

export function getExpiringContracts(days: number = 30): Contract[] {
  const threshold = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return demoContracts.filter(c => {
    const endDate = new Date(c.endDate);
    return c.status === 'active' && endDate <= threshold;
  });
}

export function getContractStats() {
  return {
    total: demoContracts.length,
    active: getContractsByStatus('active').length,
    pendingReview: getContractsByStatus('pending_review').length,
    expired: getContractsByStatus('expired').length,
    expiringSoon: getExpiringContracts(30).length,
    totalValue: demoContracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + c.value, 0),
  };
}

