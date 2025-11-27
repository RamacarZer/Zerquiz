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

