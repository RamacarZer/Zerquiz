import { useState } from 'react';
import { Plug, RefreshCw } from 'lucide-react';
import { useIntegrationData } from './hooks/useIntegrationData';
import Tabs from '../../components/common/Tabs';

import LTITab from './tabs/LTITab';
import APITab from './tabs/APITab';

export default function IntegrationModule() {
  const { refreshData } = useIntegrationData();
  const [activeTab, setActiveTab] = useState('lti');

  const tabs = [
    { id: 'lti', label: 'LTI Entegrasyonları' },
    { id: 'api', label: 'API Yönetimi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Plug className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entegrasyon Yönetimi</h1>
              <p className="text-gray-600">LTI ve API entegrasyonları</p>
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
        {activeTab === 'lti' && <LTITab />}
        {activeTab === 'api' && <APITab />}
      </div>
    </div>
  );
}
