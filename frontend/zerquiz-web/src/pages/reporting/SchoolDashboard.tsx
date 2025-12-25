import { useState, useEffect } from 'react';
import {
  BarChart3, Users, TrendingUp, BookOpen, GraduationCap, Award,
  Target, Clock, Activity, TrendingDown, Calendar, Download,
  Filter, Search, Eye, ChevronRight, Star, AlertCircle, CheckCircle
} from 'lucide-react';

interface ClassData {
  grade: number;
  studentCount: number;
  booksCompleted: number;
  avgScore: number;
  readingTime: number;
  activeUsers: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopStudent {
  id: string;
  name: string;
  grade: string;
  score: number;
  booksCompleted: number;
  avatar?: string;
}

export default function SchoolDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);

  useEffect(() => {
    fetchSchoolData();
  }, [timeRange]);

  const fetchSchoolData = async () => {
    setLoading(true);
    // Mock data
    const mockClassData: ClassData[] = [
      { grade: 9, studentCount: 320, booksCompleted: 1540, avgScore: 78, readingTime: 12500, activeUsers: 285, trend: 'up' },
      { grade: 10, studentCount: 305, booksCompleted: 1320, avgScore: 82, readingTime: 11200, activeUsers: 295, trend: 'up' },
      { grade: 11, studentCount: 295, booksCompleted: 1180, avgScore: 85, readingTime: 10800, activeUsers: 280, trend: 'stable' },
      { grade: 12, studentCount: 330, booksCompleted: 1380, avgScore: 88, readingTime: 13500, activeUsers: 245, trend: 'down' },
    ];

    const mockTopStudents: TopStudent[] = [
      { id: '1', name: 'Ayşe Yılmaz', grade: '11-A', score: 98, booksCompleted: 15, avatar: 'https://i.pravatar.cc/150?img=25' },
      { id: '2', name: 'Mehmet Demir', grade: '12-B', score: 96, booksCompleted: 14, avatar: 'https://i.pravatar.cc/150?img=33' },
      { id: '3', name: 'Zeynep Kaya', grade: '10-C', score: 95, booksCompleted: 13, avatar: 'https://i.pravatar.cc/150?img=28' },
      { id: '4', name: 'Ali Öz', grade: '11-B', score: 94, booksCompleted: 12, avatar: 'https://i.pravatar.cc/150?img=52' },
      { id: '5', name: 'Fatma Şahin', grade: '9-A', score: 93, booksCompleted: 11, avatar: 'https://i.pravatar.cc/150?img=31' },
    ];

    setClassData(mockClassData);
    setTopStudents(mockTopStudents);
    setLoading(false);
  };

  const totalStudents = classData.reduce((sum, c) => sum + c.studentCount, 0);
  const totalBooks = classData.reduce((sum, c) => sum + c.booksCompleted, 0);
  const avgSchoolScore = Math.round(classData.reduce((sum, c) => sum + c.avgScore, 0) / classData.length);
  const totalActiveUsers = classData.reduce((sum, c) => sum + c.activeUsers, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Okul verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Okul Yönetim Paneli</h1>
          <p className="text-gray-600">Öğrenci performansı ve okul istatistiklerini takip edin</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'week' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Hafta
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'month' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Ay
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'year' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Yıl
              </button>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              Rapor İndir
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalStudents.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Toplam Öğrenci</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalBooks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Tamamlanan Kitap</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{avgSchoolScore}%</div>
            <div className="text-sm text-gray-600">Ortalama Başarı</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalActiveUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
            <div className="text-xs text-gray-500 mt-1">Son 7 gün</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Class Comparison Table */}
            <div className="bg-white rounded-2xl shadow-lg border">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Sınıf Bazlı Performans
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Sınıf</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Öğrenci</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Tamamlanan</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ortalama</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Okuma (dk)</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Aktif</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {classData.map((cls) => (
                      <tr key={cls.grade} className="hover:bg-gray-50 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {cls.grade}
                            </div>
                            <span className="font-semibold text-gray-900">{cls.grade}. Sınıf</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-gray-900">{cls.studentCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-gray-900">{cls.booksCompleted}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                            cls.avgScore >= 85 ? 'bg-green-100 text-green-700' :
                            cls.avgScore >= 70 ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {cls.avgScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-700 font-medium">{cls.readingTime.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-700 font-medium">{cls.activeUsers}/{cls.studentCount}</span>
                          <div className="text-xs text-gray-500">
                            {Math.round((cls.activeUsers / cls.studentCount) * 100)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {cls.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />}
                          {cls.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500 mx-auto" />}
                          {cls.trend === 'stable' && <div className="w-5 h-1 bg-gray-400 rounded mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Performans İçgörüleri
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">En Başarılı Sınıf: 12. Sınıf</div>
                    <div className="text-sm text-gray-600">Ortalama %88 başarı oranı ile okul birincisi</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">En Aktif Kullanım: 10. Sınıf</div>
                    <div className="text-sm text-gray-600">%97 aktif kullanıcı oranı</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Dikkat: 9. Sınıf</div>
                    <div className="text-sm text-gray-600">Ortalama puanı artırma potansiyeli var</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Top Students */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-600" />
                En Başarılı Öğrenciler
              </h3>
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                          'bg-gradient-to-br from-orange-400 to-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-200">
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.grade}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{student.score}</div>
                      <div className="text-xs text-gray-500">{student.booksCompleted} kitap</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Detaylı Rapor</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Sınıf Karşılaştır</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Öğretmen Görüşleri</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
