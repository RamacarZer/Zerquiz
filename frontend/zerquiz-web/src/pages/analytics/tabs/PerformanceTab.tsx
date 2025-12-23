import { TrendingUp } from 'lucide-react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export default function PerformanceTab() {
  const { performance } = useAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold">Öğrenci Performansı</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Öğrenci</th>
              <th className="px-6 py-3 text-left font-semibold">Sınav Sayısı</th>
              <th className="px-6 py-3 text-left font-semibold">Ort. Puan</th>
              <th className="px-6 py-3 text-left font-semibold">Son Aktivite</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {performance.map((student) => (
              <tr key={student.studentId} className="hover:bg-gray-50">
                <td className="px-6 py-4">{student.studentName}</td>
                <td className="px-6 py-4">{student.examCount}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${student.avgScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                    {student.avgScore}%
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{student.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

