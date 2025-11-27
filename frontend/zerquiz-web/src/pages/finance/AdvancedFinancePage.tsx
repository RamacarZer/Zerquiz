import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Download, FileText } from 'lucide-react';
import {
  demoPayments,
  revenueData,
  getFinancialSummary,
  getRevenueGrowth,
  type Payment,
} from '../../mocks/financeData';

export default function AdvancedFinancePage() {
  const [filterStatus, setFilterStatus] = useState<'all' | Payment['status']>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  const summary = getFinancialSummary();
  const growth = getRevenueGrowth();
  
  const filteredPayments = filterStatus === 'all' 
    ? demoPayments 
    : demoPayments.filter(p => p.status === filterStatus);

  const displayRevenue = selectedPeriod === '6months' 
    ? revenueData.slice(-6) 
    : revenueData;

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gelişmiş Finans Yönetimi</h1>
                <p className="text-sm text-gray-600">Gelir, gider ve ödeme takibi</p>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

        {/* Payments Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
      </div>
    </div>
  );
}

