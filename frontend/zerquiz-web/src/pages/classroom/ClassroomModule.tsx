import { useState } from 'react';
import { 
  BookOpen, RefreshCw, Users, ClipboardList, Calendar, Clock,
  Award, Target, TrendingUp, CheckCircle, AlertCircle, Plus,
  Eye, Edit, Download, FileText, Video, MessageSquare
} from 'lucide-react';
import { useClassroomData } from './hooks/useClassroomData';
import Tabs from '../../components/common/Tabs';

import LessonsTab from './tabs/LessonsTab';
import HomeworksTab from './tabs/HomeworksTab';

export default function ClassroomModule() {
  const { refreshData } = useClassroomData();
  const [activeTab, setActiveTab] = useState('lessons');

  const tabs = [
    { id: 'lessons', label: 'Dersler', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'homeworks', label: 'Ödevler', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  const stats = [
    { 
      label: 'Aktif Dersler', 
      value: '24', 
      icon: <BookOpen className="w-6 h-6" />, 
      color: 'from-blue-500 to-blue-600',
      subtext: 'Bu hafta'
    },
    { 
      label: 'Toplam Öğrenci', 
      value: '342', 
      icon: <Users className="w-6 h-6" />, 
      color: 'from-green-500 to-green-600',
      subtext: '8 sınıf'
    },
    { 
      label: 'Bekleyen Ödev', 
      value: '18', 
      icon: <ClipboardList className="w-6 h-6" />, 
      color: 'from-orange-500 to-orange-600',
      subtext: 'Kontrol edilecek'
    },
    { 
      label: 'Tamamlanma', 
      value: '%87', 
      icon: <Target className="w-6 h-6" />, 
      color: 'from-purple-500 to-purple-600',
      subtext: 'Ortalama'
    },
  ];

  const upcomingClasses = [
    { id: 1, title: 'Matematik 10-A', time: '09:00', students: 32, room: 'A-201', type: 'Canlı Ders' },
    { id: 2, title: 'Fizik 11-B', time: '10:30', students: 28, room: 'B-105', type: 'Konu Anlatımı' },
    { id: 3, title: 'Kimya 12-C', time: '13:00', students: 30, room: 'C-302', type: 'Laboratuvar' },
  ];

  const recentHomeworks = [
    { id: 1, title: 'Matematik Problem Seti', class: '10-A', submitted: 28, total: 32, deadline: '2025-12-25' },
    { id: 2, title: 'Fizik Deney Raporu', class: '11-B', submitted: 24, total: 28, deadline: '2025-12-26' },
    { id: 3, title: 'Kimya Özet Çalışması', class: '12-C', submitted: 30, total: 30, deadline: '2025-12-24' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Sınıf Yönetim Merkezi</h1>
                <p className="text-lg text-gray-600">Ders ve ödev takip sistemi</p>
              </div>
            </div>
            <button 
              onClick={refreshData} 
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Yenile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {stat.icon}
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.subtext}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-2">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-8 min-h-[500px]">
              {activeTab === 'lessons' && <LessonsTab />}
              {activeTab === 'homeworks' && <HomeworksTab />}
            </div>
          </div>

          <div className="space-y-6">
            {/* Upcoming Classes */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Bugünkü Dersler
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Tümü →
                </button>
              </div>
              <div className="space-y-3">
                {upcomingClasses.map((lesson) => (
                  <div key={lesson.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-900 mb-1">{lesson.title}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {lesson.students}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        {lesson.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sınıf: {lesson.room}</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Başlat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Homeworks */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-orange-600" />
                  Son Ödevler
                </h3>
                <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                  Tümü →
                </button>
              </div>
              <div className="space-y-3">
                {recentHomeworks.map((hw) => {
                  const completionRate = Math.round((hw.submitted / hw.total) * 100);
                  const isComplete = hw.submitted === hw.total;
                  const daysUntilDeadline = Math.ceil((new Date(hw.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={hw.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">{hw.title}</div>
                          <div className="text-sm text-gray-600 mb-2">Sınıf: {hw.class}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600">
                              {hw.submitted}/{hw.total} teslim edildi
                            </span>
                            <span className={`font-semibold ${isComplete ? 'text-green-600' : daysUntilDeadline <= 1 ? 'text-red-600' : 'text-orange-600'}`}>
                              {isComplete ? '✓ Tamamlandı' : `${daysUntilDeadline} gün kaldı`}
                            </span>
                          </div>
                        </div>
                        {isComplete ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-orange-500" />
                        )}
                      </div>
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isComplete ? 'bg-green-500' : completionRate >= 70 ? 'bg-blue-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          İncele
                        </button>
                        <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Yeni Ders Oluştur
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Ödev Hazırla
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Duyuru Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
