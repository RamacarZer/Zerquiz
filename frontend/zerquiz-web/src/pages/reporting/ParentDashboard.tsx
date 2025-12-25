import { useState, useEffect } from 'react';
import {
  User, BookOpen, Clock, TrendingDown, AlertTriangle, CheckCircle,
  TrendingUp, Award, Target, Calendar, Bell, Activity, BarChart3,
  PieChart, Users, Star, MessageSquare, FileText, Eye, ChevronRight
} from 'lucide-react';

interface ChildProgress {
  childId: string;
  childName: string;
  grade: string;
  school: string;
  avatar?: string;
  booksCompleted: number;
  booksInProgress: number;
  readingTime: number;
  avgScore: number;
  weakTopics: string[];
  strongTopics: string[];
  lastActivity: string;
  weeklyProgress: number[];
  achievements: Array<{ id: string; title: string; icon: string }>;
  upcomingHomeworks: Array<{ id: string; title: string; dueDate: string }>;
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildrenProgress();
  }, []);

  const fetchChildrenProgress = async () => {
    setLoading(true);
    // Mock data
    const mockData: ChildProgress[] = [
      {
        childId: '1',
        childName: 'Ahmet Yılmaz',
        grade: '9. Sınıf',
        school: 'Atatürk Anadolu Lisesi',
        avatar: 'https://i.pravatar.cc/150?img=33',
        booksCompleted: 5,
        booksInProgress: 2,
        readingTime: 320,
        avgScore: 78,
        weakTopics: ['Geometri', 'Kimyasal Tepkimeler', 'İngilizce Grammar'],
        strongTopics: ['Türk Edebiyatı', 'Tarih', 'Coğrafya'],
        lastActivity: '2025-12-22T10:00:00Z',
        weeklyProgress: [65, 72, 68, 75, 78, 82, 78],
        achievements: [
          { id: '1', title: '5 Kitap Tamamlandı', icon: '📚' },
          { id: '2', title: '7 Günlük Seri', icon: '🔥' },
        ],
        upcomingHomeworks: [
          { id: '1', title: 'Matematik Problemleri', dueDate: '2025-12-25' },
          { id: '2', title: 'Fizik Deney Raporu', dueDate: '2025-12-27' },
        ],
      },
      {
        childId: '2',
        childName: 'Ayşe Yılmaz',
        grade: '7. Sınıf',
        school: 'Atatürk Anadolu Lisesi',
        avatar: 'https://i.pravatar.cc/150?img=25',
        booksCompleted: 8,
        booksInProgress: 3,
        readingTime: 450,
        avgScore: 92,
        weakTopics: [],
        strongTopics: ['Matematik', 'Fen Bilimleri', 'İngilizce', 'Türkçe'],
        lastActivity: '2025-12-22T14:30:00Z',
        weeklyProgress: [88, 90, 92, 89, 91, 94, 92],
        achievements: [
          { id: '1', title: '8 Kitap Tamamlandı', icon: '📚' },
          { id: '2', title: '14 Günlük Seri', icon: '🔥' },
          { id: '3', title: 'Mükemmel Puan', icon: '⭐' },
        ],
        upcomingHomeworks: [
          { id: '1', title: 'Türkçe Kompozisyon', dueDate: '2025-12-24' },
        ],
      },
    ];

    setChildren(mockData);
    if (mockData.length > 0) {
      setSelectedChild(mockData[0].childId);
    }
    setLoading(false);
  };

  const currentChild = children.find(c => c.id === selectedChild);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Öğrenci bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Veli Paneli</h1>
          <p className="text-gray-600">Çocuklarınızın akademik gelişimini takip edin</p>
        </div>

        {/* Child Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {children.map((child) => (
            <button
              key={child.childId}
              onClick={() => setSelectedChild(child.childId)}
              className={`text-left bg-white rounded-2xl shadow-lg border-2 p-6 transition-all hover:shadow-xl ${
                selectedChild === child.childId ? 'border-purple-500 ring-4 ring-purple-100' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-purple-100">
                  {child.avatar ? (
                    <img src={child.avatar} alt={child.childName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                      {child.childName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{child.childName}</h3>
                  <p className="text-gray-600">{child.grade} • {child.school}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Son aktivite: {new Date(child.lastActivity).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-600">{child.booksCompleted}</div>
                  <div className="text-xs text-gray-600">Tamamlanan</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-600">{child.avgScore}</div>
                  <div className="text-xs text-gray-600">Ortalama</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-purple-600">{child.readingTime}dk</div>
                  <div className="text-xs text-gray-600">Okuma</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {currentChild && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{currentChild.booksCompleted}</div>
                <div className="text-sm text-gray-600 mb-2">Tamamlanan Kitap</div>
                <div className="text-xs text-green-600 font-semibold">+{currentChild.booksInProgress} devam ediyor</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{currentChild.readingTime}</div>
                <div className="text-sm text-gray-600 mb-2">Dakika Okuma</div>
                <div className="text-xs text-gray-500">Bu ay</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <BarChart3 className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{currentChild.avgScore}</div>
                <div className="text-sm text-gray-600 mb-2">Ortalama Puan</div>
                <div className={`text-xs font-semibold ${currentChild.avgScore >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                  {currentChild.avgScore >= 85 ? 'Çok İyi' : 'Geliştirilebilir'}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{currentChild.achievements.length}</div>
                <div className="text-sm text-gray-600 mb-2">Başarı Rozeti</div>
                <div className="text-xs text-gray-500">Kazanıldı</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Weekly Progress Chart */}
                <div className="bg-white rounded-2xl shadow-lg border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    Haftalık Performans
                  </h3>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {currentChild.weeklyProgress.map((score, idx) => {
                      const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
                      const height = (score / 100) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                              score >= 85 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                              score >= 70 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                              'bg-gradient-to-t from-orange-500 to-orange-400'
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${score} puan`}
                          />
                          <div className="mt-2 text-xs font-semibold text-gray-600">{days[idx]}</div>
                          <div className="text-sm font-bold text-gray-900">{score}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Topics Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Konu Analizi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-900">Güçlü Konular</h4>
                      </div>
                      {currentChild.strongTopics.length > 0 ? (
                        <div className="space-y-2">
                          {currentChild.strongTopics.map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-gray-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Henüz veri yok</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h4 className="font-bold text-gray-900">Geliştirilmesi Gerekenler</h4>
                      </div>
                      {currentChild.weakTopics.length > 0 ? (
                        <div className="space-y-2">
                          {currentChild.weakTopics.map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span className="text-gray-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Tüm konularda başarılı!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Achievements */}
                <div className="bg-white rounded-2xl shadow-lg border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                    Başarı Rozetleri
                  </h3>
                  <div className="space-y-3">
                    {currentChild.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{achievement.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Homeworks */}
                <div className="bg-white rounded-2xl shadow-lg border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Yaklaşan Ödevler
                  </h3>
                  <div className="space-y-3">
                    {currentChild.upcomingHomeworks.map((homework) => {
                      const daysUntilDue = Math.ceil((new Date(homework.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={homework.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                          <div className="font-semibold text-gray-900 mb-2">{homework.title}</div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {new Date(homework.dueDate).toLocaleDateString('tr-TR')}
                            </span>
                            <span className={`font-semibold ${daysUntilDue <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                              {daysUntilDue} gün kaldı
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Teacher */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Öğretmenle İletişim
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Öğretmenlerinizle iletişime geçin ve çocuğunuzun gelişimi hakkında bilgi alın.
                  </p>
                  <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
                    Mesaj Gönder
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
