import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
} from 'lucide-react';

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

export default function ClassroomDashboardPage() {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState('10-A');

  // Mock data
  const classStats = {
    totalStudents: 32,
    averageScore: 78,
    completionRate: 85,
    activeNow: 18,
  };

  const mockStudents: StudentPerformance[] = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      avatar: 'AY',
      completedAssignments: 15,
      totalAssignments: 18,
      averageScore: 92,
      attendance: 95,
      status: 'excellent',
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      avatar: 'AD',
      completedAssignments: 16,
      totalAssignments: 18,
      averageScore: 88,
      attendance: 92,
      status: 'excellent',
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      avatar: 'MK',
      completedAssignments: 12,
      totalAssignments: 18,
      averageScore: 75,
      attendance: 85,
      status: 'good',
    },
    {
      id: '4',
      name: 'Zeynep Şahin',
      avatar: 'ZŞ',
      completedAssignments: 8,
      totalAssignments: 18,
      averageScore: 62,
      attendance: 70,
      status: 'needs-attention',
    },
  ];

  const recentActivity = [
    {
      type: 'assignment',
      student: 'Ahmet Yılmaz',
      action: 'Matematik Ödevi teslim edildi',
      time: '5 dk önce',
      score: 95,
    },
    {
      type: 'exam',
      student: 'Ayşe Demir',
      action: 'Fizik Sınavı tamamlandı',
      time: '15 dk önce',
      score: 88,
    },
    {
      type: 'late',
      student: 'Mehmet Kaya',
      action: 'Kimya Ödevi geç teslim edildi',
      time: '1 saat önce',
      score: 70,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'needs-attention':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Mükemmel';
      case 'good':
        return 'İyi';
      case 'needs-attention':
        return 'Dikkat Gerekli';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            {t('classroom_dashboard') || 'Sınıf Paneli'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sınıfınızın genel performansını ve öğrenci ilerlemesini takip edin
          </p>
        </div>
        
        {/* Class Selector */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="10-A">10-A Sınıfı</option>
          <option value="10-B">10-B Sınıfı</option>
          <option value="11-A">11-A Sınıfı</option>
          <option value="11-B">11-B Sınıfı</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Toplam Öğrenci</p>
              <p className="text-3xl font-bold">{classStats.totalStudents}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">{classStats.activeNow} öğrenci aktif</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Ortalama Puan</p>
              <p className="text-3xl font-bold">{classStats.averageScore}%</p>
            </div>
            <Award className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">+5% geçen aya göre</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Tamamlanma Oranı</p>
              <p className="text-3xl font-bold">{classStats.completionRate}%</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">Son 30 günde</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm">Aktif Ödev</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-sm text-orange-100">5 ödev yaklaşan deadline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Öğrenci Performansı
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {student.completedAssignments}/{student.totalAssignments} ödev tamamlandı
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      student.status
                    )}`}
                  >
                    {getStatusLabel(student.status)}
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Ortalama Puan</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {student.averageScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${student.averageScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Devam Oranı</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {student.attendance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full"
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Son Aktiviteler
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'assignment' && <BookOpen className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'exam' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.type === 'late' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {activity.student}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
                    <span className="text-xs font-semibold text-blue-600">Puan: {activity.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

