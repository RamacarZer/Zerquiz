import { useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import Tabs from '../../components/common/Tabs';

import OverviewTab from './tabs/OverviewTab';
import PerformanceTab from './tabs/PerformanceTab';
import StudentProgressTab from './tabs/StudentProgressTab';
import LearningStyleTab from './tabs/LearningStyleTab';
import ClassroomDashboardTab from './tabs/ClassroomDashboardTab';
import AIAnalyticsTab from './tabs/AIAnalyticsTab';

export default function AnalyticsModule() {
  const { refreshData } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'performance', label: 'Performans Raporu' },
    { id: 'student-progress', label: 'Öğrenci İlerlemesi' },
    { id: 'learning-style', label: 'Öğrenme Stili Analizi' },
    { id: 'classroom-dashboard', label: 'Sınıf Paneli' },
    { id: 'ai-analytics', label: 'AI Analitik Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analitik Yönetimi</h1>
              <p className="text-gray-600">Detaylı performans raporları ve analizleri</p>
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'student-progress' && <StudentProgressTab />}
        {activeTab === 'learning-style' && <LearningStyleTab />}
        {activeTab === 'classroom-dashboard' && <ClassroomDashboardTab />}
        {activeTab === 'ai-analytics' && <AIAnalyticsTab />}
      </div>
    </div>
  );
}
