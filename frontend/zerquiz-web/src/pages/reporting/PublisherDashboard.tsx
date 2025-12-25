import { useState, useEffect } from 'react';
import {
  DollarSign, BookOpen, Users, TrendingUp, Eye, Download, Star,
  BarChart3, PieChart, Calendar, Award, Package, Activity,
  TrendingDown, Filter, Search, ChevronRight, ShoppingCart
} from 'lucide-react';

interface BookStat {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  sales: number;
  revenue: number;
  readers: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface MonthlyData {
  month: string;
  revenue: number;
  sales: number;
}

export default function PublisherDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [topBooks, setTopBooks] = useState<BookStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    fetchPublisherData();
  }, [timeRange]);

  const fetchPublisherData = async () => {
    setLoading(true);
    // Mock data
    const mockTopBooks: BookStat[] = [
      {
        id: '1',
        title: 'Matematik 10. Sınıf - Konu Anlatımlı',
        category: 'Matematik',
        coverUrl: 'https://https://via.placeholder.com/150/4F46E5/FFFFFF?text=MATH',
        sales: 1250,
        revenue: 37500,
        readers: 3420,
        rating: 4.8,
        trend: 'up',
      },
      {
        id: '2',
        title: 'Fizik Temelleri',
        category: 'Fizik',
        coverUrl: 'https://https://via.placeholder.com/150/06B6D4/FFFFFF?text=PHYSICS',
        sales: 980,
        revenue: 29400,
        readers: 2850,
        rating: 4.6,
        trend: 'up',
      },
      {
        id: '3',
        title: 'İngilizce Grammar Pro',
        category: 'Yabancı Dil',
        coverUrl: 'https://https://via.placeholder.com/150/10B981/FFFFFF?text=ENG',
        sales: 850,
        revenue: 25500,
        readers: 2340,
        rating: 4.9,
        trend: 'stable',
      },
      {
        id: '4',
        title: 'Kimya - Organik Kimya',
        category: 'Kimya',
        coverUrl: 'https://https://via.placeholder.com/150/F59E0B/FFFFFF?text=CHEM',
        sales: 720,
        revenue: 21600,
        readers: 1980,
        rating: 4.5,
        trend: 'down',
      },
    ];

    const mockMonthlyData: MonthlyData[] = [
      { month: 'Haz', revenue: 95000, sales: 3200 },
      { month: 'Tem', revenue: 105000, sales: 3500 },
      { month: 'Ağu', revenue: 98000, sales: 3280 },
      { month: 'Eyl', revenue: 125000, sales: 4200 },
      { month: 'Eki', revenue: 135000, sales: 4500 },
      { month: 'Kas', revenue: 142000, sales: 4730 },
      { month: 'Ara', revenue: 158000, sales: 5280 },
    ];

    setTopBooks(mockTopBooks);
    setMonthlyData(mockMonthlyData);
    setLoading(false);
  };

  const totalRevenue = topBooks.reduce((sum, b) => sum + b.revenue, 0);
  const totalSales = topBooks.reduce((sum, b) => sum + b.sales, 0);
  const totalReaders = topBooks.reduce((sum, b) => sum + b.readers, 0);
  const avgRating = (topBooks.reduce((sum, b) => sum + b.rating, 0) / topBooks.length).toFixed(1);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Yayınevi verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Yayınevi Analitik Paneli</h1>
          <p className="text-gray-600">Kitap satışları, gelir ve okuyucu istatistiklerinizi takip edin</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'week' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Hafta
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'month' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Ay
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeRange === 'year' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bu Yıl
              </button>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              Finansal Rapor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">₺{totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-2">Toplam Gelir</div>
            <div className="text-xs text-green-600 font-semibold">+15.3% bu ay</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalSales.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-2">Toplam Satış</div>
            <div className="text-xs text-gray-500">Son 30 gün</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalReaders.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-2">Toplam Okuyucu</div>
            <div className="text-xs text-gray-500">Aktif okuyucu sayısı</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{avgRating}</div>
            <div className="text-sm text-gray-600 mb-2">Ortalama Puan</div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= parseFloat(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Aylık Gelir Trendi
              </h3>
              <div className="flex items-end justify-between h-64 gap-2">
                {monthlyData.map((data, idx) => {
                  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                  const height = (data.revenue / maxRevenue) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-bold text-gray-900 mb-2">₺{(data.revenue / 1000).toFixed(0)}K</div>
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-green-500 to-emerald-400 hover:opacity-80 cursor-pointer transition-all"
                        style={{ height: `${height}%` }}
                        title={`${data.revenue.toLocaleString()}₺`}
                      />
                      <div className="mt-2 text-xs font-semibold text-gray-600">{data.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Books Table */}
            <div className="bg-white rounded-2xl shadow-lg border">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  En Popüler Kitaplar
                </h3>
              </div>
              <div className="divide-y">
                {topBooks.map((book, index) => (
                  <div key={book.id} className="p-6 hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                          'bg-gradient-to-br from-blue-400 to-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 mb-1">{book.title}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {book.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {book.rating}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{book.sales}</div>
                          <div className="text-xs text-gray-600">Satış</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">₺{(book.revenue / 1000).toFixed(1)}K</div>
                          <div className="text-xs text-gray-600">Gelir</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{book.readers}</div>
                          <div className="text-xs text-gray-600">Okuyucu</div>
                        </div>
                      </div>
                      <div>
                        {book.trend === 'up' && <TrendingUp className="w-6 h-6 text-green-500" />}
                        {book.trend === 'down' && <TrendingDown className="w-6 h-6 text-red-500" />}
                        {book.trend === 'stable' && <div className="w-6 h-1 bg-gray-400 rounded" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-600" />
                Kategori Dağılımı
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Matematik', percent: 35, color: 'bg-blue-500' },
                  { name: 'Fizik', percent: 25, color: 'bg-green-500' },
                  { name: 'Yabancı Dil', percent: 20, color: 'bg-purple-500' },
                  { name: 'Kimya', percent: 15, color: 'bg-orange-500' },
                  { name: 'Diğer', percent: 5, color: 'bg-gray-400' },
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-semibold text-gray-700">{cat.name}</span>
                      <span className="font-bold text-gray-900">{cat.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Son Aktiviteler
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Yeni kitap eklendi', book: 'Geometri 11', time: '2 saat önce', type: 'success' },
                  { action: 'Kitap güncellendi', book: 'Fizik Temelleri', time: '5 saat önce', type: 'info' },
                  { action: 'Satış gerçekleşti', book: 'Matematik 10', time: '1 gün önce', type: 'success' },
                  { action: 'İnceleme eklendi', book: 'İngilizce Grammar', time: '2 gün önce', type: 'info' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.book}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Yeni Kitap Ekle</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Satış Raporu</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-all text-left px-4 flex items-center justify-between">
                  <span>Sözleşme Yönetimi</span>
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
