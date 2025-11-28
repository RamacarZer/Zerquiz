import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import {
  demoPayments,
  revenueData,
  getFinancialSummary,
  getRevenueGrowth,
  type Payment,
  cashAccounts,
  expenseCategories,
  budgetItems,
  perDiemRequests,
  financeInvoices,
  paymentGateways,
} from '../../mocks/financeData';

type ActiveTab = 'overview' | 'cash' | 'income-expense' | 'budget' | 'perdiem' | 'invoices' | 'proforma' | 'payments';

export default function AdvancedFinancePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | Payment['status']>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [perDiemFilter, setPerDiemFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'invoice' | 'proforma'>('all');

  const summaryRef = useRef<HTMLDivElement>(null);
  const cashRef = useRef<HTMLDivElement>(null);
  const incomeExpenseRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const perdiemRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // URL'e göre aktif sekmeyi belirle ve scroll yap
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const tabMap: Record<string, { tab: ActiveTab; ref: React.RefObject<HTMLDivElement> }> = {
      'overview': { tab: 'overview', ref: summaryRef },
      'advanced': { tab: 'overview', ref: summaryRef },
      'cash': { tab: 'cash', ref: cashRef },
      'income-expense': { tab: 'income-expense', ref: incomeExpenseRef },
      'budget': { tab: 'budget', ref: budgetRef },
      'perdiem': { tab: 'perdiem', ref: perdiemRef },
      'invoices': { tab: 'invoices', ref: invoiceRef },
      'proforma': { tab: 'proforma', ref: invoiceRef },
      'payments': { tab: 'payments', ref: paymentsRef },
    };

    if (path && tabMap[path]) {
      setActiveTab(tabMap[path].tab);
      setTimeout(() => {
        tabMap[path].ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.pathname]);
  
  const summary = getFinancialSummary();
  const growth = getRevenueGrowth();
  
  const filteredPayments = filterStatus === 'all' 
    ? demoPayments 
    : demoPayments.filter(p => p.status === filterStatus);

  const displayRevenue = selectedPeriod === '6months' 
    ? revenueData.slice(-6) 
    : revenueData;

  const filteredPerDiems = perDiemFilter === 'all'
    ? perDiemRequests
    : perDiemRequests.filter((req) => req.status === perDiemFilter);

  const filteredFinanceInvoices = invoiceFilter === 'all'
    ? financeInvoices
    : financeInvoices.filter((inv) => inv.type === invoiceFilter);

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">✓ Tamamlandı</span>;
      case 'pending':
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">⏳ Beklemede</span>;
      case 'failed':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">✗ Başarısız</span>;
      case 'refunded':
        return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">↩ İade</span>;
    }
  };

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'paypal': return '🅿️';
      case 'stripe': return '💰';
    }
  };

  const getGatewayBadge = (status: typeof paymentGateways[number]['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-700';
      case 'down':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mali Yönetim</h1>
                <p className="text-sm text-gray-600">Kapsamlı finansal takip ve yönetim</p>
              </div>
            </div>

            <button
              onClick={() => alert('Rapor indiriliyor...')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              <Download className="h-4 w-4" />
              Rapor İndir
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: '📊', ref: summaryRef },
              { id: 'cash', label: 'Kasa', icon: '💵', ref: cashRef },
              { id: 'income-expense', label: 'Gelir/Gider', icon: '💸', ref: incomeExpenseRef },
              { id: 'budget', label: 'Bütçe', icon: '📈', ref: budgetRef },
              { id: 'perdiem', label: 'Harcırah', icon: '✈️', ref: perdiemRef },
              { id: 'invoices', label: 'Faturalar', icon: '📄', ref: invoiceRef },
              { id: 'payments', label: 'Ödemeler', icon: '💳', ref: paymentsRef },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  tab.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Financial Summary */}
        <div ref={summaryRef} className="scroll-mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Toplam Gelir</div>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{summary.totalRevenue.toLocaleString()} ₺</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {growth.growth >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">+{growth.growth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">{growth.growth}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">bu ay</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Net Kar</div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{summary.netProfit.toLocaleString()} ₺</div>
            <div className="text-sm text-gray-500 mt-2">
              Gider: {summary.totalExpenses.toLocaleString()} ₺
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Tamamlanan Ödeme</div>
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{summary.completedPayments}</div>
            <div className="text-sm text-gray-500 mt-2">
              Bekleyen: {summary.pendingPayments}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-gray-600">Kullanıcı Başına Ort.</div>
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{summary.avgRevenuePerUser.toLocaleString()} ₺</div>
            <div className="text-sm text-gray-500 mt-2">
              {summary.activeSubscriptions} aktif abonelik
            </div>
          </div>
        </div>

        {/* Cash Management */}
        <div ref={cashRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              Kasa Yönetimi
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cashAccounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{account.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {account.balance.toLocaleString()} {account.currency}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    Güncel: {new Date(account.lastUpdate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {account.type === 'main' ? 'Ana' : account.type === 'bank' ? 'Banka' : 'Şube'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Income & Expense */}
        <div ref={incomeExpenseRef} className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
              Gelir Akışı
            </h3>
            <div className="space-y-3">
              {expenseCategories.filter((cat) => cat.type === 'income').map((income) => (
                <div key={income.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{income.name}</span>
                    <span className="font-semibold text-gray-900">{income.amount.toLocaleString()} ₺</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${Math.min((income.amount / income.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Bütçe: {income.budget.toLocaleString()} ₺ • Trend: {income.trend >= 0 ? '+' : ''}{income.trend}%
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
              Giderler
            </h3>
            <div className="space-y-3">
              {expenseCategories.filter((cat) => cat.type === 'expense').map((expense) => (
                <div key={expense.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{expense.name}</span>
                    <span className="font-semibold text-gray-900">{expense.amount.toLocaleString()} ₺</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600"
                      style={{ width: `${Math.min((expense.amount / expense.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Bütçe: {expense.budget.toLocaleString()} ₺ • Sapma: {expense.trend >= 0 ? '+' : ''}{expense.trend}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Gelir Trendi
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('6months')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  selectedPeriod === '6months' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                6 Ay
              </button>
              <button
                onClick={() => setSelectedPeriod('12months')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  selectedPeriod === '12months' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                12 Ay
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayRevenue.map((revenue) => (
              <div key={revenue.period}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-700">
                    {new Date(revenue.period + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="font-bold text-gray-900">{revenue.totalRevenue.toLocaleString()} ₺</span>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    style={{ width: `${(revenue.totalRevenue / 80000) * 100}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-1 text-xs text-gray-600">
                  <span>Abonelik: {revenue.subscriptionRevenue.toLocaleString()} ₺</span>
                  <span>Sınav: {revenue.examRevenue.toLocaleString()} ₺</span>
                  <span>Sertifika: {revenue.certificateRevenue.toLocaleString()} ₺</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget & Per Diem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div ref={budgetRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-emerald-600" />
              Bütçe Yönetimi
            </h3>
            <div className="space-y-4">
              {budgetItems.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{item.department}</span>
                    <span className="text-gray-600">
                      {item.used.toLocaleString()} / {item.allocated.toLocaleString()} ₺
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                      style={{ width: `${Math.min((item.used / item.allocated) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Sapma: {item.variance.toLocaleString()} ₺
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={perdiemRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-600" />
                Harcırah Talepleri
              </h3>
              <div className="flex gap-2">
                {['all', 'approved', 'pending', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setPerDiemFilter(status as typeof perDiemFilter)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      perDiemFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {status === 'all' ? 'Tümü' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredPerDiems.map((req) => (
                <div key={req.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{req.employee}</p>
                    <p className="text-xs text-gray-500">{req.destination} • {req.purpose}</p>
                    <p className="text-xs text-gray-400">Talep: {new Date(req.submittedAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{req.amount.toLocaleString()} ₺</p>
                    <div className="flex gap-1 mt-2">
                      <button
                        className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                        onClick={() => alert(`${req.employee} talebi onaylandı`)}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                        onClick={() => alert(`${req.employee} talebi reddedildi`)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div ref={paymentsRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ödeme Geçmişi</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  filterStatus === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Tümü ({demoPayments.length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Tamamlanan
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Bekleyen
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Fatura No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Açıklama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Ödeme Yöntemi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tutar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.slice(0, 20).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.invoiceId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{payment.description}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center gap-1">
                        {getMethodIcon(payment.method)}
                        <span className="text-gray-700">{payment.method.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{payment.amount.toLocaleString()} ₺</td>
                    <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('tr-TR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice & Payment Systems */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div ref={invoiceRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Fatura & Proforma
              </h3>
              <div className="flex gap-2">
                {['all', 'invoice', 'proforma'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setInvoiceFilter(type as typeof invoiceFilter)}
                    className={`px-3 py-1 text-xs rounded ${
                      invoiceFilter === type ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type === 'all' ? 'Tümü' : type === 'invoice' ? 'Fatura' : 'Proforma'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredFinanceInvoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.customer}</p>
                    <p className="text-xs text-gray-500 capitalize">{invoice.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{invoice.amount.toLocaleString()} {invoice.currency}</p>
                    <p className="text-xs text-gray-500">Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status === 'paid' ? 'Ödendi' : invoice.status === 'pending' ? 'Beklemede' : 'Gecikmiş'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              Ödeme Sistemleri
            </h3>
            <div className="space-y-3">
              {paymentGateways.map((gateway) => (
                <div key={gateway.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{gateway.name}</p>
                      <p className="text-xs text-gray-500">Başarı: {gateway.successRate} • Uptime: {gateway.uptime}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getGatewayBadge(gateway.status)}`}>
                      {gateway.status === 'operational'
                        ? 'Aktif'
                        : gateway.status === 'degraded'
                        ? 'Yavaşlık'
                        : 'Sorun'}
                    </span>
                  </div>
                  {gateway.issues.length > 0 && (
                    <div className="mt-2 text-xs text-red-600 flex gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {gateway.issues.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

