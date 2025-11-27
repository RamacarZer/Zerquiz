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

