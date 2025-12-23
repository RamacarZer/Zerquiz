import { useState } from 'react';
import { DollarSign, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useFinanceData } from './hooks/useFinanceData';
import Tabs from '../../components/common/Tabs';

// Import all tab components
import OverviewTab from './tabs/OverviewTab';
import CashManagementTab from './tabs/CashManagementTab';
import TransactionsTab from './tabs/TransactionsTab';
import BudgetsTab from './tabs/BudgetsTab';
import PerDiemTab from './tabs/PerDiemTab';
import InvoicesTab from './tabs/InvoicesTab';
import SubscriptionsTab from './tabs/SubscriptionsTab';
import PaymentGatewaysTab from './tabs/PaymentGatewaysTab';

export default function FinanceModule() {
  const { t } = useLanguage();
  const { refreshData } = useFinanceData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: t('overview') || 'Genel Bakış' },
    { id: 'cash', label: t('cash_management') || 'Kasa Yönetimi' },
    { id: 'transactions', label: t('transactions') || 'İşlemler' },
    { id: 'budgets', label: t('budgets') || 'Bütçeler' },
    { id: 'perdiem', label: t('per_diem') || 'Harcırahlar' },
    { id: 'invoices', label: t('invoices') || 'Faturalar' },
    { id: 'subscriptions', label: t('subscriptions') || 'Abonelikler' },
    { id: 'payment-gateways', label: t('payment_gateways') || 'Ödeme Sistemleri' },
  ];

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('finance_management') || 'Mali Yönetim'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Profesyonel finans takip ve yönetim sistemi
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportReport}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('export_report') || 'Rapor İndir'}
            </button>
            <button
              onClick={refreshData}
              className="btn btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {t('refresh') || 'Yenile'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'cash' && <CashManagementTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'budgets' && <BudgetsTab />}
        {activeTab === 'perdiem' && <PerDiemTab />}
        {activeTab === 'invoices' && <InvoicesTab />}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
        {activeTab === 'payment-gateways' && <PaymentGatewaysTab />}
      </div>
    </div>
  );
}

/* 
  ✅ MODÜLER YAPIDA FİNANS MODÜLÜ
  
  Avantajları:
  - Her tab ayrı dosya → Bir hata diğerini etkilemez
  - Shared state (useFinanceData hook)
  - Her component bağımsız test edilebilir
  - Kolay bakım ve geliştirme
  - 8 tab × ~100 satır = Daha yönetilebilir
  
  Dosya Yapısı:
  finance/
  ├── FinanceModule.tsx (bu dosya - 100 satır)
  ├── hooks/
  │   └── useFinanceData.ts (shared state)
  └── tabs/
      ├── OverviewTab.tsx
      ├── CashManagementTab.tsx
      ├── TransactionsTab.tsx
      ├── BudgetsTab.tsx
      ├── PerDiemTab.tsx
      ├── InvoicesTab.tsx
      ├── SubscriptionsTab.tsx
      └── PaymentGatewaysTab.tsx
*/
