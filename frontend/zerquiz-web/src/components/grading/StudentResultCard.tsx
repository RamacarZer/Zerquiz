import React from 'react';
import { CheckCircle2, XCircle, Clock, Trophy, TrendingUp } from 'lucide-react';
import { StudentResult } from '../../mocks/gradingDemoData';

interface StudentResultCardProps {
  result: StudentResult;
  onViewDetails?: (result: StudentResult) => void;
}

export default function StudentResultCard({ result, onViewDetails }: StudentResultCardProps) {
  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-300';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{result.studentName}</h3>
          <p className="text-sm text-gray-600">No: {result.studentNumber} • Kitapçık {result.bookletVariant}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={`px-4 py-2 rounded-lg border-2 font-bold text-2xl ${getGradeColor(result.grade)}`}>
            {result.grade}
          </div>
          {result.rank && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Trophy className="h-3 w-3" />
              <span className="font-medium">Sıralama: {result.rank}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}
          </span>
          <span className="text-lg text-gray-500">/ 100</span>
          {result.percentile && (
            <span className="ml-auto text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              Top %{100 - result.percentile}
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              result.score >= 85 ? 'bg-green-600' :
              result.score >= 70 ? 'bg-blue-600' :
              result.score >= 60 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium">Doğru</span>
          </div>
          <div className="text-xl font-bold text-green-900">{result.correctAnswers}</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Yanlış</span>
          </div>
          <div className="text-xl font-bold text-red-900">{result.wrongAnswers}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Boş</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{result.emptyAnswers}</div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Süre: <span className="font-semibold text-gray-900">{formatDuration(result.duration)}</span></span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Cevaplanan: <span className="font-semibold text-gray-900">{result.answeredQuestions}/{result.totalQuestions}</span></span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.passed ? (
            <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              ✓ Geçti
            </span>
          ) : (
            <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
              ✗ Kaldı
            </span>
          )}
          
          {result.gradedBy === 'auto-grading-system' && (
            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              🤖 Otomatik
            </span>
          )}
        </div>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(result)}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Detayları Gör
          </button>
        )}
      </div>
    </div>
  );
}

