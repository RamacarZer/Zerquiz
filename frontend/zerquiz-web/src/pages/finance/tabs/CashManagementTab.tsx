import { Wallet, Plus, Edit } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function CashManagementTab() {
  const { cashAccounts } = useFinanceData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-600" />
          Kasa Yönetimi
        </h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Kasa Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cashAccounts.map((account) => (
          <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                account.type === 'main' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                account.type === 'bank' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {account.type === 'main' ? 'Ana Kasa' : account.type === 'bank' ? 'Banka' : 'Şube'}
              </span>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
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
  );
}

