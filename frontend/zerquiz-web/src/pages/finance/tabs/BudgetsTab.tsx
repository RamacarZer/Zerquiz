import { PieChart, Settings } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function BudgetsTab() {
  const { budgets } = useFinanceData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <PieChart className="w-8 h-8 text-purple-600" />
          Bütçe Yönetimi
        </h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Bütçe Ayarları
        </button>
      </div>

      <div className="space-y-6">
        {budgets.map((budget) => {
          const usagePercent = (budget.used / budget.allocated) * 100;
          return (
            <div key={budget.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{budget.department}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{budget.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {budget.used.toLocaleString()} / {budget.allocated.toLocaleString()} ₺
                  </p>
                  <p className={`text-sm font-medium ${
                    budget.variance < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    Sapma: {budget.variance.toLocaleString()} ₺
                  </p>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    usagePercent > 90 ? 'bg-red-500' : usagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Kullanım: {usagePercent.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

