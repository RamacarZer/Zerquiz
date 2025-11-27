import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ActivityData } from '../../mocks/dashboardDemoData';

interface ActivityChartProps {
  data: ActivityData[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.questionsCreated, d.examsCreated, d.studentsParticipated, d.examsCompleted))
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Son 7 Gün Aktivite
          </h3>
          <p className="text-sm text-gray-600 mt-1">Günlük işlem sayıları</p>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-6">
        {data.map((day, index) => (
          <div key={day.date} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{formatDate(day.date)}</span>
              <span className="text-xs text-gray-500">
                Toplam: {day.questionsCreated + day.examsCreated + day.studentsParticipated + day.examsCompleted}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Questions Created */}
              <div className="space-y-1">
                <div className="h-24 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500"
                    style={{ height: `${(day.questionsCreated / maxValue) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-blue-600">{day.questionsCreated}</div>
                  <div className="text-xs text-gray-600">Soru</div>
                </div>
              </div>

              {/* Exams Created */}
              <div className="space-y-1">
                <div className="h-24 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all duration-500"
                    style={{ height: `${(day.examsCreated / maxValue) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-green-600">{day.examsCreated}</div>
                  <div className="text-xs text-gray-600">Sınav</div>
                </div>
              </div>

              {/* Students Participated */}
              <div className="space-y-1">
                <div className="h-24 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-purple-500 transition-all duration-500"
                    style={{ height: `${(day.studentsParticipated / maxValue) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-purple-600">{day.studentsParticipated}</div>
                  <div className="text-xs text-gray-600">Katılım</div>
                </div>
              </div>

              {/* Exams Completed */}
              <div className="space-y-1">
                <div className="h-24 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-orange-500 transition-all duration-500"
                    style={{ height: `${(day.examsCompleted / maxValue) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-orange-600">{day.examsCompleted}</div>
                  <div className="text-xs text-gray-600">Tamamlandı</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-gray-700">Soru Oluşturma</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-700">Sınav Oluşturma</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-gray-700">Öğrenci Katılımı</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-gray-700">Sınav Tamamlama</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exam Type Distribution Pie Chart
interface ExamTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface ExamTypeChartProps {
  data: ExamTypeDistribution[];
}

export function ExamTypeDistributionChart({ data }: ExamTypeChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sınav Tipi Dağılımı</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.reduce((acc, item, index) => {
              const prevPercentage = data.slice(0, index).reduce((sum, d) => sum + d.percentage, 0);
              const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
              const strokeDashoffset = -prevPercentage;

              acc.push(
                <circle
                  key={item.type}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
              return acc;
            }, [] as JSX.Element[])}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <span className="text-sm text-gray-600">Toplam</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.type} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700">{item.type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900">{item.count}</span>
              <span className="text-xs text-gray-500 w-12 text-right">%{item.percentage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

