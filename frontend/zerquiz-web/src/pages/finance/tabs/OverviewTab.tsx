import { DollarSign, TrendingUp, CreditCard, Users, Wallet, FileText, Package } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function OverviewTab() {
  const { financialSummary, cashAccounts, invoices, subscriptions } = useFinanceData();

  return (
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
  );
}

