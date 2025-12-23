import { CreditCard, Settings, AlertCircle } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function PaymentGatewaysTab() {
  const { paymentGateways } = useFinanceData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-indigo-600" />
          Ödeme Sistemleri
        </h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Ayarlar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentGateways.map((gateway) => (
          <div key={gateway.id} className="border rounded-xl p-6 bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">{gateway.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                gateway.status === 'operational' ? 'bg-green-100 text-green-800' :
                gateway.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {gateway.status === 'operational' ? 'Çalışıyor' : gateway.status === 'degraded' ? 'Yavaş' : 'Sorunlu'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Başarı Oranı:</span>
                <span className="font-semibold">{gateway.successRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-semibold">{gateway.uptime}</span>
              </div>
            </div>

            {gateway.issues.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Sorunlar:</span>
                </div>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {gateway.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <button className="btn btn-secondary w-full mt-4 flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Yapılandır
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

