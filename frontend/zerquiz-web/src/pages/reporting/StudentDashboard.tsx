import { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface ProgressData {
  totalBooks: number;
  booksCompleted: number;
  totalReadTime: number; // minutes
  currentStreak: number; // days
  vocabularyCount: number;
  avgScore: number;
}

interface BookProgress {
  bookId: string;
  bookTitle: string;
  progress: number; // percentage
  lastReadAt: string;
  coverImageUrl?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export default function StudentDashboard() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from reporting API
      const mockProgressData: ProgressData = {
        totalBooks: 12,
        booksCompleted: 5,
        totalReadTime: 450,
        currentStreak: 7,
        vocabularyCount: 245,
        avgScore: 85,
      };

      const mockBookProgress: BookProgress[] = [
        {
          bookId: '1',
          bookTitle: 'Matematik 9. Sınıf',
          progress: 75,
          lastReadAt: '2025-12-22T10:00:00Z',
          coverImageUrl: 'https://https://via.placeholder.com/150/FF0000/FFFFFF?text=MATH',
        },
        {
          bookId: '2',
          bookTitle: 'Fizik Ders Kitabı',
          progress: 45,
          lastReadAt: '2025-12-21T15:30:00Z',
          coverImageUrl: 'https://https://via.placeholder.com/150/00FF00/FFFFFF?text=PHYSICS',
        },
        {
          bookId: '3',
          bookTitle: 'Kimya Kitabı',
          progress: 30,
          lastReadAt: '2025-12-20T09:15:00Z',
          coverImageUrl: 'https://https://via.placeholder.com/150/0000FF/FFFFFF?text=CHEM',
        },
      ];

      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: '7 Günlük Seri',
          description: '7 gün üst üste okuma yaptın!',
          unlockedAt: '2025-12-22',
          icon: '🔥',
        },
        {
          id: '2',
          title: 'İlk Kitap',
          description: 'İlk kitabını tamamladın',
          unlockedAt: '2025-12-15',
          icon: '📚',
        },
        {
          id: '3',
          title: 'Kelime Avcısı',
          description: '100 kelime öğrendin',
          unlockedAt: '2025-12-10',
          icon: '🎯',
        },
      ];

      setProgressData(mockProgressData);
      setBookProgress(mockBookProgress);
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gösterge Paneli</h1>
          <p className="text-gray-600 mt-1">İlerlemeni ve başarılarını takip et</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Son güncelleme</p>
          <p className="font-semibold">{new Date().toLocaleDateString('tr-TR')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl rounded-lg">
          <div className="stat-figure text-white opacity-30">
            <BookOpen size={48} />
          </div>
          <div className="stat-title text-blue-100">Tamamlanan Kitaplar</div>
          <div className="stat-value">
            {progressData?.booksCompleted}/{progressData?.totalBooks}
          </div>
        </div>

        <div className="stat bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl rounded-lg">
          <div className="stat-figure text-white opacity-30">
            <Clock size={48} />
          </div>
          <div className="stat-title text-green-100">Okuma Süresi</div>
          <div className="stat-value">{progressData?.totalReadTime}</div>
          <div className="stat-desc text-green-100">dakika</div>
        </div>

        <div className="stat bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl rounded-lg">
          <div className="stat-figure text-white opacity-30">
            <Target size={48} />
          </div>
          <div className="stat-title text-orange-100">Öğrenilen Kelime</div>
          <div className="stat-value">{progressData?.vocabularyCount}</div>
        </div>

        <div className="stat bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl rounded-lg">
          <div className="stat-figure text-white opacity-30">
            <TrendingUp size={48} />
          </div>
          <div className="stat-title text-purple-100">Ortalama Skor</div>
          <div className="stat-value">{progressData?.avgScore}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Progress */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <BarChart3 size={24} className="text-blue-600" />
                Devam Eden Kitaplar
              </h2>

              <div className="space-y-4">
                {bookProgress.map((book) => (
                  <div key={book.bookId} className="flex items-center gap-4">
                    <img
                      src={book.coverImageUrl}
                      alt={book.bookTitle}
                      className="w-16 h-20 object-cover rounded shadow"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{book.bookTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Son okuma:{' '}
                        {new Date(book.lastReadAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <div className="flex items-center gap-3">
                        <progress
                          className="progress progress-primary w-full"
                          value={book.progress}
                          max="100"
                        ></progress>
                        <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
                          %{book.progress}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Award size={24} className="text-yellow-500" />
                Başarılar
              </h2>

              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-sm text-gray-600">
                  3 / 10 başarı kazandın
                </p>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="card bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl mt-6">
            <div className="card-body text-center">
              <div className="text-6xl mb-2">🔥</div>
              <div className="text-4xl font-bold mb-2">{progressData?.currentStreak}</div>
              <p className="text-sm opacity-90">gün üst üste okuma</p>
              <p className="text-xs opacity-75 mt-2">Serini devam ettir!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

