import { useState } from 'react';
import { Copyright, RefreshCw } from 'lucide-react';
import { useRoyaltyData } from './hooks/useRoyaltyData';
import Tabs from '../../components/common/Tabs';

import AuthorPanelTab from './tabs/AuthorPanelTab';
import ReportsTab from './tabs/ReportsTab';

export default function RoyaltyModule() {
  const { refreshData } = useRoyaltyData();
  const [activeTab, setActiveTab] = useState('authors');

  const tabs = [
    { id: 'authors', label: 'Yazar Paneli' },
    { id: 'reports', label: 'Raporlar' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Copyright className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Telif Yönetimi</h1>
              <p className="text-gray-600">Yazar kazançları ve telif raporları</p>
            </div>
          </div>
          <button onClick={refreshData} className="btn btn-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Yenile
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        {activeTab === 'authors' && <AuthorPanelTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
