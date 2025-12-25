import { useState, useEffect } from 'react';
import { 
  CreditCard, Download, FileText, Calendar, AlertCircle, CheckCircle,
  TrendingUp, DollarSign, Package, Activity, ArrowRight, Bell,
  Clock, RefreshCw, Eye, Plus, Settings
} from 'lucide-react';

interface Subscription {
  id: string;
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  nextBillingDate: string;
  autoRenew: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  invoiceDate: string;
  dueDate: string;
  paidAt?: string;
  downloadUrl?: string;
  items: Array<{ description: string; amount: number }>;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}

export default function BillingDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'invoices' | 'payment-methods'>('overview');

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockSubscription: Subscription = {
        id: 'sub_123456',
        planName: 'Profesyonel Plan',
        status: 'active',
        currentPeriodStart: '2025-12-01',
        currentPeriodEnd: '2026-01-01',
        nextBillingDate: '2026-01-01',
        cancelAtPeriodEnd: false,
        amount: 299,
        currency: 'TRY',
        autoRenew: true,
      };

      const mockInvoices: Invoice[] = [
        {
          id: 'inv_1',
          invoiceNumber: 'INV-20251201-001',
          amount: 358.8,
          currency: 'TRY',
          status: 'paid',
          invoiceDate: '2025-12-01',
          dueDate: '2025-12-08',
          paidAt: '2025-12-01',
          downloadUrl: '#',
          items: [
            { description: 'Profesyonel Plan - Aylık Abonelik', amount: 299.00 },
            { description: 'KDV (%20)', amount: 59.80 },
          ],
        },
        {
          id: 'inv_2',
          invoiceNumber: 'INV-20251101-001',
          amount: 358.8,
          currency: 'TRY',
          status: 'paid',
          invoiceDate: '2025-11-01',
          dueDate: '2025-11-08',
          paidAt: '2025-11-01',
          downloadUrl: '#',
          items: [
            { description: 'Profesyonel Plan - Aylık Abonelik', amount: 299.00 },
            { description: 'KDV (%20)', amount: 59.80 },
          ],
        },
        {
          id: 'inv_3',
          invoiceNumber: 'INV-20251001-001',
          amount: 358.8,
          currency: 'TRY',
          status: 'paid',
          invoiceDate: '2025-10-01',
          dueDate: '2025-10-08',
          paidAt: '2025-10-05',
          downloadUrl: '#',
          items: [
            { description: 'Profesyonel Plan - Aylık Abonelik', amount: 299.00 },
            { description: 'KDV (%20)', amount: 59.80 },
          ],
        },
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'credit_card',
          brand: 'Visa',
          last4: '4242',
          expiryMonth: '12',
          expiryYear: '2028',
          isDefault: true,
        },
      ];

      setSubscription(mockSubscription);
      setInvoices(mockInvoices);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz? Mevcut dönem sonuna kadar erişiminiz devam edecektir.')) {
      return;
    }

    try {
      // TODO: API call to cancel subscription
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true, autoRenew: false } : null);
      alert('Aboneliğiniz dönem sonunda iptal edilecek.');
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleChangePlan = () => {
    window.location.href = '/licensing/plans';
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Fatura bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fatura & Abonelik Yönetimi</h1>
          <p className="text-gray-600">Abonelik ve ödeme bilgilerinizi yönetin</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeView === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-5 h-5 inline-block mr-2" />
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveView('invoices')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeView === 'invoices'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Faturalar
          </button>
          <button
            onClick={() => setActiveView('payment-methods')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeView === 'payment-methods'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-5 h-5 inline-block mr-2" />
            Ödeme Yöntemleri
          </button>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && subscription && (
          <div className="space-y-6">
            {/* Subscription Status Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-8 h-8" />
                    <h2 className="text-3xl font-bold">{subscription.planName}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    {subscription.status === 'active' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Aktif Abonelik</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span>Pasif</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-extrabold">{subscription.amount}₺</div>
                  <div className="text-blue-100">/ ay</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-100 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Sonraki Fatura</span>
                  </div>
                  <div className="text-2xl font-bold">{new Date(subscription.nextBillingDate).toLocaleDateString('tr-TR')}</div>
                  <div className="text-sm text-blue-100 mt-1">{getDaysRemaining(subscription.nextBillingDate)} gün kaldı</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-100 mb-1">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Otomatik Yenileme</span>
                  </div>
                  <div className="text-2xl font-bold">{subscription.autoRenew ? 'Aktif' : 'Pasif'}</div>
                  <div className="text-sm text-blue-100 mt-1">
                    {subscription.cancelAtPeriodEnd ? 'Dönem sonunda iptal edilecek' : 'Otomatik yenilenecek'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleChangePlan}
                  className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all"
                >
                  Plan Değiştir
                </button>
                {!subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-6 py-3 rounded-xl font-bold bg-white/10 backdrop-blur hover:bg-white/20 transition-all"
                  >
                    Aboneliği İptal Et
                  </button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">Bu Ay</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{subscription.amount}₺</div>
                <div className="text-sm text-gray-500">Toplam Harcama</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 text-sm font-semibold">Toplam</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{invoices.length}</div>
                <div className="text-sm text-gray-500">Fatura</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-purple-600 text-sm font-semibold">Durum</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">%100</div>
                <div className="text-sm text-gray-500">Ödeme Oranı</div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Son Faturalar</h3>
                <button
                  onClick={() => setActiveView('invoices')}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  Tümünü Gör
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {invoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{invoice.amount}₺</div>
                        <div className={`text-sm font-semibold ${
                          invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {invoice.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-lg transition-all">
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeView === 'invoices' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Tüm Faturalar</h3>
              <p className="text-gray-600 mt-1">Geçmiş faturalarınızı görüntüleyin ve indirin</p>
            </div>
            <div className="divide-y">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900 mb-1">{invoice.invoiceNumber}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fatura Tarihi: {new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {invoice.paidAt && (
                          <div className="text-sm text-green-600 mt-1">
                            ✓ {new Date(invoice.paidAt).toLocaleDateString('tr-TR')} tarihinde ödendi
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{invoice.amount}₺</div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Ödendi
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Bekliyor
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Fatura Detayları:</div>
                    <div className="space-y-2">
                      {invoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.description}</span>
                          <span className="font-semibold text-gray-900">{item.amount.toFixed(2)}₺</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      PDF İndir
                    </button>
                    <button className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeView === 'payment-methods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Ödeme Yöntemleri</h3>
                  <p className="text-gray-600 mt-1">Kayıtlı ödeme yöntemlerinizi yönetin</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Yeni Kart Ekle
                </button>
              </div>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="relative bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl"
                  >
                    {method.isDefault && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Varsayılan
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-lg font-semibold uppercase">{method.brand}</div>
                      <CreditCard className="w-12 h-12 opacity-50" />
                    </div>
                    <div className="text-2xl font-mono tracking-widest mb-6">
                      •••• •••• •••• {method.last4}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-75 mb-1">Son Kullanma</div>
                        <div className="font-semibold">{method.expiryMonth}/{method.expiryYear}</div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
