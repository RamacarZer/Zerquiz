import { useState } from 'react';
import { FileQuestion, RefreshCw } from 'lucide-react';
import { useExamData } from './hooks/useExamData';
import Tabs from '../../components/common/Tabs';

import ExamListTab from './tabs/ExamListTab';
import ExamManagementTab from './tabs/ExamManagementTab';
import ExamMonitoringTab from './tabs/ExamMonitoringTab';

export default function ExamModule() {
  const { refreshData } = useExamData();
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'Sınav Listesi' },
    { id: 'manage', label: 'Yönetim' },
    { id: 'monitoring', label: 'İzleme' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sınav Yönetimi</h1>
              <p className="text-gray-600">Sınavları oluşturun, yönetin ve izleyin</p>
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
        {activeTab === 'list' && <ExamListTab />}
        {activeTab === 'manage' && <ExamManagementTab />}
        {activeTab === 'monitoring' && <ExamMonitoringTab />}
      </div>
    </div>
  );
}
