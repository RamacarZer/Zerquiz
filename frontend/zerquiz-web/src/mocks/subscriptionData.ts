import { generateUUID } from '../lib/mockStorage';

// ==================== ABONELİK PAKET VERİLERİ ====================

export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxQuestions: number;
    maxExams: number;
    maxStudents: number;
    maxStorage: number; // GB
  };
  popular: boolean;
  color: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  packageId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  usage: {
    questionsUsed: number;
    examsUsed: number;
    studentsUsed: number;
    storageUsed: number; // GB
  };
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
}

export interface CustomerAccount {
  id: string;
  organizationId: string;
  type: 'school' | 'course' | 'enterprise' | 'individual';
  size: 'small' | 'medium' | 'large';
  contactName: string;
  contactEmail: string;
  phone: string;
  address: string;
  tags: string[];
  billingContact: string;
  billingEmail: string;
  billingNotes: string[];
  joinedAt: string;
}

export interface SubscriptionTransaction {
  id: string;
  subscriptionId: string;
  date: string;
  type: 'payment' | 'refund' | 'usage_adjustment' | 'invoice' | 'upgrade';
  description: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'bank_transfer' | 'wallet' | 'promo';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

// ==================== PAKETLER ====================

export const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'pkg-free',
    name: 'Ücretsiz',
    description: 'Başlamak için ideal',
    price: 0,
    currency: 'TRY',
    billingPeriod: 'monthly',
    features: [
      '50 soru',
      '5 sınav',
      '25 öğrenci',
      '1 GB depolama',
      'Temel raporlar',
    ],
    limits: {
      maxQuestions: 50,
      maxExams: 5,
      maxStudents: 25,
      maxStorage: 1,
    },
    popular: false,
    color: 'gray',
  },
  {
    id: 'pkg-basic',
    name: 'Temel',
    description: 'Küçük ekipler için',
    price: 299,
    currency: 'TRY',
    billingPeriod: 'monthly',
    features: [
      '500 soru',
      '50 sınav',
      '100 öğrenci',
      '10 GB depolama',
      'Gelişmiş raporlar',
      'Email desteği',
    ],
    limits: {
      maxQuestions: 500,
      maxExams: 50,
      maxStudents: 100,
      maxStorage: 10,
    },
    popular: false,
    color: 'blue',
  },
  {
    id: 'pkg-pro',
    name: 'Profesyonel',
    description: 'Büyüyen organizasyonlar için',
    price: 799,
    currency: 'TRY',
    billingPeriod: 'monthly',
    features: [
      '5,000 soru',
      '500 sınav',
      '500 öğrenci',
      '50 GB depolama',
      'Tüm özellikler',
      'Öncelikli destek',
      'API erişimi',
      'Özel raporlar',
    ],
    limits: {
      maxQuestions: 5000,
      maxExams: 500,
      maxStudents: 500,
      maxStorage: 50,
    },
    popular: true,
    color: 'purple',
  },
  {
    id: 'pkg-enterprise',
    name: 'Kurumsal',
    description: 'Büyük organizasyonlar için',
    price: 2499,
    currency: 'TRY',
    billingPeriod: 'monthly',
    features: [
      'Sınırsız soru',
      'Sınırsız sınav',
      'Sınırsız öğrenci',
      '500 GB depolama',
      'Tüm özellikler',
      '7/24 destek',
      'API erişimi',
      'Özel entegrasyonlar',
      'SLA garantisi',
      'Özel eğitim',
    ],
    limits: {
      maxQuestions: -1, // unlimited
      maxExams: -1,
      maxStudents: -1,
      maxStorage: 500,
    },
    popular: false,
    color: 'yellow',
  },
];

// ==================== DEMO ABONELİKLER ====================

export const demoSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    organizationId: 'org-001',
    organizationName: 'Demo Okul',
    packageId: 'pkg-pro',
    status: 'active',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    usage: {
      questionsUsed: 1250,
      examsUsed: 120,
      studentsUsed: 350,
      storageUsed: 25.5,
    },
  },
  {
    id: 'sub-002',
    organizationId: 'org-002',
    organizationName: 'Test Koleji',
    packageId: 'pkg-basic',
    status: 'active',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    usage: {
      questionsUsed: 380,
      examsUsed: 42,
      studentsUsed: 85,
      storageUsed: 7.2,
    },
  },
];

// ==================== DEMO FATURALAR ====================

