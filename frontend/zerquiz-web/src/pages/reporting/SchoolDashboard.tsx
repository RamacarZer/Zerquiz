import { BarChart3, Users, TrendingUp, BookOpen } from 'lucide-react';

export default function SchoolDashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Okul Yönetim Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-primary">
            <Users size={40} />
          </div>
          <div className="stat-title">Toplam Öğrenci</div>
          <div className="stat-value text-primary">1,250</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-secondary">
            <BookOpen size={40} />
          </div>
          <div className="stat-title">Tamamlanan Kitap</div>
          <div className="stat-value text-secondary">5,420</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-success">
            <TrendingUp size={40} />
          </div>
          <div className="stat-title">Ortalama Başarı</div>
          <div className="stat-value text-success">82%</div>
        </div>

        <div className="stat bg-white shadow-xl rounded-lg">
          <div className="stat-figure text-warning">
            <BarChart3 size={40} />
          </div>
          <div className="stat-title">Aktif Kullanıcı</div>
          <div className="stat-value text-warning">1,105</div>
          <div className="stat-desc">Son 7 gün</div>
        </div>
      </div>

      <div className="card bg-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Sınıf Bazlı Karşılaştırma</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Sınıf</th>
                  <th>Öğrenci Sayısı</th>
                  <th>Tamamlanan Kitap</th>
                  <th>Ortalama Skor</th>
                  <th>Okuma Süresi (dk)</th>
                </tr>
              </thead>
              <tbody>
                {[9, 10, 11, 12].map((grade) => (
                  <tr key={grade}>
                    <td className="font-semibold">{grade}. Sınıf</td>
                    <td>{Math.floor(Math.random() * 200) + 100}</td>
                    <td>{Math.floor(Math.random() * 1000) + 500}</td>
                    <td>
                      <div className="badge badge-success">
                        {Math.floor(Math.random() * 20) + 75}%
                      </div>
                    </td>
                    <td>{Math.floor(Math.random() * 50000) + 30000}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

