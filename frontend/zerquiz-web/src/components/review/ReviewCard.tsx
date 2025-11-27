import React from 'react';
import { Clock, User, Flag, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { QuestionReview } from '../../mocks/reviewQueueData';
import { demoQuestions } from '../../mocks/questionDemoData';

interface ReviewCardProps {
  review: QuestionReview;
  onSelect: (review: QuestionReview) => void;
  onQuickAction?: (reviewId: string, action: 'approve' | 'reject' | 'assign') => void;
}

export default function ReviewCard({ review, onSelect, onQuickAction }: ReviewCardProps) {
  const question = demoQuestions.find(q => q.id === review.questionId);

  const getStatusBadge = (status: QuestionReview['status']) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">⏳ Beklemede</span>;
      case 'in_review':
        return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">🔍 İncelemede</span>;
      case 'needs_revision':
        return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">📝 Revizyon</span>;
      case 'approved':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">✓ Onaylandı</span>;
      case 'rejected':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">✗ Reddedildi</span>;
    }
  };

  const getPriorityColor = (priority: QuestionReview['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: QuestionReview['priority']) => {
    switch (priority) {
      case 'urgent': return '🔴 Acil';
      case 'high': return '🟠 Yüksek';
      case 'normal': return '🔵 Normal';
      case 'low': return '⚪ Düşük';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} gün önce`;
    if (diffHours > 0) return `${diffHours} saat önce`;
    if (diffMins > 0) return `${diffMins} dakika önce`;
    return 'Az önce';
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(review.priority)}`}>
            {getPriorityLabel(review.priority)}
          </div>
          {getStatusBadge(review.status)}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(review.submittedAt)}</span>
        </div>
      </div>

      <div className="mb-3" onClick={() => onSelect(review)}>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {question?.headerText || question?.code || 'Soru Başlığı'}
        </h3>
        <div 
          className="text-xs text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: question?.questionText || 'Soru içeriği yükleniyor...' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <User className="h-3 w-3" />
          <span className="truncate">{review.submittedBy}</span>
        </div>
        {review.assignedTo && (
          <div className="flex items-center gap-1 text-blue-600">
            <User className="h-3 w-3" />
            <span className="truncate">{review.assignedTo}</span>
          </div>
        )}
        {review.comments.length > 0 && (
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="h-3 w-3" />
            <span>{review.comments.length} yorum</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-600">
          <Flag className="h-3 w-3" />
          <span>v{review.metadata.version}</span>
        </div>
      </div>

      {review.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {review.metadata.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
              {tag}
            </span>
          ))}
          {review.metadata.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
              +{review.metadata.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(review);
          }}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
        >
          Detayları Gör
        </button>
        {review.status === 'pending' && onQuickAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction(review.id, 'assign');
            }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition"
          >
            Üstüme Al
          </button>
        )}
        {review.status === 'in_review' && onQuickAction && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(review.id, 'approve');
              }}
              className="px-3 py-2 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition flex items-center gap-1"
              title="Onayla"
            >
              <CheckCircle className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(review.id, 'reject');
              }}
              className="px-3 py-2 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition flex items-center gap-1"
              title="Reddet"
            >
              <XCircle className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