export const demoInvoices: Invoice[] = [
  {
    id: 'inv-001',
    subscriptionId: 'sub-001',
    amount: 799,
    currency: 'TRY',
    status: 'paid',
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    invoiceNumber: 'INV-2025-001',
  },
  {
    id: 'inv-002',
    subscriptionId: 'sub-001',
    amount: 799,
    currency: 'TRY',
    status: 'paid',
    issueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
    invoiceNumber: 'INV-2025-002',
  },
  {
    id: 'inv-003',
    subscriptionId: 'sub-002',
    amount: 299,
    currency: 'TRY',
    status: 'paid',
    issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    invoiceNumber: 'INV-2025-003',
  },
];

export const customerAccounts: CustomerAccount[] = [
  {
    id: 'acct-001',
    organizationId: 'org-001',
    type: 'school',
    size: 'large',
    contactName: 'Merve Acar',
    contactEmail: 'merve.acar@demookul.edu.tr',
    phone: '+90 555 123 45 67',
    address: 'İstanbul, Kadıköy, Eğitim Mah.',
    tags: ['Premium', 'KVKK Onaylı', '7/24 Destek'],
    billingContact: 'Finans Müdürü',
    billingEmail: 'muhasebe@demookul.edu.tr',
    billingNotes: ['Faturalar e-posta ile gönderilmeli', 'Ödeme süresi +5 gün'],
    joinedAt: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'acct-002',
    organizationId: 'org-002',
    type: 'course',
    size: 'medium',
    contactName: 'Levent Demir',
    contactEmail: 'levent@testkoleji.com',
    phone: '+90 555 987 65 43',
    address: 'Ankara, Çankaya, Kızılay',
    tags: ['Manuel Faturalama', 'Yıllık Ödeme'],
    billingContact: 'Muhasebe',
    billingEmail: 'billing@testkoleji.com',
    billingNotes: ['Her ay proforma talep ediyor'],
    joinedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const subscriptionTransactions: SubscriptionTransaction[] = [
  {
    id: generateUUID(),
    subscriptionId: 'sub-001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'payment',
    description: 'Pro paket aylık ödeme',
    amount: 799,
    currency: 'TRY',
    method: 'credit_card',
    status: 'completed',
    reference: 'PAY-001',
  },
  {
    id: generateUUID(),
    subscriptionId: 'sub-001',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'invoice',
    description: 'INV-2025-001 fatura',
    amount: 799,
    currency: 'TRY',
    method: 'wallet',
    status: 'completed',
    reference: 'INV-2025-001',
  },
  {
    id: generateUUID(),
    subscriptionId: 'sub-001',
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'usage_adjustment',
    description: 'Depolama limiti +25GB',
    amount: 199,
    currency: 'TRY',
    method: 'promo',
    status: 'completed',
    reference: 'ADJ-2025-040',
  },
  {
    id: generateUUID(),
    subscriptionId: 'sub-002',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'payment',
    description: 'Temel paket aylık ödeme',
    amount: 299,
    currency: 'TRY',
    method: 'bank_transfer',
    status: 'pending',
    reference: 'PAY-078',
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getCurrentSubscription(): Subscription {
  return demoSubscriptions[0];
}

export function getPackageById(packageId: string): SubscriptionPackage | undefined {
  return subscriptionPackages.find(p => p.id === packageId);
}

export function getUsagePercentage(subscription: Subscription): {
  questions: number;
  exams: number;
  students: number;
  storage: number;
} {
  const pkg = getPackageById(subscription.packageId);
  if (!pkg) return { questions: 0, exams: 0, students: 0, storage: 0 };

  const calc = (used: number, max: number) => {
    if (max === -1) return 0; // unlimited
    return Math.round((used / max) * 100);
  };

  return {
    questions: calc(subscription.usage.questionsUsed, pkg.limits.maxQuestions),
    exams: calc(subscription.usage.examsUsed, pkg.limits.maxExams),
    students: calc(subscription.usage.studentsUsed, pkg.limits.maxStudents),
    storage: calc(subscription.usage.storageUsed, pkg.limits.maxStorage),
  };
}

export function getDaysUntilRenewal(subscription: Subscription): number {
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getInvoicesBySubscription(subscriptionId: string): Invoice[] {
  return demoInvoices.filter(inv => inv.subscriptionId === subscriptionId);
}

export function calculateYearlySavings(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
  const savings = (monthlyPrice * 12) - yearlyPrice;
  return Math.round(savings);
}

export function getCustomerAccountByOrgId(organizationId: string) {
  return customerAccounts.find(account => account.organizationId === organizationId);
}

export function getTransactionsBySubscription(subscriptionId: string) {
  return subscriptionTransactions
    .filter(tx => tx.subscriptionId === subscriptionId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUpgradeOptions(packageId: string) {
  const packages = subscriptionPackages;
  const currentIndex = packages.findIndex(pkg => pkg.id === packageId);
  if (currentIndex === -1) return [];
  return packages.filter((pkg, index) => index > currentIndex);
}

