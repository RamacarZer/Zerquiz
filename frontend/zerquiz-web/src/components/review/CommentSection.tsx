import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ReviewComment } from '../../mocks/reviewQueueData';

interface CommentSectionProps {
  comments: ReviewComment[];
  onAddComment: (comment: Omit<ReviewComment, 'id' | 'createdAt'>) => void;
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<ReviewComment['type']>('feedback');
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({
        userId: 'current-user-id',
        userName: 'Mevcut Kullanıcı',
        userRole: 'Editör',
        comment: newComment,
        type: commentType,
        isInternal,
      });
      setNewComment('');
      setCommentType('feedback');
      setIsInternal(false);
    }
  };

  const getCommentTypeColor = (type: ReviewComment['type']) => {
    switch (type) {
      case 'feedback': return 'text-blue-600 bg-blue-100';
      case 'question': return 'text-purple-600 bg-purple-100';
      case 'suggestion': return 'text-green-600 bg-green-100';
      case 'issue': return 'text-red-600 bg-red-100';
    }
  };

  const getCommentTypeLabel = (type: ReviewComment['type']) => {
    switch (type) {
      case 'feedback': return '💬 Geri Bildirim';
      case 'question': return '❓ Soru';
      case 'suggestion': return '💡 Öneri';
      case 'issue': return '⚠️ Sorun';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Yorumlar ({comments.length})</h3>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            Henüz yorum eklenmemiş
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {comment.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
                    <div className="text-xs text-gray-500">{comment.userRole}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCommentTypeColor(comment.type)}`}>
                    {getCommentTypeLabel(comment.type)}
                  </span>
                  {comment.isInternal && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      🔒 Dahili
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>

              <div className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Yorum Tipi</label>
            <select
              value={commentType}
              onChange={(e) => setCommentType(e.target.value as ReviewComment['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="feedback">💬 Geri Bildirim</option>
              <option value="question">❓ Soru</option>
              <option value="suggestion">💡 Öneri</option>
              <option value="issue">⚠️ Sorun</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>🔒 Dahili yorum (sadece editörler görsün)</span>
            </label>
          </div>
        </div>

        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={!newComment.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
        >
          <Send className="h-4 w-4" />
          Yorum Ekle
        </button>
      </form>
    </div>
  );
}

