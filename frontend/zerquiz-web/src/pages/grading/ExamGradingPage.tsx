import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, BarChart3, Users, Eye } from 'lucide-react';
import ExamStatsOverview from '../../components/grading/ExamStatsOverview';
import QuestionAnalysis from '../../components/grading/QuestionAnalysis';
import StudentResultCard from '../../components/grading/StudentResultCard';
import {
  getExamStats,
  getResultsByExam,
  getTopStudents,
  getGradeDistribution,
  getScoreDistribution,
  type StudentResult,
} from '../../mocks/gradingDemoData';
import { demoExams } from '../../mocks/examDemoData';

type TabType = 'overview' | 'students' | 'questions' | 'analytics';

export default function ExamGradingPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);

  if (!examId) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Sınav ID bulunamadı</div>
      </div>
    );
  }

  const exam = demoExams.find((e) => e.id === examId);
  const stats = getExamStats(examId);
  const results = getResultsByExam(examId);
  const topStudents = getTopStudents(examId, 10);
  const gradeDistribution = getGradeDistribution(examId);
  const scoreDistribution = getScoreDistribution(examId);

  if (!exam) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Sınav bulunamadı</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Genel Bakış', icon: BarChart3 },
    { id: 'students' as TabType, label: 'Öğrenci Sonuçları', icon: Users, count: results.length },
    { id: 'questions' as TabType, label: 'Soru Analizi', icon: FileText, count: stats.questionStats.length },
    { id: 'analytics' as TabType, label: 'Detaylı Analiz', icon: Eye },
  ];

  const handleExportResults = () => {
    // CSV export simulation
    const csv = [
      ['No', 'Ad Soyad', 'Kitapçık', 'Puan', 'Not', 'Durum', 'Doğru', 'Yanlış', 'Boş', 'Süre'],
      ...results.map(r => [
        r.studentNumber,
        r.studentName,
        r.bookletVariant,
        r.score,
        r.grade,
        r.passed ? 'Geçti' : 'Kaldı',
        r.correctAnswers,
        r.wrongAnswers,
        r.emptyAnswers,
        `${r.duration}dk`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.title.replace(/\s+/g, '_')}_sonuclar.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/exams')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
                <p className="text-sm text-gray-600">
                  {exam.examType} • {stats.totalStudents} Katılımcı • Ortalama: {stats.averageScore}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportResults}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <Download className="h-4 w-4" />
                Sonuçları İndir
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-gray-200 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition font-medium ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ExamStatsOverview stats={stats} />

            {/* Top Students */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 En Başarılı 10 Öğrenci</h3>
              <div className="space-y-3">
                {topStudents.map((result, index) => (
                  <div key={result.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-900' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-blue-100 text-blue-900'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{result.studentName}</div>
                      <div className="text-xs text-gray-600">No: {result.studentNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{result.score}</div>
                      <div className="text-xs text-gray-600">{result.grade}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Tüm Öğrenci Sonuçları ({results.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((result) => (
                <StudentResultCard
                  key={result.id}
                  result={result}
                  onViewDetails={setSelectedResult}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <QuestionAnalysis questionStats={stats.questionStats} />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Grade Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Not Dağılımı</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {Object.entries(gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{grade}</div>
                    <div className="text-sm text-gray-600 mt-1">{count} öğrenci</div>
                    <div className="text-xs text-gray-500 mt-1">
                      %{Math.round((count / results.length) * 100)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Puan Dağılımı</h3>
              <div className="space-y-4">
                {scoreDistribution.map((dist) => (
                  <div key={dist.range}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-medium text-gray-700">{dist.range}</span>
                      <span className="font-bold text-gray-900">{dist.count} öğrenci</span>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 flex items-center justify-end pr-2 text-xs font-bold text-white"
                        style={{ width: `${(dist.count / results.length) * 100}%` }}
                      >
                        {dist.count > 0 && `%${Math.round((dist.count / results.length) * 100)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Süre Analizi</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Ortalama Süre</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.averageTime}dk</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 mb-1">En Hızlı</div>
                  <div className="text-2xl font-bold text-green-900">
                    {Math.min(...results.map(r => r.duration))}dk
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-orange-600 mb-1">En Yavaş</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {Math.max(...results.map(r => r.duration))}dk
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedResult(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedResult.studentName}</h3>
                <p className="text-sm text-gray-600">No: {selectedResult.studentNumber}</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-50 rounded p-3 text-center">
                  <div className="text-xs text-blue-600">Puan</div>
                  <div className="text-2xl font-bold text-blue-900">{selectedResult.score}</div>
                </div>
                <div className="bg-green-50 rounded p-3 text-center">
                  <div className="text-xs text-green-600">Not</div>
                  <div className="text-2xl font-bold text-green-900">{selectedResult.grade}</div>
                </div>
                <div className="bg-yellow-50 rounded p-3 text-center">
                  <div className="text-xs text-yellow-600">Sıralama</div>
                  <div className="text-2xl font-bold text-yellow-900">{selectedResult.rank}</div>
                </div>
                <div className="bg-purple-50 rounded p-3 text-center">
                  <div className="text-xs text-purple-600">Süre</div>
                  <div className="text-2xl font-bold text-purple-900">{selectedResult.duration}dk</div>
                </div>
              </div>

              {/* Answer Details */}
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Cevap Detayları</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedResult.answers.map((answer) => (
                  <div
                    key={answer.questionId}
                    className={`p-3 rounded-lg border-2 ${
                      answer.isCorrect ? 'bg-green-50 border-green-200' :
                      !answer.selectedAnswer ? 'bg-gray-50 border-gray-200' :
                      'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Soru {answer.questionOrder}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">
                          Verilen: <span className="font-bold">{answer.selectedAnswer || 'Boş'}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Doğru: <span className="font-bold">{answer.correctAnswer}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          {answer.timeSpent}sn
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedResult(null)}
                className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

