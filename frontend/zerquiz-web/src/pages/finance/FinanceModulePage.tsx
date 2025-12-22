import React, { useState, useEffect, useMemo } from 'react';
import { toast } from '@/components/common/Alert';
import Tabs from '@/components/common/Tabs';
import Button from '@/components/common/Button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  FileText,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PieChart,
  Briefcase,
  Plane,
  Check,
  X,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Users,
  BookOpen,
  Receipt,
  Building,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

// Types
interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  completedPayments: number;
  pendingPayments: number;
  activeSubscriptions: number;
  avgRevenuePerUser: number;
  monthlyGrowth: number;
}

interface CashAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'main' | 'bank' | 'branch';
  lastUpdate: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
}

interface Budget {
  id: string;
  department: string;
  allocated: number;
  used: number;
  variance: number;
  period: string;
}

interface PerDiemRequest {
  id: string;
  employee: string;
  destination: string;
  purpose: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
}

interface Invoice {
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

interface Subscription {
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

interface PaymentGateway {
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
  {
    id: '3',
    invoiceNumber: 'INV-2024-002',
    tenantName: 'Global Academy',
    amount: 800.00,
    currency: 'TRY',
    status: 'overdue',
    type: 'invoice',
    issueDate: '2023-12-15',
    dueDate: '2024-01-15',
    items: [
      { description: 'Basic Paket - Aylık Abonelik', quantity: 1, unitPrice: 800, total: 800 },
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
  {
    id: '3',
    planName: 'Starter',
    tenantName: 'Small School',
    amount: 290,
    currency: 'TRY',
    billingCycle: 'monthly',
    status: 'cancelled',
    startDate: '2023-11-01',
    nextBillingDate: '2024-01-01',
    autoRenew: false,
  },
];

const mockPaymentGateways: PaymentGateway[] = [
  { id: '1', name: 'Stripe', status: 'operational', successRate: '99.7%', uptime: '99.99%', issues: [] },
  { id: '2', name: 'PayPal', status: 'operational', successRate: '98.9%', uptime: '99.95%', issues: [] },
  { id: '3', name: 'İyzico', status: 'degraded', successRate: '96.5%', uptime: '98.2%', issues: ['Yavaş yanıt süreleri'] },
  { id: '4', name: 'Banka Havale/EFT', status: 'operational', successRate: '100%', uptime: '100%', issues: [] },
];

export default function FinanceModulePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // State for filters
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [perDiemFilter, setPerDiemFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<'all' | 'invoice' | 'proforma'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'active' | 'cancelled' | 'expired'>('all');

  // Data state
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(mockFinancialSummary);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(mockCashAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [perDiemRequests, setPerDiemRequests] = useState<PerDiemRequest[]>(mockPerDiemRequests);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(mockPaymentGateways);

  // Fetch data
  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Finans verileri yüklendi');
    } catch (error) {
      toast.error('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return transactions;
    return transactions.filter(t => t.type === transactionFilter);
  }, [transactions, transactionFilter]);

  const filteredPerDiems = useMemo(() => {
    if (perDiemFilter === 'all') return perDiemRequests;
    return perDiemRequests.filter(p => p.status === perDiemFilter);
  }, [perDiemRequests, perDiemFilter]);

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (invoiceFilter !== 'all') {
      result = result.filter(inv => inv.status === invoiceFilter);
    }
    if (invoiceTypeFilter !== 'all') {
      result = result.filter(inv => inv.type === invoiceTypeFilter);
    }
    return result;
  }, [invoices, invoiceFilter, invoiceTypeFilter]);

