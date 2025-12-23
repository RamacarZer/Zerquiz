import React, { useState } from 'react';
import { Users, TrendingUp, Award, Clock, BookOpen, CheckCircle, Activity, BarChart3 } from 'lucide-react';

interface StudentPerformance {
  id: string;
  name: string;
  avatar: string;
  completedAssignments: number;
  totalAssignments: number;
  averageScore: number;
  attendance: number;
  status: 'excellent' | 'good' | 'needs-attention';
}

export default function ClassroomDashboardTab() {
  const [selectedClass, setSelectedClass] = useState('10-A');

  // Mock data
  const classStats = {
    totalStudents: 32,
    averageScore: 78,
    completionRate: 85,
    activeNow: 18,
  };

  const mockStudents: StudentPerformance[] = [
    { id: '1', name: 'Ahmet Yılmaz', avatar: 'AY', completedAssignments: 15, totalAssignments: 18, averageScore: 92, attendance: 95, status: 'excellent' },
    { id: '2', name: 'Ayşe Demir', avatar: 'AD', completedAssignments: 14, totalAssignments: 18, averageScore: 88, attendance: 92, status: 'excellent' },
    { id: '3', name: 'Mehmet Kaya', avatar: 'MK', completedAssignments: 12, totalAssignments: 18, averageScore: 75, attendance: 85, status: 'good' },
    { id: '4', name: 'Fatma Öz', avatar: 'FÖ', completedAssignments: 8, totalAssignments: 18, averageScore: 62, attendance: 70, status: 'needs-attention' },
  ];

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-attention': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Mükemmel';
      case 'good': return 'İyi';
      case 'needs-attention': return 'Dikkat Gerekli';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">Sınıf Paneli</h2>
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {classes.map((cls) => (
            <option key={cls} value={cls}>Sınıf {cls}</option>
          ))}
        </select>
      </div>

      {/* Class Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Toplam Öğrenci', value: classStats.totalStudents, color: 'blue' },
          { icon: Award, label: 'Ortalama Puan', value: `${classStats.averageScore}%`, color: 'green' },
          { icon: TrendingUp, label: 'Tamamlanma Oranı', value: `${classStats.completionRate}%`, color: 'purple' },
          { icon: Activity, label: 'Şu Anda Aktif', value: classStats.activeNow, color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Student Performance Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Öğrenci Performansı
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Öğrenci</th>
                <th className="px-6 py-3 text-left font-semibold">Tamamlanan Ödevler</th>
                <th className="px-6 py-3 text-left font-semibold">Ortalama Puan</th>
                <th className="px-6 py-3 text-left font-semibold">Devam</th>
                <th className="px-6 py-3 text-left font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-indigo-600">{student.avatar}</span>
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>{student.completedAssignments}/{student.totalAssignments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${student.averageScore >= 80 ? 'text-green-600' : student.averageScore >= 60 ? 'text-blue-600' : 'text-red-600'}`}>
                      {student.averageScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{student.attendance}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

