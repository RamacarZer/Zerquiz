import { useState } from 'react';
import { Presentation, RefreshCw } from 'lucide-react';
import { usePresentationData } from './hooks/usePresentationData';
import Tabs from '../../components/common/Tabs';

import PresentationListTab from './tabs/PresentationListTab';
import PresentationBuilderTab from './tabs/PresentationBuilderTab';

export default function PresentationModule() {
  const { refreshData } = usePresentationData();
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'Sunum Listesi' },
    { id: 'builder', label: 'Sunum Oluştur' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Presentation className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sunum Yönetimi</h1>
              <p className="text-gray-600">Profesyonel sunumlar oluşturun ve yönetin</p>
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
        {activeTab === 'list' && <PresentationListTab />}
        {activeTab === 'builder' && <PresentationBuilderTab />}
      </div>
    </div>
  );
}
