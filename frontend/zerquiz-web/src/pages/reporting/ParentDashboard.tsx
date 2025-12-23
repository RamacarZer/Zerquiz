import { useState } from 'react';
import { User, BookOpen, Clock, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface ChildProgress {
  childId: string;
  childName: string;
  grade: string;
  booksCompleted: number;
  readingTime: number;
  avgScore: number;
  weakTopics: string[];
  lastActivity: string;
}

export default function ParentDashboard() {
  const [children] = useState<ChildProgress[]>([
    {
      childId: '1',
      childName: 'Ahmet Yılmaz',
      grade: '9. Sınıf',
      booksCompleted: 5,
      readingTime: 320,
      avgScore: 78,
      weakTopics: ['Geometri', 'Kimyasal Tepkimeler'],
      lastActivity: '2025-12-22T10:00:00Z',
    },
    {
      childId: '2',
      childName: 'Ayşe Yılmaz',
      grade: '7. Sınıf',
      booksCompleted: 8,
      readingTime: 450,
      avgScore: 92,
      weakTopics: [],
      lastActivity: '2025-12-22T14:30:00Z',
    },
  ]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Veli Paneli</h1>

      <div className="space-y-6">
        {children.map((child) => (
          <div key={child.childId} className="card bg-white shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-blue-500 text-white rounded-full w-16">
                      <User size={32} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{child.childName}</h2>
                    <p className="text-gray-600">{child.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Son aktivite</p>
                  <p className="font-semibold">
                    {new Date(child.lastActivity).toLocaleString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-figure text-primary">
                    <BookOpen size={32} />
                  </div>
                  <div className="stat-title">Tamamlanan Kitap</div>
                  <div className="stat-value text-primary">{child.booksCompleted}</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-figure text-secondary">
                    <Clock size={32} />
                  </div>
                  <div className="stat-title">Okuma Süresi</div>
                  <div className="stat-value text-secondary">{child.readingTime}</div>
                  <div className="stat-desc">dakika</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-figure">
                    {child.avgScore >= 80 ? (
                      <CheckCircle size={32} className="text-success" />
                    ) : (
                      <TrendingDown size={32} className="text-warning" />
                    )}
                  </div>
                  <div className="stat-title">Ortalama Başarı</div>
                  <div
                    className={`stat-value ${
                      child.avgScore >= 80 ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {child.avgScore}%
                  </div>
                </div>
              </div>

              {child.weakTopics.length > 0 && (
                <div className="alert alert-warning">
                  <AlertTriangle size={20} />
                  <div>
                    <h3 className="font-bold">Geliştirilmesi Gereken Konular</h3>
                    <div className="text-sm mt-1">
                      {child.weakTopics.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

