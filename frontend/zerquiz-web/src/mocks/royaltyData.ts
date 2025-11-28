/**
 * Comprehensive Royalty Management System Mock Data
 * İç Telif, Dış Telif, Personel Telif, Uzaktan Çalışma Telif, Denetim
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type RoyaltyType = 'internal' | 'external' | 'employee' | 'remote' | 'customer';
export type ContentType = 'question' | 'exam' | 'presentation' | 'course' | 'video' | 'document' | 'article';
export type RoyaltyStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'paid' | 'disputed';
export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'issues_found';
export type PaymentMethod = 'bank_transfer' | 'paypal' | 'stripe' | 'check' | 'crypto';
export type AgreementType = 'exclusive' | 'non_exclusive' | 'work_for_hire' | 'revenue_share' | 'flat_fee';

export interface Author {
  id: string;
  name: string;
  email: string;
  type: RoyaltyType;
  contractType: AgreementType;
  taxId?: string;
  bankAccount?: string;
  department?: string;
  position?: string;
  location?: string; // For remote workers
  joinedDate: string;
  totalWorks: number;
  totalEarnings: number;
  pendingPayments: number;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

export interface RoyaltyWork {
  id: string;
  title: string;
  contentType: ContentType;
  authorId: string;
  authorName: string;
  royaltyType: RoyaltyType;
  createdDate: string;
  publishedDate?: string;
  usageCount: number;
  baseRate: number; // Per usage rate
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  status: RoyaltyStatus;
  qualityScore?: number;
  reviewCount?: number;
  tags: string[];
  lastAuditDate?: string;
  nextAuditDate?: string;
}

export interface RoyaltyPayment {
  id: string;
  authorId: string;
  authorName: string;
  royaltyType: RoyaltyType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedDate: string;
  approvedDate?: string;
  paidDate?: string;
  transactionId?: string;
  workIds: string[];
  notes?: string;
  taxDeducted: number;
  netAmount: number;
}

export interface RoyaltyAudit {
  id: string;
  auditType: 'internal' | 'external' | 'compliance' | 'quality';
  auditorName: string;
  targetType: 'author' | 'work' | 'payment' | 'system';
  targetId?: string;
  targetName?: string;
  scheduledDate: string;
  completedDate?: string;
  status: AuditStatus;
  findings: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issuesFound: number;
  issuesResolved: number;
  nextAuditDate?: string;
}

export interface RoyaltyContract {
  id: string;
  authorId: string;
  authorName: string;
  type: AgreementType;
  royaltyType: RoyaltyType;
  startDate: string;
  endDate?: string;
  baseRate: number;
  bonusRate?: number;
  minimumGuarantee?: number;
  exclusivityClause: boolean;
  territories: string[];
  contentTypes: ContentType[];
  paymentTerms: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  signedDate?: string;
  documentUrl?: string;
}

export interface RoyaltyDispute {
  id: string;
  workId: string;
  workTitle: string;
  authorId: string;
  authorName: string;
  disputeType: 'payment' | 'usage' | 'quality' | 'rights' | 'other';
  description: string;
  filedDate: string;
  resolvedDate?: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  resolution?: string;
}

export interface RoyaltyReport {
  id: string;
  reportType: 'monthly' | 'quarterly' | 'annual' | 'custom';
  period: string;
  generatedDate: string;
  totalRevenue: number;
  totalRoyaltiesPaid: number;
  totalAuthors: number;
  totalWorks: number;
  topAuthors: { authorId: string; name: string; earnings: number }[];
  topWorks: { workId: string; title: string; earnings: number }[];
  byRoyaltyType: Record<RoyaltyType, { count: number; amount: number }>;
  byContentType: Record<ContentType, { count: number; amount: number }>;
}

// ============================================
// MOCK DATA
// ============================================

export const demoAuthors: Author[] = [
  {
    id: 'auth-001',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@zerquiz.com',
    type: 'employee',
    contractType: 'work_for_hire',
    taxId: 'TR123456789',
    bankAccount: 'TR33 0006 1005 1978 6457 8413 26',
    department: 'İçerik Geliştirme',
    position: 'Kıdemli Soru Yazarı',
    joinedDate: '2022-01-15',
    totalWorks: 456,
    totalEarnings: 125000,
    pendingPayments: 8500,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'auth-002',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@external.com',
    type: 'external',
    contractType: 'revenue_share',
    taxId: 'TR987654321',
    bankAccount: 'TR33 0006 2005 3456 7890 1234 56',
    joinedDate: '2021-06-20',
    totalWorks: 234,
    totalEarnings: 78000,
    pendingPayments: 12300,
    rating: 4.6,
    status: 'active',
  },
  {
    id: 'auth-003',
    name: 'Mehmet Demir',
    email: 'mehmet.demir@remote.com',
    type: 'remote',
    contractType: 'non_exclusive',
    location: 'Ankara, Turkey',
    taxId: 'TR456789123',
    joinedDate: '2023-03-10',
    totalWorks: 123,
    totalEarnings: 45000,
    pendingPayments: 5600,
    rating: 4.9,
    status: 'active',
  },
  {
    id: 'auth-004',
    name: 'Ayşe Şahin',
    email: 'ayse.sahin@zerquiz.com',
    type: 'employee',
    contractType: 'work_for_hire',
    department: 'Matematik',
    position: 'Editör',
    taxId: 'TR789123456',
    bankAccount: 'TR33 0006 3005 8765 4321 9876 54',
    joinedDate: '2020-09-01',
    totalWorks: 678,
    totalEarnings: 189000,
    pendingPayments: 15200,
    rating: 4.9,
    status: 'active',
  },
  {
    id: 'auth-005',
    name: 'Can Özkan',
    email: 'can.ozkan@customer.com',
    type: 'customer',
    contractType: 'flat_fee',
    location: 'İstanbul, Turkey',
    joinedDate: '2023-08-15',
    totalWorks: 45,
    totalEarnings: 23000,
    pendingPayments: 3400,
    rating: 4.3,
    status: 'active',
  },
  {
    id: 'auth-006',
    name: 'Elif Arslan',
    email: 'elif.arslan@remote.com',
    type: 'remote',
    contractType: 'revenue_share',
    location: 'İzmir, Turkey',
    taxId: 'TR321654987',
    joinedDate: '2022-11-20',
    totalWorks: 189,
    totalEarnings: 67000,
    pendingPayments: 8900,
    rating: 4.7,
    status: 'active',
  },
];

export const demoRoyaltyWorks: RoyaltyWork[] = [
  {
    id: 'work-001',
    title: 'Matematik 9. Sınıf Kapsamlı Soru Seti',
    contentType: 'question',
    authorId: 'auth-001',
    authorName: 'Ahmet Yılmaz',
    royaltyType: 'employee',
    createdDate: '2024-01-15',
    publishedDate: '2024-01-20',
    usageCount: 3456,
    baseRate: 5.5,
    totalEarnings: 19008,
    pendingEarnings: 1200,
    paidEarnings: 17808,
    status: 'approved',
    qualityScore: 4.8,
    reviewCount: 234,
    tags: ['matematik', '9.sınıf', 'cebir'],
    lastAuditDate: '2024-10-15',
    nextAuditDate: '2025-01-15',
  },
  {
    id: 'work-002',
    title: 'Fizik Deneme Sınavı - Newton Kanunları',
    contentType: 'exam',
    authorId: 'auth-002',
    authorName: 'Zeynep Kaya',
    royaltyType: 'external',
    createdDate: '2024-02-10',
    publishedDate: '2024-02-15',
    usageCount: 1234,
    baseRate: 12.0,
    totalEarnings: 14808,
    pendingEarnings: 2400,
    paidEarnings: 12408,
    status: 'approved',
    qualityScore: 4.6,
    reviewCount: 156,
    tags: ['fizik', 'newton', 'deneme'],
    lastAuditDate: '2024-11-01',
  },
  {
    id: 'work-003',
    title: 'İngilizce Grammar Video Serisi',
    contentType: 'video',
    authorId: 'auth-003',
    authorName: 'Mehmet Demir',
    royaltyType: 'remote',
    createdDate: '2024-03-05',
    publishedDate: '2024-03-12',
    usageCount: 876,
    baseRate: 25.0,
    totalEarnings: 21900,
    pendingEarnings: 3500,
    paidEarnings: 18400,
    status: 'approved',
    qualityScore: 4.9,
    reviewCount: 89,
    tags: ['ingilizce', 'grammar', 'video'],
    lastAuditDate: '2024-10-20',
    nextAuditDate: '2025-01-20',
  },
  {
    id: 'work-004',
    title: 'Kimya Sunum - Periyodik Tablo',
    contentType: 'presentation',
    authorId: 'auth-004',
    authorName: 'Ayşe Şahin',
    royaltyType: 'employee',
    createdDate: '2024-04-01',
    usageCount: 567,
    baseRate: 8.5,
    totalEarnings: 4819.5,
    pendingEarnings: 850,
    paidEarnings: 3969.5,
    status: 'pending',
    qualityScore: 4.7,
    reviewCount: 45,
    tags: ['kimya', 'periyodik tablo', 'sunum'],
  },
  {
    id: 'work-005',
    title: 'Tarih Makalesi - Osmanlı Dönemi',
    contentType: 'article',
    authorId: 'auth-005',
    authorName: 'Can Özkan',
    royaltyType: 'customer',
    createdDate: '2024-05-10',
    publishedDate: '2024-05-15',
    usageCount: 234,
    baseRate: 15.0,
    totalEarnings: 3510,
    pendingEarnings: 510,
    paidEarnings: 3000,
    status: 'approved',
    qualityScore: 4.3,
    reviewCount: 23,
    tags: ['tarih', 'osmanlı', 'makale'],
  },
];

export const demoRoyaltyPayments: RoyaltyPayment[] = [
  {
    id: 'pay-001',
    authorId: 'auth-001',
    authorName: 'Ahmet Yılmaz',
    royaltyType: 'employee',
    amount: 8500,
    currency: 'TRY',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    requestedDate: '2024-11-20',
    workIds: ['work-001'],
    taxDeducted: 1275,
    netAmount: 7225,
  },
  {
    id: 'pay-002',
    authorId: 'auth-002',
    authorName: 'Zeynep Kaya',
    royaltyType: 'external',
    amount: 12300,
    currency: 'TRY',
    paymentMethod: 'paypal',
    status: 'processing',
    requestedDate: '2024-11-15',
    approvedDate: '2024-11-18',
    workIds: ['work-002'],
    taxDeducted: 2460,
    netAmount: 9840,
  },
  {
    id: 'pay-003',
    authorId: 'auth-003',
    authorName: 'Mehmet Demir',
    royaltyType: 'remote',
    amount: 5600,
    currency: 'TRY',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    requestedDate: '2024-11-01',
    approvedDate: '2024-11-05',
    paidDate: '2024-11-10',
    transactionId: 'TXN-2024-001',
    workIds: ['work-003'],
    taxDeducted: 840,
    netAmount: 4760,
  },
  {
    id: 'pay-004',
    authorId: 'auth-004',
    authorName: 'Ayşe Şahin',
    royaltyType: 'employee',
    amount: 15200,
    currency: 'TRY',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    requestedDate: '2024-10-25',
    approvedDate: '2024-10-28',
    paidDate: '2024-11-02',
    transactionId: 'TXN-2024-002',
    workIds: ['work-004'],
    taxDeducted: 2280,
    netAmount: 12920,
  },
];

export const demoRoyaltyAudits: RoyaltyAudit[] = [
  {
    id: 'audit-001',
    auditType: 'internal',
    auditorName: 'Murat Çelik - İç Denetim',
    targetType: 'author',
    targetId: 'auth-001',
    targetName: 'Ahmet Yılmaz',
    scheduledDate: '2024-12-01',
    status: 'scheduled',
    findings: [],
    recommendations: [],
    riskLevel: 'low',
    issuesFound: 0,
    issuesResolved: 0,
    nextAuditDate: '2025-03-01',
  },
  {
    id: 'audit-002',
    auditType: 'external',
    auditorName: 'Bağımsız Denetim A.Ş.',
    targetType: 'payment',
    targetId: 'pay-003',
    targetName: 'Mehmet Demir - Ödeme',
    scheduledDate: '2024-11-10',
    completedDate: '2024-11-15',
    status: 'completed',
    findings: [
      'Ödeme süreçleri kurallara uygun',
      'Vergi kesintileri doğru hesaplanmış',
      'Belgeler eksiksiz',
    ],
    recommendations: [
      'Dijital imza sistemine geçiş önerilir',
    ],
    riskLevel: 'low',
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: 'audit-003',
    auditType: 'quality',
    auditorName: 'Elif Yıldırım - Kalite Kontrol',
    targetType: 'work',
    targetId: 'work-002',
    targetName: 'Fizik Deneme Sınavı',
    scheduledDate: '2024-11-05',
    completedDate: '2024-11-08',
    status: 'completed',
    findings: [
      'İçerik kalitesi standartlara uygun',
      '2 soruda küçük düzeltme gerekiyor',
    ],
    recommendations: [
      'Sorular güncellenmelidir',
      'Daha fazla görsel içerik eklenebilir',
    ],
    riskLevel: 'medium',
    issuesFound: 2,
    issuesResolved: 2,
  },
  {
    id: 'audit-004',
    auditType: 'compliance',
    auditorName: 'Hukuk Departmanı',
    targetType: 'system',
    scheduledDate: '2024-10-01',
    completedDate: '2024-10-15',
    status: 'completed',
    findings: [
      'KVKK uyumluluğu sağlanmış',
      'Telif hakları sözleşmeleri güncel',
      '3 eski sözleşme yenilenmelidir',
    ],
    recommendations: [
      'Sözleşme şablonları güncellenmeli',
      'Otomatik hatırlatma sistemi kurulmalı',
    ],
    riskLevel: 'medium',
    issuesFound: 3,
    issuesResolved: 1,
  },
];

export const demoRoyaltyContracts: RoyaltyContract[] = [
  {
    id: 'contract-001',
    authorId: 'auth-001',
    authorName: 'Ahmet Yılmaz',
    type: 'work_for_hire',
    royaltyType: 'employee',
    startDate: '2022-01-15',
    baseRate: 5.5,
    bonusRate: 1.0,
    minimumGuarantee: 3000,
    exclusivityClause: true,
    territories: ['Turkey'],
    contentTypes: ['question', 'exam'],
    paymentTerms: 'Aylık ödeme, her ayın 15\'inde',
    status: 'active',
    signedDate: '2022-01-10',
  },
  {
    id: 'contract-002',
    authorId: 'auth-002',
    authorName: 'Zeynep Kaya',
    type: 'revenue_share',
    royaltyType: 'external',
    startDate: '2021-06-20',
    endDate: '2025-06-20',
    baseRate: 12.0,
    exclusivityClause: false,
    territories: ['Turkey', 'TRNC'],
    contentTypes: ['question', 'exam', 'presentation'],
    paymentTerms: '%60 yazar, %40 platform paylaşımı',
    status: 'active',
    signedDate: '2021-06-15',
  },
  {
    id: 'contract-003',
    authorId: 'auth-003',
    authorName: 'Mehmet Demir',
    type: 'non_exclusive',
    royaltyType: 'remote',
    startDate: '2023-03-10',
    baseRate: 25.0,
    exclusivityClause: false,
    territories: ['Global'],
    contentTypes: ['video', 'course'],
    paymentTerms: 'Kullanım başına ödeme, 3 ayda bir',
    status: 'active',
    signedDate: '2023-03-05',
  },
];

export const demoRoyaltyDisputes: RoyaltyDispute[] = [
  {
    id: 'dispute-001',
    workId: 'work-002',
    workTitle: 'Fizik Deneme Sınavı',
    authorId: 'auth-002',
    authorName: 'Zeynep Kaya',
    disputeType: 'payment',
    description: 'Ekim ayı ödemesinde eksiklik var, hesaplanan 12,300 TL olmalı ama 10,800 TL gösteriliyor',
    filedDate: '2024-11-10',
    status: 'investigating',
    priority: 'high',
    assignedTo: 'Finans Departmanı',
  },
  {
    id: 'dispute-002',
    workId: 'work-004',
    workTitle: 'Kimya Sunum',
    authorId: 'auth-004',
    authorName: 'Ayşe Şahin',
    disputeType: 'usage',
    description: 'Kullanım sayısı gerçek değeri yansıtmıyor gibi görünüyor',
    filedDate: '2024-11-15',
    resolvedDate: '2024-11-20',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'Teknik Destek',
    resolution: 'Sistem hatası tespit edildi ve düzeltildi. Eksik sayımlar eklendi.',
  },
];

export const demoRoyaltyReport: RoyaltyReport = {
  id: 'report-2024-11',
  reportType: 'monthly',
  period: '2024-11',
  generatedDate: '2024-11-28',
  totalRevenue: 245000,
  totalRoyaltiesPaid: 86500,
  totalAuthors: 6,
  totalWorks: 5,
  topAuthors: [
    { authorId: 'auth-004', name: 'Ayşe Şahin', earnings: 15200 },
    { authorId: 'auth-002', name: 'Zeynep Kaya', earnings: 12300 },
    { authorId: 'auth-001', name: 'Ahmet Yılmaz', earnings: 8500 },
  ],
  topWorks: [
    { workId: 'work-003', title: 'İngilizce Grammar Video', earnings: 21900 },
    { workId: 'work-001', title: 'Matematik Soru Seti', earnings: 19008 },
    { workId: 'work-002', title: 'Fizik Deneme', earnings: 14808 },
  ],
  byRoyaltyType: {
    employee: { count: 2, amount: 23700 },
    external: { count: 1, amount: 12300 },
    remote: { count: 2, amount: 14500 },
    customer: { count: 1, amount: 3510 },
    internal: { count: 0, amount: 0 },
  },
  byContentType: {
    question: { count: 1, amount: 19008 },
    exam: { count: 1, amount: 14808 },
    video: { count: 1, amount: 21900 },
    presentation: { count: 1, amount: 4819 },
    article: { count: 1, amount: 3510 },
    course: { count: 0, amount: 0 },
    document: { count: 0, amount: 0 },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAuthorsByType(type: RoyaltyType): Author[] {
  return demoAuthors.filter((author) => author.type === type);
}

export function getWorksByAuthor(authorId: string): RoyaltyWork[] {
  return demoRoyaltyWorks.filter((work) => work.authorId === authorId);
}

export function getPaymentsByAuthor(authorId: string): RoyaltyPayment[] {
  return demoRoyaltyPayments.filter((payment) => payment.authorId === authorId);
}

export function getAuditsByType(auditType: RoyaltyAudit['auditType']): RoyaltyAudit[] {
  return demoRoyaltyAudits.filter((audit) => audit.auditType === auditType);
}

export function getDisputesByStatus(status: RoyaltyDispute['status']): RoyaltyDispute[] {
  return demoRoyaltyDisputes.filter((dispute) => dispute.status === status);
}

export function getTotalPendingPayments(): number {
  return demoRoyaltyPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
}

export function getTotalEarningsByType(): Record<RoyaltyType, number> {
  const result: Record<RoyaltyType, number> = {
    employee: 0,
    external: 0,
    remote: 0,
    customer: 0,
    internal: 0,
  };

  demoAuthors.forEach((author) => {
    result[author.type] += author.totalEarnings;
  });

  return result;
}

export function getAuditSummary() {
  const total = demoRoyaltyAudits.length;
  const completed = demoRoyaltyAudits.filter((a) => a.status === 'completed').length;
  const inProgress = demoRoyaltyAudits.filter((a) => a.status === 'in_progress').length;
  const scheduled = demoRoyaltyAudits.filter((a) => a.status === 'scheduled').length;
  const issuesFound = demoRoyaltyAudits.reduce((sum, a) => sum + a.issuesFound, 0);
  const issuesResolved = demoRoyaltyAudits.reduce((sum, a) => sum + a.issuesResolved, 0);

  return {
    total,
    completed,
    inProgress,
    scheduled,
    issuesFound,
    issuesResolved,
    complianceRate: issuesFound > 0 ? ((issuesResolved / issuesFound) * 100).toFixed(1) : '100',
  };
}

