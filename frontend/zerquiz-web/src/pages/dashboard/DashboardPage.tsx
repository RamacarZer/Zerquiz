import React from 'react';
import { LayoutDashboard, TrendingUp, Users, Award, Clock, BookOpen, FileText, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.roles.includes('teacher') || user?.roles.includes('admin');
  const isStudent = user?.roles.includes('student');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            Hoş Geldiniz, {user?.name || user?.email}!
          </h1>
          <p className="mt-2 text-white/90">
            {isTeacher ? 'Öğretmen Paneli' : 'Öğrenci Paneli'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTeacher ? 'Toplam İçerik' : 'Tamamlanan Sınavlar'}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTeacher ? 'Aktif Ödevler' : 'Bekleyen Ödevler'}
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTeacher ? 'Öğrenci Sayısı' : 'Ortalama Puan'}
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {isTeacher ? '156' : '85%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                {isTeacher ? (
                  <Users className="w-6 h-6 text-green-600" />
                ) : (
                  <Award className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTeacher ? 'Ders Planları' : 'İlerleme'}
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {isTeacher ? '32' : '67%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                {isTeacher ? (
                  <BookOpen className="w-6 h-6 text-purple-600" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isTeacher ? (
              <>
                <button
                  onClick={() => navigate('/content/upload')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Dosya Yükle</p>
                </button>
                <button
                  onClick={() => navigate('/ai/auto-generator')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">AI Üret</p>
                </button>
                <button
                  onClick={() => navigate('/lessons/create')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Ders Planı</p>
                </button>
                <button
                  onClick={() => navigate('/assignments/create')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                >
                  <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Ödev Ver</p>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/exams/my-exams')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Sınavlarım</p>
                </button>
                <button
                  onClick={() => navigate('/assignments/my-assignments')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                >
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Ödevlerim</p>
                </button>
                <button
                  onClick={() => navigate('/analytics/progress')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">İlerlemem</p>
                </button>
                <button
                  onClick={() => navigate('/ai/writing-assistant')}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">AI Yardımcı</p>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Son Aktiviteler
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {isTeacher ? 'Yeni içerik yüklendi' : 'Sınav tamamlandı'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 saat önce</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {isTeacher ? 'Bekleyen İşlemler' : 'Yaklaşan Görevler'}
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {isTeacher ? 'Ödev değerlendirmesi' : 'Matematik ödevi'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Son tarih: {i} gün
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    Görüntüle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