  const filteredSubscriptions = useMemo(() => {
    if (subscriptionFilter === 'all') return subscriptions;
    return subscriptions.filter(s => s.status === subscriptionFilter);
  }, [subscriptions, subscriptionFilter]);

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: t('overview') || 'Genel Bakış' },
    { id: 'cash', label: t('cash_management') || 'Kasa Yönetimi' },
    { id: 'transactions', label: t('transactions') || 'İşlemler' },
    { id: 'budgets', label: t('budgets') || 'Bütçeler' },
    { id: 'perdiem', label: t('per_diem') || 'Harcırahlar' },
    { id: 'invoices', label: t('invoices') || 'Faturalar' },
    { id: 'subscriptions', label: t('subscriptions') || 'Abonelikler' },
    { id: 'payment-gateways', label: t('payment_gateways') || 'Ödeme Sistemleri' },
  ], [t]);

  // Handlers
  const handleApprovePerDiem = async (id: string) => {
    try {
      setPerDiemRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
      toast.success('Harcırah talebi onaylandı');
    } catch (error) {
      toast.error('Onaylama sırasında hata oluştu');
    }
  };

  const handleRejectPerDiem = async (id: string) => {
    try {
      setPerDiemRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
      toast.success('Harcırah talebi reddedildi');
    } catch (error) {
      toast.error('Reddetme sırasında hata oluştu');
    }
  };

  const handleExportReport = () => {
    toast.info('Rapor hazırlanıyor...');
    setTimeout(() => {
      toast.success('Rapor başarıyla indirildi');
    }, 1500);
  };

  // Status badge components
  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      paid: { label: 'Ödendi', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      overdue: { label: 'Gecikmiş', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
      cancelled: { label: 'İptal', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
      active: { label: 'Aktif', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      expired: { label: 'Süresi Dolmuş', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
      approved: { label: 'Onaylandı', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    const config = configs[status] || { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('finance_management') || 'Mali Yönetim'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Profesyonel finans takip ve yönetim sistemi</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportReport} variant="secondary" className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              {t('export_report') || 'Rapor İndir'}
            </Button>
            <Button onClick={fetchFinanceData} variant="primary" className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              {t('refresh') || 'Yenile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Toplam Gelir</p>
                  <p className="text-4xl font-bold mt-2">{financialSummary.totalRevenue.toLocaleString()} ₺</p>
                </div>
                <DollarSign className="w-12 h-12 text-emerald-200" />
              </div>
              <div className="flex items-center gap-2 text-emerald-100">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{financialSummary.monthlyGrowth}% bu ay</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Net Kar</p>
                  <p className="text-4xl font-bold mt-2">{financialSummary.netProfit.toLocaleString()} ₺</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-200" />
              </div>
              <p className="text-blue-100 text-sm">Gider: {financialSummary.totalExpenses.toLocaleString()} ₺</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Tamamlanan Ödeme</p>
                  <p className="text-4xl font-bold mt-2">{financialSummary.completedPayments}</p>
                </div>
                <CreditCard className="w-12 h-12 text-purple-200" />
              </div>
              <p className="text-purple-100 text-sm">Bekleyen: {financialSummary.pendingPayments}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Kullanıcı Başına Ort.</p>
                  <p className="text-4xl font-bold mt-2">{financialSummary.avgRevenuePerUser.toLocaleString()} ₺</p>
                </div>
                <Users className="w-12 h-12 text-orange-200" />
              </div>
              <p className="text-orange-100 text-sm">{financialSummary.activeSubscriptions} aktif abonelik</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Toplam Nakit</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {cashAccounts.filter(a => a.currency === 'TRY').reduce((sum, a) => sum + a.balance, 0).toLocaleString()} ₺
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{cashAccounts.length} kasa hesabı</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Faturalar</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Ödendi: {invoices.filter(i => i.status === 'paid').length}</span>
                <span>Bekliyor: {invoices.filter(i => i.status === 'pending').length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Abonelikler</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{subscriptions.filter(s => s.status === 'active').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Toplam: {subscriptions.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Management Tab */}
      {activeTab === 'cash' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Wallet className="w-8 h-8 text-indigo-600" />
              Kasa Yönetimi
            </h2>
            <Button onClick={() => toast.info('Yeni kasa ekle özelliği yakında...')} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Kasa Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cashAccounts.map((account) => (
              <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.type === 'main' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                    account.type === 'bank' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {account.type === 'main' ? 'Ana Kasa' : account.type === 'bank' ? 'Banka' : 'Şube'}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{account.name}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {account.balance.toLocaleString()} {account.currency}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Son Güncelleme: {new Date(account.lastUpdate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              Gelir/Gider İşlemleri
            </h2>
            <div className="flex gap-3">
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="income">Gelir</option>
                <option value="expense">Gider</option>
              </select>
              <Button onClick={() => toast.info('Yeni işlem ekle özelliği yakında...')} className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni İşlem
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.description}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{transaction.category}</span>
                      {transaction.reference && <span>• Ref: {transaction.reference}</span>}
                      <span>• {new Date(transaction.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <PieChart className="w-8 h-8 text-purple-600" />
              Bütçe Yönetimi
            </h2>
            <Button onClick={() => toast.info('Bütçe ayarları özelliği yakında...')} className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Bütçe Ayarları
            </Button>
          </div>

          <div className="space-y-6">
            {budgets.map((budget) => {
              const usagePercent = (budget.used / budget.allocated) * 100;
              return (
                <div key={budget.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{budget.department}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{budget.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {budget.used.toLocaleString()} / {budget.allocated.toLocaleString()} ₺
                      </p>
                      <p className={`text-sm font-medium ${
                        budget.variance < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        Sapma: {budget.variance.toLocaleString()} ₺
                      </p>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        usagePercent > 90 ? 'bg-red-500' : usagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Kullanım: {usagePercent.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per Diem Tab */}
      {activeTab === 'perdiem' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              Harcırah Talepleri
            </h2>
            <div className="flex gap-3">
              {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setPerDiemFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    perDiemFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : status === 'approved' ? 'Onaylı' : status === 'pending' ? 'Bekleyen' : 'Reddedildi'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPerDiems.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.employee}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>📍 {request.destination}</span>
                    <span>• {request.purpose}</span>
                    <span>• {new Date(request.submittedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{request.amount.toLocaleString()} ₺</p>
                    <div className="mt-2">{getStatusBadge(request.status)}</div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePerDiem(request.id)}
                        className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectPerDiem(request.id)}
                        className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Faturalar
            </h2>
            <div className="flex gap-3">
              <select
                value={invoiceTypeFilter}
                onChange={(e) => setInvoiceTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Tipler</option>
                <option value="invoice">Fatura</option>
                <option value="proforma">Proforma</option>
              </select>
              <select
                value={invoiceFilter}
                onChange={(e) => setInvoiceFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="paid">Ödendi</option>
                <option value="pending">Bekliyor</option>
                <option value="overdue">Gecikmiş</option>
              </select>
              <Button onClick={() => toast.info('Yeni fatura oluştur özelliği yakında...')} className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni Fatura
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</h3>
                      {getStatusBadge(invoice.status)}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        invoice.type === 'invoice' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {invoice.type === 'invoice' ? 'Fatura' : 'Proforma'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{invoice.tenantName}</p>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>Düzenleme: {new Date(invoice.issueDate).toLocaleDateString('tr-TR')}</span>
                      <span>Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}</span>
                      {invoice.paidDate && <span>Ödeme: {new Date(invoice.paidDate).toLocaleDateString('tr-TR')}</span>}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {invoice.amount.toFixed(2)} {invoice.currency}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kalemler:</h4>
                  <div className="space-y-2">
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.description} (x{item.quantity})
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.total.toFixed(2)} {invoice.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF İndir
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    E-posta Gönder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              Abonelik Yönetimi
            </h2>
            <div className="flex gap-3">
              {(['all', 'active', 'cancelled', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSubscriptionFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : status === 'active' ? 'Aktif' : status === 'cancelled' ? 'İptal' : 'Süresi Dolmuş'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubscriptions.map((subscription) => (
              <div key={subscription.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{subscription.planName}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{subscription.tenantName}</p>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tutar:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {subscription.amount} {subscription.currency} / {subscription.billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Başlangıç:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(subscription.startDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sonraki Fatura:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(subscription.nextBillingDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Otomatik Yenileme:</span>
                    <span className={`font-semibold ${subscription.autoRenew ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {subscription.autoRenew ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Button>
                  {subscription.status === 'active' && (
                    <Button variant="danger" className="flex-1 flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      İptal
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Gateways Tab */}
      {activeTab === 'payment-gateways' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-indigo-600" />
              Ödeme Sistemleri
            </h2>
            <Button onClick={() => toast.info('Ödeme sistemi ayarları özelliği yakında...')} className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Ayarlar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentGateways.map((gateway) => (
              <div key={gateway.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{gateway.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    gateway.status === 'operational' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    gateway.status === 'degraded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {gateway.status === 'operational' ? 'Çalışıyor' : gateway.status === 'degraded' ? 'Yavaş' : 'Sorunlu'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Başarı Oranı:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{gateway.successRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{gateway.uptime}</span>
                  </div>
                </div>

                {gateway.issues.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Sorunlar:</span>
                    </div>
                    <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                      {gateway.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button variant="secondary" className="w-full mt-4 flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Yapılandır
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

