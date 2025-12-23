import { useState, useEffect } from 'react';

// Types
export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  completedPayments: number;
  pendingPayments: number;
  activeSubscriptions: number;
  avgRevenuePerUser: number;
  monthlyGrowth: number;
}

export interface CashAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'main' | 'bank' | 'branch';
  lastUpdate: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
}

export interface Budget {
  id: string;
  department: string;
  allocated: number;
  used: number;
  variance: number;
  period: string;
}

export interface PerDiemRequest {
  id: string;
  employee: string;
  destination: string;
  purpose: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type: 'invoice' | 'proforma';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface Subscription {
  id: string;
  planName: string;
  tenantName: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
}

export interface PaymentGateway {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  successRate: string;
  uptime: string;
  issues: string[];
}

// Mock Data
const mockFinancialSummary: FinancialSummary = {
  totalRevenue: 486750,
  totalExpenses: 312400,
  netProfit: 174350,
  completedPayments: 247,
  pendingPayments: 18,
  activeSubscriptions: 142,
  avgRevenuePerUser: 3427,
  monthlyGrowth: 12.4,
};

const mockCashAccounts: CashAccount[] = [
  { id: '1', name: 'Ana Kasa', balance: 125000, currency: 'TRY', type: 'main', lastUpdate: '2024-01-15' },
  { id: '2', name: 'Banka Hesabı (İş Bankası)', balance: 450000, currency: 'TRY', type: 'bank', lastUpdate: '2024-01-15' },
  { id: '3', name: 'Şube Kasası - Ankara', balance: 35000, currency: 'TRY', type: 'branch', lastUpdate: '2024-01-14' },
  { id: '4', name: 'Dolar Hesabı', balance: 15000, currency: 'USD', type: 'bank', lastUpdate: '2024-01-15' },
];

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', category: 'Abonelik Gelirleri', amount: 45000, description: 'Aylık abonelik ödemeleri', date: '2024-01-15', reference: 'SUB-2024-001' },
  { id: '2', type: 'expense', category: 'Personel Maaşları', amount: 125000, description: 'Ocak ayı maaş ödemeleri', date: '2024-01-10', reference: 'SAL-2024-001' },
  { id: '3', type: 'income', category: 'Sınav Ücretleri', amount: 12500, description: 'Sınav kayıt ücretleri', date: '2024-01-12', reference: 'EXM-2024-015' },
  { id: '4', type: 'expense', category: 'Kira', amount: 25000, description: 'Ofis kira ödemesi', date: '2024-01-05', reference: 'RENT-2024-001' },
  { id: '5', type: 'expense', category: 'Yazılım Lisansları', amount: 8500, description: 'SaaS araçları aylık ödemesi', date: '2024-01-08', reference: 'LIC-2024-001' },
];

const mockBudgets: Budget[] = [
  { id: '1', department: 'Teknoloji', allocated: 150000, used: 132000, variance: -18000, period: '2024-Q1' },
  { id: '2', department: 'Pazarlama', allocated: 75000, used: 68500, variance: -6500, period: '2024-Q1' },
  { id: '3', department: 'İnsan Kaynakları', allocated: 180000, used: 175000, variance: -5000, period: '2024-Q1' },
  { id: '4', department: 'Operasyon', allocated: 100000, used: 95000, variance: -5000, period: '2024-Q1' },
];

const mockPerDiemRequests: PerDiemRequest[] = [
  { id: '1', employee: 'Ahmet Yılmaz', destination: 'İstanbul', purpose: 'Müşteri Görüşmesi', amount: 2500, status: 'approved', submittedAt: '2024-01-10' },
  { id: '2', employee: 'Ayşe Demir', destination: 'İzmir', purpose: 'Konferans Katılımı', amount: 3500, status: 'pending', submittedAt: '2024-01-12' },
  { id: '3', employee: 'Mehmet Kaya', destination: 'Antalya', purpose: 'Eğitim Semineri', amount: 4000, status: 'pending', submittedAt: '2024-01-13' },
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    tenantName: 'Acme School',
    amount: 1250.00,
    currency: 'TRY',
    status: 'paid',
    type: 'invoice',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    paidDate: '2024-01-15',
    items: [
      { description: 'Premium Paket - Aylık Abonelik', quantity: 1, unitPrice: 1000, total: 1000 },
      { description: 'Ek Kullanıcı (x5)', quantity: 5, unitPrice: 50, total: 250 },
    ],
  },
  {
    id: '2',
    invoiceNumber: 'PRF-2024-001',
    tenantName: 'Tech University',
    amount: 2500.00,
    currency: 'TRY',
    status: 'pending',
    type: 'proforma',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    items: [
      { description: 'Enterprise Paket - Aylık Abonelik', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    planName: 'Enterprise',
    tenantName: 'Acme Corp',
    amount: 2500,
    currency: 'TRY',
    billingCycle: 'monthly',
    status: 'active',
    startDate: '2023-06-01',
    nextBillingDate: '2024-02-01',
    autoRenew: true,
  },
  {
    id: '2',
    planName: 'Professional',
    tenantName: 'Tech Solutions',
    amount: 990,
    currency: 'TRY',
    billingCycle: 'yearly',
    status: 'active',
    startDate: '2023-09-01',
    nextBillingDate: '2024-09-01',
    autoRenew: true,
  },
];

const mockPaymentGateways: PaymentGateway[] = [
  { id: '1', name: 'Stripe', status: 'operational', successRate: '99.7%', uptime: '99.99%', issues: [] },
  { id: '2', name: 'PayPal', status: 'operational', successRate: '98.9%', uptime: '99.95%', issues: [] },
  { id: '3', name: 'İyzico', status: 'degraded', successRate: '96.5%', uptime: '98.2%', issues: ['Yavaş yanıt süreleri'] },
  { id: '4', name: 'Banka Havale/EFT', status: 'operational', successRate: '100%', uptime: '100%', issues: [] },
];

export function useFinanceData() {
  const [loading, setLoading] = useState(false);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(mockFinancialSummary);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(mockCashAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [perDiemRequests, setPerDiemRequests] = useState<PerDiemRequest[]>(mockPerDiemRequests);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(mockPaymentGateways);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    financialSummary,
    cashAccounts,
    transactions,
    budgets,
    perDiemRequests,
    invoices,
    subscriptions,
    paymentGateways,
    setPerDiemRequests,
    refreshData: fetchData,
  };
}

