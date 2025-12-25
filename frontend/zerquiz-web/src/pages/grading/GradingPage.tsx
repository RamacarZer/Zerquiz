import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, TrendingUp, Award, Clock, CheckCircle,
  FileText, Calendar, Eye, Download, Filter, Search, Star,
  Target, Activity, PieChart, AlertCircle, ChevronRight,
  BookOpen, GraduationCap, TrendingDown
} from 'lucide-react';

interface ExamSummary {
  id: string;
  title: string;
  date: string;
  type: string;
  totalStudents: number;
  averageScore: number;
  passRate: number;
  status: 'completed' | 'grading' | 'scheduled';
  gradedCount: number;
  duration: number;
}

interface GradingStats {
  totalExams: number;
  completedExams: number;
  pendingGrading: number;
  totalStudents: number;
  averageSuccessRate: number;
  totalGradingTime: number;
}

export default function GradingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'grading' | 'scheduled'>('all');
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [stats, setStats] = useState<GradingStats | null>(null);

  useEffect(() => {
    fetchGradingData();
  }, []);

  const fetchGradingData = async () => {
    setLoading(true);
    // Mock data
    const mockExams: ExamSummary[] = [
      {
        id: '1',
        title: 'Matematik Final Sınavı - 10.Sınıf',
        date: '2025-12-20',
        type: 'Final',
        totalStudents: 145,
        averageScore: 78.5,
        passRate: 85,
        status: 'completed',
        gradedCount: 145,
        duration: 90,
      },
      {
        id: '2',
        title: 'Fizik Ara Sınav - 11.Sınıf',
        date: '2025-12-22',
        type: 'Ara Sınav',
        totalStudents: 128,
        averageScore: 72.3,
        passRate: 78,
        status: 'grading',
        gradedCount: 98,
        duration: 60,
      },
      {
        id: '3',
        title: 'Kimya Deneme Sınavı - 12.Sınıf',
        date: '2025-12-18',
        type: 'Deneme',
        totalStudents: 132,
        averageScore: 82.1,
        passRate: 92,
        status: 'completed',
        gradedCount: 132,
        duration: 75,
      },
      {
        id: '4',
        title: 'İngilizce Quiz - 9.Sınıf',
        date: '2025-12-25',
        type: 'Quiz',
        totalStudents: 156,
        averageScore: 0,
        passRate: 0,
        status: 'scheduled',
        gradedCount: 0,
        duration: 45,
      },
      {
        id: '5',
        title: 'Biyoloji Vize Sınavı - 11.Sınıf',
        date: '2025-12-23',
        type: 'Vize',
        totalStudents: 118,
        averageScore: 68.9,
        passRate: 72,
        status: 'grading',
        gradedCount: 65,
        duration: 60,
      },
    ];

    const mockStats: GradingStats = {
      totalExams: 5,
      completedExams: 2,
      pendingGrading: 2,
      totalStudents: 679,
      averageSuccessRate: 81.75,
      totalGradingTime: 330,
    };

    setExams(mockExams);
    setStats(mockStats);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"><CheckCircle className="w-4 h-4" />Tamamlandı</span>;
      case 'grading':
        return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"><Clock className="w-4 h-4" />Not Giriliyor</span>;
      case 'scheduled':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"><Calendar className="w-4 h-4" />Planlandı</span>;
      default:
        return null;
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const recentGrades = [
    { student: 'Ayşe Yılmaz', exam: 'Matematik Final', score: 95, grade: 'A+', date: '2025-12-20' },
    { student: 'Mehmet Kaya', exam: 'Fizik Ara Sınav', score: 88, grade: 'B+', date: '2025-12-22' },
    { student: 'Zeynep Demir', exam: 'Kimya Deneme', score: 92, grade: 'A', date: '2025-12-18' },
    { student: 'Ali Öz', exam: 'Matematik Final', score: 78, grade: 'B-', date: '2025-12-20' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Notlandırma verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notlandırma & Değerlendirme Merkezi</h1>
          <p className="text-gray-600">Sınav sonuçlarını değerlendirin ve raporlayın</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalExams}</div>
              <div className="text-sm text-gray-600 mb-2">Toplam Sınav</div>
              <div className="text-xs text-green-600 font-semibold">{stats.completedExams} tamamlandı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingGrading}</div>
              <div className="text-sm text-gray-600 mb-2">Not Giriliyor</div>
              <div className="text-xs text-orange-600 font-semibold">İşlem bekliyor</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600 mb-2">Toplam Öğrenci</div>
              <div className="text-xs text-gray-500">Değerlendirme yapıldı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">%{stats.averageSuccessRate}</div>
              <div className="text-sm text-gray-600 mb-2">Ortalama Başarı</div>
              <div className="text-xs text-purple-600 font-semibold">Genel ortalama</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Sınav adı ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'completed' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tamamlanan
                  </button>
                  <button
                    onClick={() => setFilterStatus('grading')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'grading' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Not Giriliyor
                  </button>
                </div>
              </div>
            </div>

            {/* Exams List */}
            <div className="space-y-4">
              {filteredExams.map((exam) => {
                const gradingProgress = Math.round((exam.gradedCount / exam.totalStudents) * 100);
                
                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all p-6 cursor-pointer"
                    onClick={() => navigate(`/grading/exam/${exam.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                          {getStatusBadge(exam.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(exam.date).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {exam.totalStudents} öğrenci
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exam.duration} dk
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {exam.type}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>

                    {exam.status !== 'scheduled' && (
                      <>
                        {/* Progress Bar for Grading */}
                        {exam.status === 'grading' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2 text-sm">
                              <span className="text-gray-600 font-medium">Not Girme İlerlemesi</span>
                              <span className="font-bold text-gray-900">{gradingProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                                style={{ width: `${gradingProgress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {exam.gradedCount} / {exam.totalStudents} öğrenci notlandırıldı
                            </div>
                          </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                            <div className="text-sm text-blue-600 mb-1">Ortalama</div>
                            <div className="text-2xl font-bold text-blue-900">{exam.averageScore}</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                            <div className="text-sm text-green-600 mb-1">Başarı Oranı</div>
                            <div className="text-2xl font-bold text-green-900">%{exam.passRate}</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                            <div className="text-sm text-purple-600 mb-1">Durum</div>
                            <div className="text-lg font-bold text-purple-900">
                              {exam.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {exam.status === 'scheduled' && (
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-700 font-semibold">
                          Sınav henüz yapılmadı
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredExams.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sınav Bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinize uygun sınav bulunmamaktadır.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Recent Grades */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Son Notlar
              </h3>
              <div className="space-y-3">
                {recentGrades.map((grade, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{grade.student}</div>
                        <div className="text-sm text-gray-600">{grade.exam}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{grade.score}</div>
                        <div className="text-sm font-semibold text-green-600">{grade.grade}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(grade.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-600" />
                Not Dağılımı
              </h3>
              <div className="space-y-3">
                {[
                  { grade: 'A+', count: 45, color: 'bg-green-500', percent: 15 },
                  { grade: 'A', count: 68, color: 'bg-green-400', percent: 22 },
                  { grade: 'B+', count: 82, color: 'bg-blue-500', percent: 27 },
                  { grade: 'B', count: 65, color: 'bg-blue-400', percent: 21 },
                  { grade: 'C+', count: 38, color: 'bg-yellow-500', percent: 12 },
                  { grade: 'F', count: 9, color: 'bg-red-500', percent: 3 },
                ].map((item) => (
                  <div key={item.grade}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-semibold text-gray-700">{item.grade}</span>
                      <span className="font-bold text-gray-900">{item.count} öğrenci</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Toplu Not Girişi</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Excel'den İçe Aktar</span>
                  <Download className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Rapor Oluştur</span>
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
