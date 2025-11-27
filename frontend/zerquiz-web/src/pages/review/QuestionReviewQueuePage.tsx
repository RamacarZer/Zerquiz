import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListFilter, CheckCircle, XCircle, RefreshCw, History, Eye } from 'lucide-react';
import ReviewCard from '../../components/review/ReviewCard';
import CommentSection from '../../components/review/CommentSection';
import {
  demoReviews,
  getReviewsByStatus,
  getReviewStats,
  addComment,
  updateReviewStatus,
  type QuestionReview,
} from '../../mocks/reviewQueueData';
import { demoQuestions } from '../../mocks/questionDemoData';

type FilterStatus = 'all' | QuestionReview['status'];

export default function QuestionReviewQueuePage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedReview, setSelectedReview] = useState<QuestionReview | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const stats = getReviewStats();

  const filteredReviews = filterStatus === 'all' 
    ? demoReviews 
    : getReviewsByStatus(filterStatus);

  const handleQuickAction = (reviewId: string, action: 'approve' | 'reject' | 'assign') => {
    const currentUser = { id: 'current-user', name: 'Mevcut Kullanıcı' };

    if (action === 'approve') {
      updateReviewStatus(reviewId, 'approved', currentUser.id, currentUser.name, 'Soru onaylandı');
      alert('Soru onaylandı! ✓');
    } else if (action === 'reject') {
      if (confirm('Bu soruyu reddetmek istediğinizden emin misiniz?')) {
        updateReviewStatus(reviewId, 'rejected', currentUser.id, currentUser.name, 'Soru reddedildi');
        alert('Soru reddedildi! ✗');
      }
    } else if (action === 'assign') {
      updateReviewStatus(reviewId, 'in_review', currentUser.id, currentUser.name, 'İncelemeye alındı');
      alert('Soru üstünüze alındı! 🔍');
    }
    // Force refresh
    window.location.reload();
  };

  const handleAddComment = (comment: any) => {
    if (selectedReview) {
      addComment(selectedReview.id, comment);
      // Update local state
      setSelectedReview({
        ...selectedReview,
        comments: [...selectedReview.comments, { ...comment, id: `comment-${Date.now()}`, createdAt: new Date().toISOString() }],
      });
    }
  };

  const handleStatusChange = (newStatus: QuestionReview['status']) => {
    if (selectedReview) {
      const currentUser = { id: 'current-user', name: 'Mevcut Kullanıcı' };
      updateReviewStatus(selectedReview.id, newStatus, currentUser.id, currentUser.name);
      alert(`Durum değiştirildi: ${newStatus}`);
      setSelectedReview(null);
      window.location.reload();
    }
  };

  const selectedQuestion = selectedReview 
    ? demoQuestions.find(q => q.id === selectedReview.questionId) 
    : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Soru Onay Kuyruğu</h1>
              <p className="text-sm text-gray-600">Bekleyen soruları inceleyin ve onaylayın</p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Toplam</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-xs text-yellow-600 mb-1">Bekleyen</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-xs text-blue-600 mb-1">İncelemede</div>
            <div className="text-2xl font-bold text-blue-900">{stats.inReview}</div>
          </div>
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
            <div className="text-xs text-orange-600 mb-1">Revizyon</div>
            <div className="text-2xl font-bold text-orange-900">{stats.needsRevision}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-green-600 mb-1">Onaylanan</div>
            <div className="text-2xl font-bold text-green-900">{stats.approved}</div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="text-xs text-red-600 mb-1">Reddedilen</div>
            <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Ortalama İnceleme Süresi</div>
            <div className="text-3xl font-bold text-blue-600">{stats.avgReviewTime} gün</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Onay Oranı</div>
            <div className="text-3xl font-bold text-green-600">%{stats.approvalRate}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ListFilter className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Filtrele</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({demoReviews.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bekleyen ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('in_review')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'in_review'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              İncelemede ({stats.inReview})
            </button>
            <button
              onClick={() => setFilterStatus('needs_revision')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'needs_revision'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revizyon ({stats.needsRevision})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Onaylanan ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reddedilen ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onSelect={setSelectedReview}
              onQuickAction={handleQuickAction}
            />
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg font-medium">Bu filtre için sonuç bulunamadı</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedReview(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedQuestion?.headerText || selectedQuestion?.code}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedReview.submittedBy} tarafından gönderildi
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Question Preview */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Soru Önizleme
                  </h4>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedQuestion?.questionText || '' }}
                  />
                  {selectedQuestion?.options && selectedQuestion.options.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedQuestion.options.map((opt: any) => (
                        <div
                          key={opt.key}
                          className={`p-3 rounded border ${
                            opt.isCorrect ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                          }`}
                        >
                          <span className="font-bold mr-2">{opt.key})</span>
                          {opt.text}
                          {opt.isCorrect && <span className="ml-2 text-green-600">✓ Doğru</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <History className="h-4 w-4" />
                      İnceleme Geçmişi
                    </h4>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showHistory ? 'Gizle' : 'Göster'}
                    </button>
                  </div>
                  {showHistory && (
                    <div className="space-y-2">
                      {selectedReview.history.map((entry) => (
                        <div key={entry.id} className="flex gap-3 text-sm">
                          <div className="text-gray-500 min-w-[120px]">
                            {new Date(entry.timestamp).toLocaleString('tr-TR')}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{entry.userName}</span>
                            <span className="text-gray-600"> - {entry.details}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <CommentSection
                  comments={selectedReview.comments}
                  onAddComment={handleAddComment}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  {selectedReview.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Onayla
                    </button>
                  )}
                  {selectedReview.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      <XCircle className="h-5 w-5" />
                      Reddet
                    </button>
                  )}
                  {selectedReview.status !== 'needs_revision' && (
                    <button
                      onClick={() => handleStatusChange('needs_revision')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                    >
                      Revizyon İste
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

