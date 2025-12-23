import React from 'react';
import { TrendingUp, Users, BookOpen, Target, BarChart3 } from 'lucide-react';

export default function StudentProgressTab() {
  // Mock data - gerçek uygulamada API'den gelecek
  const progressData = [
    { id: '1', name: 'Ahmet Yılmaz', subject: 'Matematik', progress: 85, lastUpdate: '2024-01-20' },
    { id: '2', name: 'Ayşe Demir', subject: 'Fizik', progress: 92, lastUpdate: '2024-01-19' },
    { id: '3', name: 'Mehmet Kaya', subject: 'Kimya', progress: 78, lastUpdate: '2024-01-18' },
    { id: '4', name: 'Fatma Yıldız', subject: 'Biyoloji', progress: 88, lastUpdate: '2024-01-20' },
  ];

  const stats = [
    { icon: Users, label: 'Toplam Öğrenci', value: '145', color: 'blue' },
    { icon: TrendingUp, label: 'Ortalama İlerleme', value: '%86', color: 'green' },
    { icon: BookOpen, label: 'Aktif Dersler', value: '24', color: 'purple' },
    { icon: Target, label: 'Tamamlanan Hedef', value: '312', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Öğrenci İlerlemesi</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Detaylı İlerleme Raporu
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Öğrenci</th>
                <th className="px-6 py-3 text-left font-semibold">Ders</th>
                <th className="px-6 py-3 text-left font-semibold">İlerleme</th>
                <th className="px-6 py-3 text-left font-semibold">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {progressData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4">{student.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                        <div
                          className={`h-2 rounded-full ${
                            student.progress >= 80 ? 'bg-green-600' : 
                            student.progress >= 60 ? 'bg-blue-600' : 'bg-orange-600'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

