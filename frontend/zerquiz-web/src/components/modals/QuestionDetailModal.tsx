import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/api/questionService';
import type { Question, QuestionVersion } from '../../types/question.types';

interface QuestionDetailModalProps {
  isOpen: boolean;
  questionId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  isOpen,
  questionId,
  onClose,
  onEdit,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentVersion, setCurrentVersion] = useState<QuestionVersion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && questionId) {
      loadQuestion();
    }
  }, [isOpen, questionId]);

  const loadQuestion = async () => {
    if (!questionId) return;

    try {
      setLoading(true);
      setError(null);

      const questionData = await questionService.getQuestion(questionId);
      setQuestion(questionData);

      if (questionData.currentVersionId) {
        const versionData = await questionService.getQuestionVersion(
          questionId,
          questionData.currentVersionId
        );
        setCurrentVersion(versionData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!question) return;
    
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;

    try {
      await questionService.deleteQuestion(question.id);
      onDelete?.(question.id);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  if (!isOpen) return null;

  const content = currentVersion?.content;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Soru Detayı</h2>
            {question && (
              <p className="text-sm text-gray-600 mt-1">Kod: {question.code}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          ) : question && content ? (
            <div className="space-y-6">
              {/* Question Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-600">Zorluk:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                    question.difficulty === 'easy' ? 'bg-blue-100 text-blue-800' :
                    question.difficulty === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty === 'easy' ? 'Kolay' : question.difficulty === 'medium' ? 'Orta' : 'Zor'}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Durum:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                    question.questionStatus === 'draft' ? 'bg-gray-100 text-gray-800' :
                    question.questionStatus === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    question.questionStatus === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.questionStatus === 'draft' ? 'Taslak' :
                     question.questionStatus === 'review' ? 'İnceleme' :
                     question.questionStatus === 'published' ? 'Yayınlanmış' : 'Arşivlenmiş'}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Ağırlık:</span>
                  <span className="ml-2 text-sm text-gray-900">{question.weight}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Oluşturulma:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(question.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                {/* Header */}
                {content.header?.text && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">Başlık:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{content.header.text}</p>
                  </div>
                )}

                {/* Premises */}
                {content.premises && content.premises.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Öncüller:</p>
                    {content.premises.map((premise, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{premise.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stem */}
                {content.stem?.text && (
                  <div className="mb-6">
                    <p className="text-gray-900 text-lg font-medium whitespace-pre-wrap">
                      {content.stem.text}
                    </p>
                  </div>
                )}

                {/* Options */}
                {content.options && content.options.length > 0 && (
                  <div className="space-y-3">
                    {content.options.map((option) => {
                      const isCorrect = content.correctAnswers?.includes(option.key);
                      return (
                        <div
                          key={option.key}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrect
                              ? 'bg-green-50 border-green-400'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <span className={`font-bold mr-3 mt-0.5 ${
                              isCorrect ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              {option.key})
                            </span>
                            <p className={`flex-1 ${isCorrect ? 'text-green-900 font-medium' : 'text-gray-900'}`}>
                              {option.text || option.latex || option.html}
                            </p>
                            {isCorrect && (
                              <span className="ml-2 text-green-600 font-bold">✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Correct Answers Summary */}
              {content.correctAnswers && content.correctAnswers.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    Doğru Cevap(lar): {content.correctAnswers.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Soru bulunamadı
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            {question && onEdit && (
              <button
                onClick={() => {
                  onEdit(question.id);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ✏️ Düzenle
              </button>
            )}
            {question && onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Sil
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

