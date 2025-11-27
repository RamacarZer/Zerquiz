import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { QuestionStats } from '../../mocks/gradingDemoData';
import { demoQuestions } from '../../mocks/questionDemoData';

interface QuestionAnalysisProps {
  questionStats: QuestionStats[];
}

export default function QuestionAnalysis({ questionStats }: QuestionAnalysisProps) {
  const [sortBy, setSortBy] = useState<'order' | 'success' | 'difficulty'>('order');

  const getDifficultyBadge = (difficulty: QuestionStats['difficulty']) => {
    switch (difficulty) {
      case 'very_easy':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Çok Kolay</span>;
      case 'easy':
        return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Kolay</span>;
      case 'medium':
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Orta</span>;
      case 'hard':
        return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">Zor</span>;
      case 'very_hard':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Çok Zor</span>;
    }
  };

  const sortedStats = [...questionStats].sort((a, b) => {
    if (sortBy === 'order') return a.questionOrder - b.questionOrder;
    if (sortBy === 'success') return b.successRate - a.successRate;
    if (sortBy === 'difficulty') {
      const difficultyOrder = { very_easy: 0, easy: 1, medium: 2, hard: 3, very_hard: 4 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    return 0;
  });

  const averageSuccess = Math.round(
    questionStats.reduce((sum, q) => sum + q.successRate, 0) / questionStats.length
  );

  const difficultyDistribution = questionStats.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-600 mb-1">Toplam Soru</div>
          <div className="text-2xl font-bold text-gray-900">{questionStats.length}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-600 mb-1">Ortalama Başarı</div>
          <div className={`text-2xl font-bold ${
            averageSuccess >= 70 ? 'text-green-600' :
            averageSuccess >= 50 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            %{averageSuccess}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-600 mb-1">En Kolay</div>
          <div className="text-xl font-bold text-green-600">
            %{Math.max(...questionStats.map(q => q.successRate))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-600 mb-1">En Zor</div>
          <div className="text-xl font-bold text-red-600">
            %{Math.min(...questionStats.map(q => q.successRate))}
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Zorluk Dağılımı</h3>
        <div className="flex gap-2">
          {Object.entries(difficultyDistribution).map(([difficulty, count]) => (
            <div
              key={difficulty}
              className="flex-1 bg-gray-100 rounded-lg p-3 text-center"
            >
              {getDifficultyBadge(difficulty as QuestionStats['difficulty'])}
              <div className="text-2xl font-bold text-gray-900 mt-2">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Soru Bazlı Analiz</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('order')}
              className={`text-xs px-3 py-1 rounded ${
                sortBy === 'order'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sıra
            </button>
            <button
              onClick={() => setSortBy('success')}
              className={`text-xs px-3 py-1 rounded ${
                sortBy === 'success'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Başarı
            </button>
            <button
              onClick={() => setSortBy('difficulty')}
              className={`text-xs px-3 py-1 rounded ${
                sortBy === 'difficulty'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Zorluk
            </button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {sortedStats.map((stat) => {
          const question = demoQuestions.find(q => q.id === stat.questionId);
          const isEasy = stat.successRate >= 70;
          const isHard = stat.successRate < 50;
          
          return (
            <div key={stat.questionId} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                {/* Question Number */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-900">{stat.questionOrder}</span>
                </div>

                {/* Question Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {question?.headerText || `Soru ${stat.questionOrder}`}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getDifficultyBadge(stat.difficulty)}
                        {isEasy && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            Kolay
                          </span>
                        )}
                        {isHard && (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            Dikkat
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Success Rate Badge */}
                    <div className={`text-right ml-4 ${
                      stat.successRate >= 70 ? 'text-green-600' :
                      stat.successRate >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      <div className="text-2xl font-bold">%{stat.successRate}</div>
                      <div className="text-xs">başarı</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          stat.successRate >= 70 ? 'bg-green-600' :
                          stat.successRate >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${stat.successRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="font-medium">{stat.correctAnswers} doğru</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-3 w-3" />
                      <span className="font-medium">{stat.wrongAnswers} yanlış</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="font-medium">{stat.emptyAnswers} boş</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">{stat.averageTime}sn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

