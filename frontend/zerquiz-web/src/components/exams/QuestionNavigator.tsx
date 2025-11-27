import React from 'react';
import { Flag, Check, Circle } from 'lucide-react';

interface Question {
  id: string;
  order: number;
  questionId: string;
}

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answeredQuestions: string[];
  flaggedQuestions: string[];
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  currentIndex,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  const getQuestionStatus = (question: Question) => {
    const isAnswered = answeredQuestions.includes(question.questionId);
    const isFlagged = flaggedQuestions.includes(question.questionId);
    const isCurrent = questions[currentIndex]?.questionId === question.questionId;

    return { isAnswered, isFlagged, isCurrent };
  };

  const getButtonStyle = (question: Question) => {
    const { isAnswered, isFlagged, isCurrent } = getQuestionStatus(question);

    if (isCurrent) {
      return 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300';
    }
    if (isAnswered && isFlagged) {
      return 'bg-green-100 text-green-800 border-green-500 ring-1 ring-green-500';
    }
    if (isAnswered) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (isFlagged) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-500';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  const stats = {
    total: questions.length,
    answered: answeredQuestions.length,
    flagged: flaggedQuestions.length,
    unanswered: questions.length - answeredQuestions.length,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Soru Haritası</h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-600">Toplam</div>
          <div className="text-lg font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded p-2">
          <div className="text-green-600">Cevaplanan</div>
          <div className="text-lg font-bold text-green-900">{stats.answered}</div>
        </div>
        <div className="bg-red-50 rounded p-2">
          <div className="text-red-600">Boş</div>
          <div className="text-lg font-bold text-red-900">{stats.unanswered}</div>
        </div>
        <div className="bg-yellow-50 rounded p-2">
          <div className="text-yellow-600">İşaretli</div>
          <div className="text-lg font-bold text-yellow-900">{stats.flagged}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white border-2 border-blue-700 rounded flex items-center justify-center font-bold">1</div>
          <span className="text-gray-600">Mevcut Soru</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 text-green-800 border-2 border-green-300 rounded flex items-center justify-center font-bold">2</div>
          <span className="text-gray-600">Cevaplandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-100 text-yellow-800 border-2 border-yellow-500 rounded flex items-center justify-center font-bold">3</div>
          <span className="text-gray-600">İşaretli</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-gray-700 border-2 border-gray-300 rounded flex items-center justify-center font-bold">4</div>
          <span className="text-gray-600">Boş</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const { isAnswered, isFlagged } = getQuestionStatus(question);
          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`relative w-full aspect-square flex items-center justify-center text-sm font-bold border-2 rounded transition ${getButtonStyle(question)}`}
              title={`Soru ${question.order}`}
            >
              {question.order}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600 fill-yellow-600" />
              )}
              {isAnswered && (
                <Check className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-green-600 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>İlerleme</span>
          <span className="font-semibold">{Math.round((stats.answered / stats.total) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${(stats.answered / stats.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

