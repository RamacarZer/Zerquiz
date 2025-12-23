import { useState, useMemo } from 'react';
import { Package, Edit, X } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function SubscriptionsTab() {
  const { subscriptions } = useFinanceData();
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'expired'>('all');

  const filteredSubscriptions = useMemo(() => {
    if (filter === 'all') return subscriptions;
    return subscriptions.filter(s => s.status === filter);
  }, [subscriptions, filter]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      active: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'İptal', color: 'bg-gray-100 text-gray-800' },
      expired: { label: 'Süresi Dolmuş', color: 'bg-red-100 text-red-800' },
    };
    const config = configs[status] || configs.active;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Package className="w-8 h-8 text-green-600" />
          Abonelik Yönetimi
        </h2>
        <div className="flex gap-3">
          {(['all', 'active', 'cancelled', 'expired'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tümü' : status === 'active' ? 'Aktif' : status === 'cancelled' ? 'İptal' : 'Süresi Dolmuş'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <div key={subscription.id} className="border rounded-xl p-6 bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{subscription.planName}</h3>
                <p className="text-gray-600 mt-1">{subscription.tenantName}</p>
              </div>
              {getStatusBadge(subscription.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tutar:</span>
                <span className="font-semibold">
                  {subscription.amount} {subscription.currency} / {subscription.billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Başlangıç:</span>
                <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sonraki Fatura:</span>
                <span className="font-medium">{new Date(subscription.nextBillingDate).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Otomatik Yenileme:</span>
                <span className={`font-semibold ${subscription.autoRenew ? 'text-green-600' : 'text-gray-600'}`}>
                  {subscription.autoRenew ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Düzenle
              </button>
              {subscription.status === 'active' && (
                <button className="btn btn-error flex-1 flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  İptal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

