import { DollarSign, BookOpen, Users, TrendingUp } from 'lucide-react';

export default function PublisherDashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Yayınevi Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-success">
            <DollarSign size={40} />
          </div>
          <div className="stat-title">Toplam Gelir</div>
          <div className="stat-value text-success">₺125K</div>
          <div className="stat-desc">Bu ay</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-primary">
            <BookOpen size={40} />
          </div>
          <div className="stat-title">Yayınlanan Kitap</div>
          <div className="stat-value text-primary">42</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-secondary">
            <Users size={40} />
          </div>
          <div className="stat-title">Toplam Okuyucu</div>
          <div className="stat-value text-secondary">8,520</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-warning">
            <TrendingUp size={40} />
          </div>
          <div className="stat-title">Dönüşüm Oranı</div>
          <div className="stat-value text-warning">12.5%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">En Popüler Kitaplar</h2>
            <div className="space-y-3">
              {[
                { title: 'Matematik 9. Sınıf', sales: 450, revenue: '₺12,500' },
                { title: 'Fizik Ders Kitabı', sales: 380, revenue: '₺10,800' },
                { title: 'Kimya Temelleri', sales: 320, revenue: '₺9,200' },
              ].map((book, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.sales} satış</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{book.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Aylık Gelir Trendi</h2>
            <div className="space-y-2">
              {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'].map((month, index) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-16">{month}</span>
                  <progress
                    className="progress progress-success w-full"
                    value={Math.random() * 100}
                    max="100"
                  ></progress>
                  <span className="text-sm font-semibold">
                    ₺{Math.floor(Math.random() * 50) + 80}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

