import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import { DashboardStatsGrid } from '../../components/dashboard/DashboardStatCard';
import ActivityChart, { ExamTypeDistributionChart } from '../../components/dashboard/ActivityChart';
import RecentActivities from '../../components/dashboard/RecentActivities';
import QuickActions from '../../components/dashboard/QuickActions';
import SystemHealthCard from '../../components/dashboard/SystemHealthCard';
import {
  dashboardStats,
  activityData,
  recentActivities,
  systemHealth,
  examTypeDistribution,
  getTodayStats,
} from '../../mocks/dashboardDemoData';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = React.useState(false);
  const todayStats = getTodayStats();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz! İşte güncel istatistikleriniz.</p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Yenile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Today's Quick Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white">
          <h2 className="text-lg font-semibold mb-4">📅 Bugünün Özeti</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Soru Oluşturuldu</div>
              <div className="text-2xl font-bold">{todayStats.questionsCreated}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Sınav Oluşturuldu</div>
              <div className="text-2xl font-bold">{todayStats.examsCreated}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Katılım</div>
              <div className="text-2xl font-bold">{todayStats.studentsParticipated}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs opacity-90 mb-1">Tamamlanan</div>
              <div className="text-2xl font-bold">{todayStats.examsCompleted}</div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="mb-6">
          <DashboardStatsGrid stats={dashboardStats} />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Charts & Activities Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Activity Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityChart data={activityData} />
          </div>

          {/* Exam Type Distribution */}
          <div className="lg:col-span-1">
            <ExamTypeDistributionChart data={examTypeDistribution} />
          </div>
        </div>

        {/* Recent Activities & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivities activities={recentActivities} limit={10} />
          </div>

          {/* System Health */}
          <div className="lg:col-span-1">
            <SystemHealthCard health={systemHealth} />
          </div>
        </div>
      </div>
    </div>
  );
}

