import React from 'react';
import { X, Edit, Copy, Archive, Trash2, CheckCircle, Clock, Eye, BarChart } from 'lucide-react';
import type { DemoQuestion } from '../../mocks/questionDemoData';

interface QuestionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: DemoQuestion | null;
  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function QuestionPreviewModal({
  isOpen,
  onClose,
  question,
  onEdit,
  onCopy,
  onArchive,
  onDelete,
}: QuestionPreviewModalProps) {
  if (!isOpen || !question) return null;

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: '📝 Taslak' },
      review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🔍 İncelemede' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Onaylanmış' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: '🌐 Yayınlanmış' },
      archived: { bg: 'bg-red-100', text: 'text-red-800', label: '📦 Arşivlenmiş' },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⭐', label: 'Kolay' },
      medium: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '⭐⭐', label: 'Orta' },
      hard: { bg: 'bg-red-100', text: 'text-red-800', icon: '⭐⭐⭐', label: 'Zor' },
      very_hard: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '⭐⭐⭐⭐', label: 'Çok Zor' },
    };
    return badges[difficulty as keyof typeof badges] || badges.medium;
  };

  const statusBadge = getStatusBadge(question.status);
  const difficultyBadge = getDifficultyBadge(question.difficultyLevelId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Soru Önizleme</h2>
              <p className="text-sm text-gray-600 mt-0.5">Konu: {question.code}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 ${statusBadge.bg} ${statusBadge.text} text-xs font-semibold rounded-full`}>
                {statusBadge.label}
              </span>
              <span className={`px-3 py-1.5 ${difficultyBadge.bg} ${difficultyBadge.text} text-xs font-semibold rounded-full`}>
                {difficultyBadge.icon} {difficultyBadge.label}
              </span>
              <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                {question.formatTypeName}
              </span>
              {question.subjectName && (
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                  📚 {question.subjectName}
                </span>
              )}
              {question.topicName && (
                <span className="px-3 py-1.5 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full">
                  📖 {question.topicName}
                </span>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-medium">Görüntülenme</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{question.viewCount}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BarChart className="h-4 w-4" />
                  <span className="text-xs font-medium">Kullanım</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{question.usageCount}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Süre</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {question.estimatedTimeInSeconds ? `${Math.floor(question.estimatedTimeInSeconds / 60)}dk` : '-'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <span className="text-xs font-medium">Ağırlık</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{question.weight.toFixed(1)}</div>
              </div>
            </div>

            {/* Question Header */}
            {question.headerText && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                <div
                  className="prose prose-sm max-w-none text-blue-900"
                  dangerouslySetInnerHTML={{ __html: question.headerText }}
                />
              </div>
            )}

            {/* Question Text */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Soru Metni
              </h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: question.questionText }}
              />
            </div>

            {/* Options */}
            {question.options && question.options.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Seçenekler
                </h3>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div
                      key={option.key}
                      className={`border-2 rounded-lg p-4 transition ${
                        option.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                          {option.key}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${option.isCorrect ? 'font-medium text-green-900' : 'text-gray-900'}`}>
                              {option.text}
                            </p>
                            {option.isCorrect && (
                              <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-600" />
                            )}
                          </div>
                          {option.feedback && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                              💡 {option.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {question.explanation && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>💡</span> Açıklama / Çözüm
                </h3>
                <div
                  className="prose prose-sm max-w-none text-purple-900"
                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                />
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Oluşturan:</span> {question.createdByName || 'Bilinmiyor'}
              </div>
              <div>
                <span className="font-medium">Pedagojik Tip:</span> {question.pedagogicalTypeName}
              </div>
              <div>
                <span className="font-medium">Oluşturma:</span>{' '}
                {new Date(question.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                <span className="font-medium">Güncelleme:</span>{' '}
                {new Date(question.updatedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition text-sm font-medium"
            >
              Kapat
            </button>
            <div className="flex items-center gap-2">
              {onCopy && (
                <button
                  onClick={() => {
                    onCopy(question.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  <Copy className="h-4 w-4" />
                  Kopyala
                </button>
              )}
              {onArchive && (
                <button
                  onClick={() => {
                    onArchive(question.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-orange-700 rounded-lg hover:bg-orange-50 transition text-sm font-medium"
                >
                  <Archive className="h-4 w-4" />
                  Arşivle
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
                      onDelete(question.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(question.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  <Edit className="h-4 w-4" />
                  Düzenle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

