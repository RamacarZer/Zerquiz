import { Users, Activity, FileCheck, TrendingUp } from 'lucide-react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export default function OverviewTab() {
  const { overview } = useAnalyticsData();

  const metrics = [
    { icon: Users, label: 'Toplam Öğrenci', value: overview.totalStudents, color: 'blue' },
    { icon: Activity, label: 'Aktif Kullanıcı', value: overview.activeUsers, color: 'green' },
    { icon: FileCheck, label: 'Tamamlanan Sınav', value: overview.completedExams, color: 'purple' },
    { icon: TrendingUp, label: 'Ortalama Puan', value: `${overview.avgScore}%`, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Genel Bakış</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-10 h-10 text-${metric.color}-600`} />
              <span className="text-3xl font-bold">{metric.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

