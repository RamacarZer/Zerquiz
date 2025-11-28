import { generateUUID } from '../lib/mockStorage';
import { demoResults } from './gradingDemoData';

// ==================== FİNANS VERİLERİ ====================

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  paidBy: string;
  transactionId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Revenue {
  period: string; // YYYY-MM
  totalRevenue: number;
  subscriptionRevenue: number;
  examRevenue: number;
  certificateRevenue: number;
  otherRevenue: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeSubscriptions: number;
  pendingPayments: number;
  completedPayments: number;
  refundedAmount: number;
  avgRevenuePerUser: number;
}

export interface CashAccount {
  id: string;
  name: string;
  type: 'main' | 'petty' | 'bank';
  currency: string;
  balance: number;
  lastUpdate: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  budget: number;
  trend: number;
}

export interface BudgetItem {
  id: string;
  department: string;
  allocated: number;
  used: number;
  variance: number;
}

export interface PerDiemRequest {
  id: string;
  employee: string;
  destination: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  purpose: string;
}

export interface FinanceInvoiceRecord {
  id: string;
  type: 'invoice' | 'proforma';
  customer: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface PaymentGatewayStatus {
  id: string;
  name: string;
  uptime: string;
  successRate: string;
  status: 'operational' | 'degraded' | 'down';
  issues: string[];
}

// ==================== DEMO ÖDEMELER ====================

function generateDemoPayments(): Payment[] {
  const payments: Payment[] = [];
  const methods: Payment['method'][] = ['credit_card', 'bank_transfer', 'paypal', 'stripe'];
  const statuses: Payment['status'][] = ['completed', 'pending', 'failed'];
  
  for (let i = 0; i < 50; i++) {
    const amount = [299, 799, 2499, 99, 199][Math.floor(Math.random() * 5)];
    const daysAgo = Math.floor(Math.random() * 90);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    payments.push({
      id: generateUUID(),
      invoiceId: `INV-2025-${String(1000 + i).padStart(4, '0')}`,
      amount,
      currency: 'TRY',
      method: methods[Math.floor(Math.random() * methods.length)],
      status,
      paidAt: status === 'completed' ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString() : undefined,
      paidBy: ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya'][Math.floor(Math.random() * 3)],
      transactionId: `TXN-${Date.now()}-${i}`,
      description: amount === 299 ? 'Temel Paket' : amount === 799 ? 'Pro Paket' : amount === 2499 ? 'Kurumsal Paket' : 'Ek Hizmet',
    });
  }
  
  return payments.sort((a, b) => {
    const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
    const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
    return dateB - dateA;
  });
}

export const demoPayments = generateDemoPayments();

// ==================== GELİR VERİLERİ ====================

function generateRevenueData(): Revenue[] {
  const revenues: Revenue[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    revenues.push({
      period,
      totalRevenue: Math.floor(Math.random() * 50000) + 30000,
      subscriptionRevenue: Math.floor(Math.random() * 30000) + 20000,
      examRevenue: Math.floor(Math.random() * 10000) + 5000,
      certificateRevenue: Math.floor(Math.random() * 5000) + 2000,
      otherRevenue: Math.floor(Math.random() * 5000) + 3000,
    });
  }
  
  return revenues;
}

export const revenueData = generateRevenueData();

export const cashAccounts: CashAccount[] = [
  {
    id: 'cash-1',
    name: 'Ana Kasa',
    type: 'main',
    currency: 'TRY',
    balance: 186500,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'cash-2',
    name: 'USD Banka Hesabı',
    type: 'bank',
    currency: 'USD',
    balance: 42500,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'cash-3',
    name: 'Şube Kasa',
    type: 'petty',
    currency: 'TRY',
    balance: 18500,
    lastUpdate: new Date().toISOString(),
  },
];

export const expenseCategories: ExpenseCategory[] = [
  { id: 'exp-1', name: 'Eğitim Hizmet Geliri', type: 'income', amount: 425000, budget: 400000, trend: 8 },
  { id: 'exp-2', name: 'Lisans Geliri', type: 'income', amount: 155000, budget: 150000, trend: 5 },
  { id: 'exp-3', name: 'Personel Gideri', type: 'expense', amount: 180000, budget: 175000, trend: -3 },
  { id: 'exp-4', name: 'Altyapı & Depolama', type: 'expense', amount: 95000, budget: 100000, trend: 2 },
  { id: 'exp-5', name: 'Pazarlama', type: 'expense', amount: 65000, budget: 80000, trend: 4 },
];

export const budgetItems: BudgetItem[] = [
  { id: 'bud-1', department: 'Akademik', allocated: 150000, used: 120000, variance: 30000 },
  { id: 'bud-2', department: 'Teknoloji', allocated: 200000, used: 185000, variance: 15000 },
  { id: 'bud-3', department: 'Satış & Pazarlama', allocated: 100000, used: 92000, variance: 8000 },
  { id: 'bud-4', department: 'Operasyon', allocated: 85000, used: 77000, variance: 8000 },
];

export const perDiemRequests: PerDiemRequest[] = [
  {
    id: 'prd-1',
    employee: 'Zeynep Kaya',
    destination: 'Ankara',
    amount: 4200,
    status: 'approved',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    purpose: 'MEB protokol toplantısı',
  },
  {
    id: 'prd-2',
    employee: 'Ahmet Demir',
    destination: 'İzmir',
    amount: 3100,
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    purpose: 'Eğitimci eğitimi',
  },
  {
    id: 'prd-3',
    employee: 'Ayşe Karaca',
    destination: 'Bursa',
    amount: 1850,
    status: 'rejected',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    purpose: 'Seminer katılımı',
  },
];

export const financeInvoices: FinanceInvoiceRecord[] = [
  {
    id: 'finv-1',
    type: 'invoice',
    customer: 'ABC Koleji',
    amount: 24500,
    currency: 'TRY',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'finv-2',
    type: 'proforma',
    customer: 'Demo Okul',
    amount: 7990,
    currency: 'TRY',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'finv-3',
    type: 'invoice',
    customer: 'Üniversite X',
    amount: 125000,
    currency: 'TRY',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'overdue',
  },
];

export const paymentGateways: PaymentGatewayStatus[] = [
  {
    id: 'pgw-1',
    name: 'iyzico',
    uptime: '99.98%',
    successRate: '97.5%',
    status: 'operational',
    issues: [],
  },
  {
    id: 'pgw-2',
    name: 'Stripe Global',
    uptime: '99.90%',
    successRate: '98.8%',
    status: 'operational',
    issues: ['USD ödemelerde gecikme'],
  },
  {
    id: 'pgw-3',
    name: 'PayPal',
    uptime: '99.10%',
    successRate: '95.2%',
    status: 'degraded',
    issues: ['Bazı kullanıcılar doğrulama problemi yaşıyor'],
  },
];

// ==================== FİNANSAL ÖZET ====================

export function getFinancialSummary(): FinancialSummary {
  const completedPayments = demoPayments.filter(p => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = demoPayments.filter(p => p.status === 'pending').length;
  const refundedPayments = demoPayments.filter(p => p.status === 'refunded');
  const refundedAmount = refundedPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const totalExpenses = totalRevenue * 0.3; // 30% gider varsayımı
  const netProfit = totalRevenue - totalExpenses;
  const avgRevenuePerUser = Math.round(totalRevenue / 50); // 50 kullanıcı varsayımı
  
  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    activeSubscriptions: 25,
    pendingPayments: pendingCount,
    completedPayments: completedPayments.length,
    refundedAmount,
    avgRevenuePerUser,
  };
}

// ==================== HELPER FONKSİYONLAR ====================

export function getPaymentsByStatus(status: Payment['status']): Payment[] {
  return demoPayments.filter(p => p.status === status);
}

export function getPaymentsByMethod(method: Payment['method']): Payment[] {
  return demoPayments.filter(p => p.method === method);
}

export function getRecentRevenue(months: number = 6): Revenue[] {
  return revenueData.slice(-months);
}

export function getTotalRevenueByPeriod(startPeriod: string, endPeriod: string): number {
  return revenueData
    .filter(r => r.period >= startPeriod && r.period <= endPeriod)
    .reduce((sum, r) => sum + r.totalRevenue, 0);
}

export function getRevenueGrowth(): { current: number; previous: number; growth: number } {
  const current = revenueData[revenueData.length - 1]?.totalRevenue || 0;
  const previous = revenueData[revenueData.length - 2]?.totalRevenue || 0;
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  
  return { current, previous, growth: Math.round(growth) };
}

