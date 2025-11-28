import React, { useState } from 'react';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  Download,
  Check,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Clock,
  Receipt,
  History,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import {
  subscriptionPackages,
  getCurrentSubscription,
  getPackageById,
  getUsagePercentage,
  getDaysUntilRenewal,
  getInvoicesBySubscription,
  calculateYearlySavings,
  getCustomerAccountByOrgId,
  getTransactionsBySubscription,
  getUpgradeOptions,
} from '../../mocks/subscriptionData';

export default function SubscriptionsPageEnhanced() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [historyTab, setHistoryTab] = useState<'invoices' | 'transactions'>('invoices');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const currentSubscription = getCurrentSubscription();
  const currentPackage = getPackageById(currentSubscription.packageId);
  const usagePercentages = getUsagePercentage(currentSubscription);
  const daysLeft = getDaysUntilRenewal(currentSubscription);
  const invoices = getInvoicesBySubscription(currentSubscription.id);
  const customerAccount = getCustomerAccountByOrgId(currentSubscription.organizationId);
  const transactions = getTransactionsBySubscription(currentSubscription.id);
  const upgradeOptions = getUpgradeOptions(currentSubscription.packageId);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string | null>(upgradeOptions[0]?.id ?? null);
  const selectedUpgrade = selectedUpgradeId
    ? upgradeOptions.find((pkg) => pkg.id === selectedUpgradeId)
    : upgradeOptions[0];

  React.useEffect(() => {
    setSelectedUpgradeId(upgradeOptions[0]?.id ?? null);
  }, [currentSubscription.packageId]);

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

        {/* Customer & Billing */}
        {customerAccount && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <User className="h-4 w-4" />
                Müşteri Profili
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{customerAccount.organizationId}</p>
                <p className="text-sm text-gray-600 capitalize">{customerAccount.type} • {customerAccount.size}</p>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {customerAccount.contactEmail}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {customerAccount.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {customerAccount.address}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {customerAccount.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <Receipt className="h-4 w-4" />
                Faturalama
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <div><span className="font-medium text-gray-900">Yetkili:</span> {customerAccount.billingContact}</div>
                <div><span className="font-medium text-gray-900">E-posta:</span> {customerAccount.billingEmail}</div>
                <div className="text-xs text-gray-500">Katılım: {new Date(customerAccount.joinedAt).toLocaleDateString('tr-TR')}</div>
              </div>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                {customerAccount.billingNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <History className="h-4 w-4" />
                Son İşlemler
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{tx.amount} ₺</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setHistoryTab('transactions')}
                className="w-full px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100"
              >
                Tüm İşlemleri Gör
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Suggestions */}
        {upgradeOptions.length > 0 && selectedUpgrade && (
          <div className="bg-white rounded-lg border border-purple-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  Plan Yükseltme Önerisi
                </div>
                <h3 className="text-xl font-bold text-gray-900">Daha fazla kapasite için hazır mısınız?</h3>
              </div>
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Yükseltmeye Başla
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upgradeOptions.map((pkg) => (
                <label
                  key={pkg.id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedUpgradeId === pkg.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{pkg.name}</div>
                      <p className="text-xs text-gray-500">{pkg.description}</p>
                    </div>
                    <input
                      type="radio"
                      name="upgrade"
                      checked={selectedUpgradeId === pkg.id}
                      onChange={() => setSelectedUpgradeId(pkg.id)}
                      className="text-purple-600"
                    />
                  </div>
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <div>Fiyat: {pkg.price} ₺ / ay</div>
                    <div>Öğrenci limiti: {pkg.limits.maxStudents === -1 ? 'Sınırsız' : pkg.limits.maxStudents}</div>
                    <div>Depolama: {pkg.limits.maxStorage} GB</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

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

        {/* Billing History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Geçmiş Kayıtlar
            </h3>
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setHistoryTab('invoices')}
                className={`px-4 py-1 text-xs font-medium rounded ${
                  historyTab === 'invoices' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Faturalar
              </button>
              <button
                onClick={() => setHistoryTab('transactions')}
                className={`px-4 py-1 text-xs font-medium rounded ${
                  historyTab === 'transactions' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                İşlemler
              </button>
            </div>
          </div>

          {historyTab === 'invoices' ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(invoice.issueDate).toLocaleDateString('tr-TR')} • Son tarih {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tarih</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">İşlem</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Yöntem</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tutar</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600">{new Date(tx.date).toLocaleDateString('tr-TR')}</td>
                      <td className="px-4 py-2 text-gray-900">{tx.description}</td>
                      <td className="px-4 py-2 capitalize text-gray-700">{tx.method.replace('_', ' ')}</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">{tx.amount} ₺</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {upgradeModalOpen && selectedUpgrade && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setUpgradeModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
              <button
                onClick={() => setUpgradeModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Plan Yükseltme
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedUpgrade.name} planına geçiş</h3>
              <p className="text-sm text-gray-600">{selectedUpgrade.description}</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-gray-500">Yeni Limitler</div>
                  <ul className="mt-2 space-y-1 text-gray-800">
                    <li>Öğrenci: {selectedUpgrade.limits.maxStudents === -1 ? 'Sınırsız' : selectedUpgrade.limits.maxStudents}</li>
                    <li>Soru: {selectedUpgrade.limits.maxQuestions === -1 ? 'Sınırsız' : selectedUpgrade.limits.maxQuestions}</li>
                    <li>Depolama: {selectedUpgrade.limits.maxStorage} GB</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase text-gray-500">Fiyatlandırma</div>
                  <p className="mt-2 text-xl font-bold text-gray-900">{selectedUpgrade.price} ₺ / ay</p>
                  <p className="text-xs text-gray-500">Yıllık ödemede %20 indirim</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUpgradeModalOpen(false);
                  alert(`${selectedUpgrade.name} planına geçiş talebiniz alındı!`);
                }}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Onayla ve Yükselt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

