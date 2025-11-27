import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, Download, Check, AlertCircle } from 'lucide-react';
import {
  subscriptionPackages,
  getCurrentSubscription,
  getPackageById,
  getUsagePercentage,
  getDaysUntilRenewal,
  getInvoicesBySubscription,
  calculateYearlySavings,
} from '../../mocks/subscriptionData';

export default function SubscriptionsPageEnhanced() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const currentSubscription = getCurrentSubscription();
  const currentPackage = getPackageById(currentSubscription.packageId);
  const usagePercentages = getUsagePercentage(currentSubscription);
  const daysLeft = getDaysUntilRenewal(currentSubscription);
  const invoices = getInvoicesBySubscription(currentSubscription.id);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'gray': return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-900', button: 'bg-gray-600 hover:bg-gray-700' };
      case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', button: 'bg-blue-600 hover:bg-blue-700' };
      case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', button: 'bg-purple-600 hover:bg-purple-700' };
      case 'yellow': return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', button: 'bg-yellow-600 hover:bg-yellow-700' };
      default: return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-900', button: 'bg-gray-600 hover:bg-gray-700' };
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-orange-600';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Abonelik Yönetimi</h1>
                <p className="text-sm text-gray-600">Paketinizi yönetin ve faturalarınızı görüntüleyin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Current Subscription */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{currentPackage?.name} Paketi</h2>
              <p className="text-purple-100">{currentSubscription.organizationName}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentPackage?.price} ₺</div>
              <div className="text-sm text-purple-100">/ ay</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Durum</div>
              <div className="text-lg font-bold">
                {currentSubscription.status === 'active' ? '✓ Aktif' : 'Pasif'}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Yenileme</div>
              <div className="text-lg font-bold">{daysLeft} gün</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Otomatik Yenileme</div>
              <div className="text-lg font-bold">
                {currentSubscription.autoRenew ? '✓ Açık' : '✗ Kapalı'}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Kullanım İstatistikleri
          </h3>

          <div className="space-y-4">
            {[
              { label: 'Sorular', used: currentSubscription.usage.questionsUsed, max: currentPackage?.limits.maxQuestions || 0, percentage: usagePercentages.questions },
              { label: 'Sınavlar', used: currentSubscription.usage.examsUsed, max: currentPackage?.limits.maxExams || 0, percentage: usagePercentages.exams },
              { label: 'Öğrenciler', used: currentSubscription.usage.studentsUsed, max: currentPackage?.limits.maxStudents || 0, percentage: usagePercentages.students },
              { label: 'Depolama', used: currentSubscription.usage.storageUsed, max: currentPackage?.limits.maxStorage || 0, percentage: usagePercentages.storage, unit: 'GB' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {item.used} {item.unit || ''} / {item.max === -1 ? '∞' : `${item.max} ${item.unit || ''}`}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getUsageColor(item.percentage)}`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageBarColor(item.percentage)} transition-all duration-500`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                billingPeriod === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-700'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                billingPeriod === 'yearly' ? 'bg-purple-600 text-white' : 'text-gray-700'
              }`}
            >
              Yıllık <span className="text-xs">(20% indirim)</span>
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {subscriptionPackages.map((pkg) => {
            const colors = getColorClasses(pkg.color);
            const isCurrentPackage = pkg.id === currentSubscription.packageId;
            const displayPrice = billingPeriod === 'yearly' ? Math.round(pkg.price * 12 * 0.8) : pkg.price;
            const savings = billingPeriod === 'yearly' ? calculateYearlySavings(pkg.price) : 0;

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg border-2 ${pkg.popular ? 'border-purple-500 shadow-lg' : 'border-gray-200'} p-6 relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ⭐ Popüler
                    </span>
                  </div>
                )}

                {isCurrentPackage && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ✓ Mevcut
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <CreditCard className={`h-6 w-6 ${colors.text}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {displayPrice} ₺
                  </div>
                  <div className="text-sm text-gray-600">
                    / {billingPeriod === 'yearly' ? 'yıl' : 'ay'}
                  </div>
                  {savings > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {savings} ₺ tasarruf!
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => alert(isCurrentPackage ? 'Bu paket zaten aktif!' : `${pkg.name} paketine geçiş yapılıyor...`)}
                  disabled={isCurrentPackage}
                  className={`w-full px-4 py-3 ${colors.button} text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCurrentPackage ? 'Mevcut Paket' : 'Paketi Seç'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Fatura Geçmişi
            </h3>
          </div>

          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(invoice.issueDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{invoice.amount} ₺</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status === 'paid' ? '✓ Ödendi' : invoice.status === 'pending' ? '⏳ Beklemede' : '✗ Başarısız'}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Fatura ${invoice.invoiceNumber} indiriliyor...`)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    title="İndir"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

