import { useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useClassroomData } from './hooks/useClassroomData';
import Tabs from '../../components/common/Tabs';

import LessonsTab from './tabs/LessonsTab';
import HomeworksTab from './tabs/HomeworksTab';

export default function ClassroomModule() {
  const { refreshData } = useClassroomData();
  const [activeTab, setActiveTab] = useState('lessons');

  const tabs = [
    { id: 'lessons', label: 'Dersler' },
    { id: 'homeworks', label: 'Ödevler' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sınıf Yönetimi</h1>
              <p className="text-gray-600">Ders ve ödev takibi</p>
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
        {activeTab === 'lessons' && <LessonsTab />}
        {activeTab === 'homeworks' && <HomeworksTab />}
      </div>
    </div>
  );
}
