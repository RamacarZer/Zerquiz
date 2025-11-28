/**
 * Exam Review Page - Sınav Sonrası İnceleme Modülü
 * Öğrenciler ve öğretmenler için detaylı sınav analizi
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, AlertCircle, Eye, EyeOff,
  TrendingUp, TrendingDown, Award, Clock, Target, BookOpen,
  BarChart3, PieChart, Download, Share2, MessageSquare, ThumbsUp,
  ThumbsDown, Lightbulb, AlertTriangle, Star,
} from 'lucide-react';
import {
  demoExams, demoResults, demoAnalytics,
  ExamDefinition, ExamResult, QuestionResult,
} from '../../mocks/examSystemData';

type ViewMode = 'student' | 'teacher';
type TabType = 'overview' | 'questions' | 'analysis' | 'feedback';

export default function ExamReviewPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  
  const [viewMode] = useState<ViewMode>('student'); // Can be toggled based on role
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // Load data
  const exam = demoExams.find(e => e.id === examId);
  const result = demoResults.find(r => r.examId === examId);
  const analytics = demoAnalytics; // In real app, fetch by examId

  if (!exam || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Sınav veya sonuç bulunamadı</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Calculate additional metrics
  const netScore = result.correctAnswers - (result.incorrectAnswers * 0.25);
  const efficiency = (result.timeSpent / (exam.duration * 60)) * 100;
  const questionsByDifficulty = exam.questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
                <p className="text-sm text-gray-600">
                  {exam.subject} • Teslim: {new Date(result.submittedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                PDF İndir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score Banner */}
      <div className={`${result.passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <ScoreMetric
              label="Puan"
              value={result.score.toString()}
              subValue={`/ ${result.totalPoints}`}
              icon={<Award className="w-8 h-8" />}
            />
            <ScoreMetric
              label="Yüzde"
              value={`${result.percentage}%`}
              icon={<Target className="w-8 h-8" />}
            />
            <ScoreMetric
              label="Not"
              value={result.grade}
              icon={<Star className="w-8 h-8" />}
            />
            <ScoreMetric
              label="Net"
              value={netScore.toFixed(2)}
              subValue={`${result.correctAnswers}D ${result.incorrectAnswers}Y ${result.unanswered}B`}
              icon={<BarChart3 className="w-8 h-8" />}
            />
            <ScoreMetric
              label="Süre"
              value={`${Math.floor(result.timeSpent / 60)}dk`}
              subValue={`${efficiency.toFixed(0)}% kullanıldı`}
              icon={<Clock className="w-8 h-8" />}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Genel Bakış"
            />
            <TabButton
              active={activeTab === 'questions'}
              onClick={() => setActiveTab('questions')}
              icon={<BookOpen className="w-4 h-4" />}
              label="Soru Detayları"
            />
            <TabButton
              active={activeTab === 'analysis'}
              onClick={() => setActiveTab('analysis')}
              icon={<PieChart className="w-4 h-4" />}
              label="Analiz"
            />
            <TabButton
              active={activeTab === 'feedback'}
              onClick={() => setActiveTab('feedback')}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Geri Bildirim"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            exam={exam}
            result={result}
            netScore={netScore}
            efficiency={efficiency}
            questionsByDifficulty={questionsByDifficulty}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsTab
            exam={exam}
            result={result}
            showAnswers={showAnswers}
            showExplanations={showExplanations}
            onToggleAnswers={() => setShowAnswers(!showAnswers)}
            onToggleExplanations={() => setShowExplanations(!showExplanations)}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={setSelectedQuestion}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab
            exam={exam}
            result={result}
            analytics={analytics}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackTab
            exam={exam}
            result={result}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ScoreMetric({ label, value, subValue, icon }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/20 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="text-sm opacity-90">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && <div className="text-xs opacity-75">{subValue}</div>}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function OverviewTab({ exam, result, netScore, efficiency, questionsByDifficulty }: any) {
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performans Özeti</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Doğru Cevaplar"
            value={result.correctAnswers}
            total={exam.questionCount}
            color="green"
            icon={<CheckCircle />}
          />
          <MetricCard
            label="Yanlış Cevaplar"
            value={result.incorrectAnswers}
            total={exam.questionCount}
            color="red"
            icon={<XCircle />}
          />
          <MetricCard
            label="Boş Sorular"
            value={result.unanswered}
            total={exam.questionCount}
            color="gray"
            icon={<AlertCircle />}
          />
          <MetricCard
            label="Net Puan"
            value={netScore.toFixed(2)}
            total={exam.questionCount}
            color="blue"
            icon={<Award />}
          />
        </div>

        {/* Progress bars */}
        <div className="space-y-4">
          <ProgressBar
            label="Başarı Oranı"
            percentage={result.percentage}
            color="blue"
          />
          <ProgressBar
            label="Süre Kullanımı"
            percentage={efficiency}
            color="orange"
          />
          <ProgressBar
            label="Tamamlanma"
            percentage={((exam.questionCount - result.unanswered) / exam.questionCount) * 100}
            color="green"
          />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            Güçlü Yönler
          </h3>
          <ul className="space-y-2">
            {result.percentage >= 80 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Yüksek başarı oranı ({result.percentage}%)</span>
              </li>
            )}
            {result.correctAnswers >= exam.questionCount * 0.7 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Çoğu soruyu doğru cevapladınız</span>
              </li>
            )}
            {efficiency < 80 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Zamanı verimli kullandınız</span>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 text-red-600" />
            Geliştirilmesi Gerekenler
          </h3>
          <ul className="space-y-2">
            {result.incorrectAnswers > exam.questionCount * 0.3 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>Yanlış cevap sayınızı azaltmalısınız</span>
              </li>
            )}
            {result.unanswered > exam.questionCount * 0.1 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>Boş bıraktığınız soruları azaltın</span>
              </li>
            )}
            {efficiency > 95 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>Sorulara daha fazla zaman ayırabilirsiniz</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Öneriler
        </h3>
        <ul className="space-y-2">
          <li className="text-sm text-gray-700">• Yanlış cevapladığınız soruları detaylı inceleyin ve çözüm yollarını öğrenin</li>
          <li className="text-sm text-gray-700">• {exam.subject} konusunda eksik olduğunuz başlıkları tekrar çalışın</li>
          <li className="text-sm text-gray-700">• Benzer deneme sınavları çözerek pratik yapın</li>
          <li className="text-sm text-gray-700">• Soru çözüm hızınızı artırmak için zaman tutarak çalışın</li>
        </ul>
      </div>
    </div>
  );
}

function QuestionsTab({ exam, result, showAnswers, showExplanations, onToggleAnswers, onToggleExplanations, selectedQuestion, onSelectQuestion }: any) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAnswers}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showAnswers ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showAnswers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Cevapları Göster
          </button>
          <button
            onClick={onToggleExplanations}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showExplanations ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showExplanations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Açıklamaları Göster
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Toplam: {exam.questions.length} soru</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {exam.questions.map((question: any, idx: number) => {
          // Simulated student answer (in real app, get from result.questionResults)
          const studentAnswer = idx < result.correctAnswers ? question.correctAnswer : 
                               idx < result.correctAnswers + result.incorrectAnswers ? 'wrong-answer' : null;
          const isCorrect = studentAnswer === question.correctAnswer;

          return (
            <QuestionReviewCard
              key={question.id}
              question={question}
              index={idx}
              studentAnswer={studentAnswer}
              isCorrect={isCorrect}
              showAnswer={showAnswers}
              showExplanation={showExplanations}
              isExpanded={selectedQuestion === idx}
              onToggle={() => onSelectQuestion(selectedQuestion === idx ? null : idx)}
            />
          );
        })}
      </div>
    </div>
  );
}

function QuestionReviewCard({ question, index, studentAnswer, isCorrect, showAnswer, showExplanation, isExpanded, onToggle }: any) {
  const statusColor = !studentAnswer ? 'border-gray-300 bg-gray-50' :
                      isCorrect ? 'border-green-300 bg-green-50' :
                      'border-red-300 bg-red-50';

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${statusColor} overflow-hidden`}>
      <div
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`px-3 py-1 rounded-lg font-bold ${
              !studentAnswer ? 'bg-gray-200 text-gray-700' :
              isCorrect ? 'bg-green-200 text-green-700' :
              'bg-red-200 text-red-700'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium mb-2">{question.question}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  question.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty}
                </span>
                <span className="text-gray-600">{question.points} puan</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!studentAnswer ? (
              <AlertCircle className="w-6 h-6 text-gray-400" />
            ) : isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
          {/* Options */}
          {question.options && (
            <div className="space-y-2">
              {question.options.map((option: any) => {
                const isStudentAnswer = studentAnswer === option.id;
                const isCorrectAnswer = showAnswer && option.isCorrect;

                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border-2 ${
                      isCorrectAnswer ? 'border-green-500 bg-green-50' :
                      isStudentAnswer && !isCorrect ? 'border-red-500 bg-red-50' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isStudentAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                      <span className="flex-1">{option.text}</span>
                      {isStudentAnswer && (
                        <span className="text-xs font-medium text-gray-600">Sizin cevabınız</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && question.explanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 mb-1">Açıklama:</div>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnalysisTab({ exam, result, analytics }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Detaylı Analiz</h2>
        <p className="text-gray-600">Sınav analiz grafikleri ve karşılaştırmalar buraya gelecek...</p>
      </div>
    </div>
  );
}

function FeedbackTab({ exam, result }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Öğretmen Geri Bildirimi</h2>
        {result.feedback ? (
          <p className="text-gray-700">{result.feedback}</p>
        ) : (
          <p className="text-gray-500 italic">Henüz geri bildirim eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, total, color, icon }: any) {
  const percentage = (value / total) * 100;
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white mb-2`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

