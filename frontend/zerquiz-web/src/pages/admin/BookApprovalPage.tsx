import { useState, useEffect } from 'react';
import { 
  Check, X, Eye, Clock, AlertCircle, BookOpen, User, Calendar,
  MessageSquare, FileText, Download, Star, TrendingUp, Filter,
  Search, ChevronDown, CheckCircle, XCircle, Upload
} from 'lucide-react';

interface BookSubmission {
  id: string;
  bookId: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  grade: string;
  pageCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  submittedAt: string;
  submittedBy: string;
  coverImageUrl?: string;
  reviewNotes?: string;
  priority: 'low' | 'medium' | 'high';
  fileSize: string;
  format: string;
}

export default function BookApprovalPage() {
  const [submissions, setSubmissions] = useState<BookSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'in_review'>('pending');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<BookSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    // Mock data
    const mockData: BookSubmission[] = [
      {
        id: '1',
        bookId: 'book_1',
        title: 'Matematik 10. Sınıf - Konu Anlatımlı',
        author: 'Prof. Dr. Ali Yılmaz',
        publisher: 'ABC Yayınevi',
        category: 'Matematik',
        grade: '10. Sınıf',
        pageCount: 320,
        status: 'pending',
        submittedAt: '2025-12-22T10:00:00Z',
        submittedBy: 'Ali Yılmaz',
        coverImageUrl: 'https://https://via.placeholder.com/150/4F46E5/FFFFFF?text=MATH',
        priority: 'high',
        fileSize: '45 MB',
        format: 'PDF',
      },
      {
        id: '2',
        bookId: 'book_2',
        title: 'Fizik Temelleri - Üniversiteye Hazırlık',
        author: 'Dr. Ayşe Demir',
        publisher: 'Bilim Yayınları',
        category: 'Fizik',
        grade: '11. Sınıf',
        pageCount: 280,
        status: 'pending',
        submittedAt: '2025-12-21T15:30:00Z',
        submittedBy: 'Ayşe Demir',
        coverImageUrl: 'https://https://via.placeholder.com/150/06B6D4/FFFFFF?text=PHYSICS',
        priority: 'medium',
        fileSize: '38 MB',
        format: 'PDF',
      },
      {
        id: '3',
        bookId: 'book_3',
        title: 'Kimya - Organik Kimyaya Giriş',
        author: 'Doç. Dr. Mehmet Öz',
        publisher: 'Fen Bilimleri Yayınevi',
        category: 'Kimya',
        grade: '12. Sınıf',
        pageCount: 245,
        status: 'in_review',
        submittedAt: '2025-12-20T09:00:00Z',
        submittedBy: 'Mehmet Öz',
        coverImageUrl: 'https://https://via.placeholder.com/150/10B981/FFFFFF?text=CHEM',
        priority: 'low',
        fileSize: '32 MB',
        format: 'PDF',
      },
      {
        id: '4',
        bookId: 'book_4',
        title: 'Türk Dili ve Edebiyatı - Şiir İnceleme',
        author: 'Fatma Şahin',
        publisher: 'Edebiyat Dünyası',
        category: 'Edebiyat',
        grade: '9. Sınıf',
        pageCount: 198,
        status: 'approved',
        submittedAt: '2025-12-19T14:00:00Z',
        submittedBy: 'Fatma Şahin',
        coverImageUrl: 'https://https://via.placeholder.com/150/F59E0B/FFFFFF?text=LIT',
        reviewNotes: 'İçerik kaliteli, MEB müfredatına uygun.',
        priority: 'medium',
        fileSize: '28 MB',
        format: 'PDF',
      },
      {
        id: '5',
        bookId: 'book_5',
        title: 'İngilizce Grammar Exercises',
        author: 'John Smith',
        publisher: 'Language Masters',
        category: 'Yabancı Dil',
        grade: '10. Sınıf',
        pageCount: 156,
        status: 'rejected',
        submittedAt: '2025-12-18T11:00:00Z',
        submittedBy: 'John Smith',
        coverImageUrl: 'https://https://via.placeholder.com/150/EF4444/FFFFFF?text=ENG',
        reviewNotes: 'Telif hakkı problemi tespit edildi.',
        priority: 'low',
        fileSize: '22 MB',
        format: 'PDF',
      },
    ];
    setSubmissions(mockData);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    if (window.confirm(`"${submission.title}" kitabını onaylamak istediğinize emin misiniz?`)) {
      setSubmissions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, status: 'approved' as const, reviewNotes: 'Onaylandı' } : sub))
      );
      alert('Kitap başarıyla onaylandı! ✓');
    }
  };

  const handleReject = async (id: string) => {
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    const reason = prompt('Ret nedeni:');
    if (!reason) return;

    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === id ? { ...sub, status: 'rejected' as const, reviewNotes: reason } : sub
      )
    );
    alert('Kitap reddedildi.');
  };

  const handleReview = (submission: BookSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold"><Clock className="w-4 h-4" />Bekliyor</span>;
      case 'in_review':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"><Eye className="w-4 h-4" />İnceleniyor</span>;
      case 'approved':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"><CheckCircle className="w-4 h-4" />Onaylandı</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"><XCircle className="w-4 h-4" />Reddedildi</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Yüksek</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">Orta</span>;
      case 'low':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">Düşük</span>;
      default:
        return null;
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    inReview: submissions.filter(s => s.status === 'in_review').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Başvurular yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kitap Onay Paneli</h1>
          <p className="text-gray-600">Yayınevleri tarafından gönderilen kitapları inceleyin ve onaylayın</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam Başvuru</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-4 text-white">
            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
            <div className="text-sm opacity-90">Bekliyor</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
            <div className="text-3xl font-bold mb-1">{stats.inReview}</div>
            <div className="text-sm opacity-90">İnceleniyor</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
            <div className="text-sm opacity-90">Onaylandı</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
            <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
            <div className="text-sm opacity-90">Reddedildi</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Kitap adı veya yazar ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'pending' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bekliyor
              </button>
              <button
                onClick={() => setFilter('in_review')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'in_review' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                İnceleniyor
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'approved' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Onaylandı
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'rejected' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reddedildi
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-44 rounded-xl overflow-hidden shadow-lg">
                      {submission.coverImageUrl ? (
                        <img
                          src={submission.coverImageUrl}
                          alt={submission.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{submission.title}</h3>
                          {getPriorityBadge(submission.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {submission.author}
                          </span>
                          <span>•</span>
                          <span>{submission.publisher}</span>
                          <span>•</span>
                          <span>{submission.category}</span>
                          <span>•</span>
                          <span>{submission.grade}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {submission.pageCount} sayfa
                          </span>
                          <span className="flex items-center gap-1">
                            <Upload className="w-4 h-4" />
                            {submission.fileSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>

                    {/* Review Notes */}
                    {submission.reviewNotes && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-1">İnceleme Notu:</div>
                            <div className="text-sm text-gray-600">{submission.reviewNotes}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview(submission)}
                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        Detaylı İncele
                      </button>
                      {submission.status === 'pending' || submission.status === 'in_review' ? (
                        <>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="py-3 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="py-3 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            Reddet
                          </button>
                        </>
                      ) : (
                        <button className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          İndir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Başvuru Bulunamadı</h3>
            <p className="text-gray-600">Seçili filtrelere uygun kitap başvurusu bulunmamaktadır.</p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Detaylı İnceleme</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedSubmission.coverImageUrl || 'https://https://via.placeholder.com/300/4F46E5/FFFFFF?text=BOOK'}
                      alt={selectedSubmission.title}
                      className="w-full rounded-2xl shadow-xl"
                    />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubmission.title}</h3>
                      <p className="text-gray-600">{selectedSubmission.author}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-1">Yayınevi</div>
                        <div className="font-semibold text-gray-900">{selectedSubmission.publisher}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-1">Kategori</div>
                        <div className="font-semibold text-gray-900">{selectedSubmission.category}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-1">Sınıf</div>
                        <div className="font-semibold text-gray-900">{selectedSubmission.grade}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-1">Sayfa Sayısı</div>
                        <div className="font-semibold text-gray-900">{selectedSubmission.pageCount}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleApprove(selectedSubmission.id);
                          setShowDetailModal(false);
                        }}
                        className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedSubmission.id);
                          setShowDetailModal(false);
                        }}
                        className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
