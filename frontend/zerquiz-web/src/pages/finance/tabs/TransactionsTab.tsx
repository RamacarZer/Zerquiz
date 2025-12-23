import { useState, useMemo } from 'react';
import { Receipt, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function TransactionsTab() {
  const { transactions } = useFinanceData();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Receipt className="w-8 h-8 text-blue-600" />
          Gelir/Gider İşlemleri
        </h2>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni İşlem
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.description}</h3>
                <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>{transaction.category}</span>
                  {transaction.reference && <span>• Ref: {transaction.reference}</span>}
                  <span>• {new Date(transaction.date).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
            <p className={`text-2xl font-bold ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ₺
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

