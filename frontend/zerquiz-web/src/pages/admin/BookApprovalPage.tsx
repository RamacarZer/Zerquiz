import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, AlertCircle } from 'lucide-react';

interface BookSubmission {
  id: string;
  bookId: string;
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  submittedBy: string;
  coverImageUrl?: string;
  reviewNotes?: string;
}

export default function BookApprovalPage() {
  const [submissions, setSubmissions] = useState<BookSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

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
        title: 'Matematik 10. Sınıf',
        author: 'Prof. Dr. Ali Yılmaz',
        status: 'pending',
        submittedAt: '2025-12-22T10:00:00Z',
        submittedBy: 'user_123',
        coverImageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        bookId: 'book_2',
        title: 'Fizik Temelleri',
        author: 'Dr. Ayşe Demir',
        status: 'pending',
        submittedAt: '2025-12-21T15:30:00Z',
        submittedBy: 'user_456',
        coverImageUrl: 'https://via.placeholder.com/150',
      },
    ];
    setSubmissions(mockData);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'approved' as const } : sub))
    );
    alert('Kitap onaylandı!');
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Ret nedeni:');
    if (!reason) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: 'rejected' as const, reviewNotes: reason } : sub
      )
    );
    alert('Kitap reddedildi.');
  };

  const filteredSubmissions = submissions.filter((sub) =>
    filter === 'all' ? true : sub.status === filter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kitap Onay Paneli</h1>

      {/* Filters */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tümü ({submissions.length})
        </a>
        <a
          className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Bekleyen ({submissions.filter((s) => s.status === 'pending').length})
        </a>
        <a
          className={`tab ${filter === 'approved' ? 'tab-active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Onaylanan ({submissions.filter((s) => s.status === 'approved').length})
        </a>
        <a
          className={`tab ${filter === 'rejected' ? 'tab-active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Reddedilen ({submissions.filter((s) => s.status === 'rejected').length})
        </a>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Bu kategoride kitap bulunmuyor</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="card bg-white shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-6">
                  <img
                    src={submission.coverImageUrl}
                    alt={submission.title}
                    className="w-32 h-40 object-cover rounded shadow-md"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{submission.title}</h2>
                        <p className="text-gray-600 mb-2">Yazar: {submission.author}</p>
                        <p className="text-sm text-gray-500">
                          Gönderen: {submission.submittedBy}
                        </p>
                      </div>
                      <div
                        className={`badge badge-lg ${
                          submission.status === 'pending'
                            ? 'badge-warning'
                            : submission.status === 'approved'
                            ? 'badge-success'
                            : 'badge-error'
                        }`}
                      >
                        {submission.status === 'pending' && 'Beklemede'}
                        {submission.status === 'approved' && 'Onaylandı'}
                        {submission.status === 'rejected' && 'Reddedildi'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock size={16} />
                      <span>
                        Gönderim:{' '}
                        {new Date(submission.submittedAt).toLocaleString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {submission.reviewNotes && (
                      <div className="alert alert-warning mb-4">
                        <AlertCircle size={20} />
                        <div>
                          <p className="font-semibold">Değerlendirme Notu:</p>
                          <p className="text-sm">{submission.reviewNotes}</p>
                        </div>
                      </div>
                    )}

                    {submission.status === 'pending' && (
                      <div className="flex gap-3">
                        <a
                          href={`/books/${submission.bookId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline gap-2"
                        >
                          <Eye size={18} />
                          İncele
                        </a>
                        <button
                          onClick={() => handleApprove(submission.id)}
                          className="btn btn-success gap-2"
                        >
                          <Check size={18} />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          className="btn btn-error gap-2"
                        >
                          <X size={18} />
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

