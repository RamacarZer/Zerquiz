import { useState, useEffect } from 'react';
import { CreditCard, Download, FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface Subscription {
  id: string;
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
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
}

export default function BillingDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockSubscription: Subscription = {
        id: 'sub_123',
        planName: 'Profesyonel',
        status: 'active',
        currentPeriodStart: '2025-12-01',
        currentPeriodEnd: '2026-01-01',
        cancelAtPeriodEnd: false,
        amount: 299,
        currency: 'TRY',
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
        },
      ];

      setSubscription(mockSubscription);
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      // TODO: API call to cancel subscription
      alert('Aboneliğiniz dönem sonunda iptal edilecek.');
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleChangePlan = () => {
    window.location.href = '/plans';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Faturalama ve Abonelik</h1>

      {/* Subscription Card */}
      <div className="card bg-white shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="card-title text-2xl mb-2">Mevcut Abonelik</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {subscription?.planName}
                </span>
                <div
                  className={`badge ${
                    subscription?.status === 'active' ? 'badge-success' : 'badge-warning'
                  } badge-lg`}
                >
                  {subscription?.status === 'active' ? 'Aktif' : 'İptal Edilmiş'}
                </div>
              </div>
            </div>
            <CreditCard size={48} className="text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Aylık Tutar</div>
              <div className="stat-value text-2xl">
                {subscription?.amount} {subscription?.currency}
              </div>
              <div className="stat-desc">KDV Hariç</div>
            </div>

            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Dönem Başlangıcı</div>
              <div className="stat-value text-2xl">
                {subscription?.currentPeriodStart
                  ? new Date(subscription.currentPeriodStart).toLocaleDateString('tr-TR')
                  : '-'}
              </div>
            </div>

            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Yenileme Tarihi</div>
              <div className="stat-value text-2xl">
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString('tr-TR')
                  : '-'}
              </div>
            </div>
          </div>

          {subscription?.cancelAtPeriodEnd && (
            <div className="alert alert-warning mb-6">
              <AlertCircle size={20} />
              <span>
                Aboneliğiniz {new Date(subscription.currentPeriodEnd).toLocaleDateString('tr-TR')}{' '}
                tarihinde iptal edilecek.
              </span>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={handleChangePlan} className="btn btn-primary">
              Planı Değiştir
            </button>
            {!subscription?.cancelAtPeriodEnd && (
              <button onClick={handleCancelSubscription} className="btn btn-outline btn-error">
                Aboneliği İptal Et
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card bg-white shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Ödeme Yöntemi</h2>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
            <div className="flex items-center gap-4">
              <CreditCard size={32} className="text-gray-600" />
              <div>
                <p className="font-semibold">Visa •••• 4242</p>
                <p className="text-sm text-gray-600">Son kullanma: 12/2026</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Güncelle</button>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="card bg-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Faturalar</h2>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Henüz fatura bulunmuyor</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fatura No</th>
                    <th>Tarih</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-mono">{invoice.invoiceNumber}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="font-semibold">
                        {invoice.amount} {invoice.currency}
                      </td>
                      <td>
                        {invoice.status === 'paid' ? (
                          <div className="badge badge-success gap-2">
                            <CheckCircle size={14} />
                            Ödendi
                          </div>
                        ) : invoice.status === 'pending' ? (
                          <div className="badge badge-warning gap-2">
                            <AlertCircle size={14} />
                            Beklemede
                          </div>
                        ) : (
                          <div className="badge badge-error">İptal</div>
                        )}
                      </td>
                      <td>
                        <a
                          href={invoice.downloadUrl}
                          className="btn btn-ghost btn-sm gap-2"
                          download
                        >
                          <Download size={16} />
                          İndir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

