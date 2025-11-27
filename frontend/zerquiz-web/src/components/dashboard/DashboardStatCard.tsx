import React from 'react';
import { FileText, BookOpen, Users, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export default function DashboardStatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const borderColors = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    yellow: 'border-yellow-200',
    purple: 'border-purple-200',
    red: 'border-red-200',
    orange: 'border-orange-200',
  };

  return (
    <div className={`bg-white rounded-lg border-2 ${borderColors[color]} p-6 hover:shadow-lg transition`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          {trend.isUp ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+{trend.value}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-red-600 font-medium">-{trend.value}%</span>
            </>
          )}
          <span className="text-gray-600 ml-1">son 7 gün</span>
        </div>
      )}
    </div>
  );
}

// Pre-configured stat cards
interface StatsGridProps {
  stats: {
    totalQuestions: number;
    totalExams: number;
    totalStudents: number;
    activeExams: number;
    publishedQuestions: number;
    avgExamScore: number;
  };
}

export function DashboardStatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        title="Toplam Soru"
        value={stats.totalQuestions}
        subtitle={`${stats.publishedQuestions} yayında`}
        icon={<FileText className="h-6 w-6" />}
        color="blue"
        trend={{ value: 12, isUp: true }}
      />
      
      <DashboardStatCard
        title="Toplam Sınav"
        value={stats.totalExams}
        subtitle={`${stats.activeExams} aktif`}
        icon={<BookOpen className="h-6 w-6" />}
        color="green"
        trend={{ value: 8, isUp: true }}
      />
      
      <DashboardStatCard
        title="Toplam Öğrenci"
        value={stats.totalStudents}
        subtitle="Kayıtlı kullanıcı"
        icon={<Users className="h-6 w-6" />}
        color="purple"
        trend={{ value: 15, isUp: true }}
      />
      
      <DashboardStatCard
        title="Ortalama Başarı"
        value={`${stats.avgExamScore}%`}
        subtitle="Sınav ortalaması"
        icon={<Activity className="h-6 w-6" />}
        color={stats.avgExamScore >= 70 ? 'green' : stats.avgExamScore >= 60 ? 'yellow' : 'red'}
        trend={{ value: 3, isUp: stats.avgExamScore >= 70 }}
      />
    </div>
  );
}

