/**
 * Student Exam Portal - Öğrenci Sınav Portalı
 * Öğrencilerin katılabilecekleri sınavları görüntüleyip başlatabilecekleri sayfa
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, FileText, Play, CheckCircle, XCircle, Trophy,
  AlertCircle, BookOpen, Target, Award, TrendingUp, History, Eye,
  Filter, Search, Star, Lock, Unlock,
} from 'lucide-react';
import {
  demoExams, demoSessions, demoResults,
  ExamDefinition, ExamStatus, ExamType,
} from '../../mocks/examSystemData';

type TabType = 'available' | 'active' | 'completed' | 'upcoming';

const STUDENT_ID = 'student-001'; // Mock student ID
const STUDENT_NAME = 'Ali Yılmaz';

export default function StudentExamPortalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Student's sessions and results
  const studentSessions = demoSessions.filter(s => s.studentId === STUDENT_ID);
  const studentResults = demoResults.filter(r => r.studentId === STUDENT_ID);

  // Categorize exams
  const availableExams = useMemo(() => {
    return demoExams.filter(exam => {
      // Check if exam is available and not yet taken
      const hasSession = studentSessions.some(s => s.examId === exam.id);
      const hasResult = studentResults.some(r => r.examId === exam.id);
      
      return exam.status === 'active' && !hasSession && !hasResult;
    });
  }, [studentSessions, studentResults]);

  const activeExams = useMemo(() => {
    return demoExams.filter(exam => {
      const hasActiveSession = studentSessions.some(
        s => s.examId === exam.id && s.status === 'in_progress'
      );
      return hasActiveSession;
    });
  }, [studentSessions]);

  const completedExams = useMemo(() => {
    return studentResults.map(result => {
      const exam = demoExams.find(e => e.id === result.examId);
      return { exam, result };
    }).filter(item => item.exam);
  }, [studentResults]);

  const upcomingExams = useMemo(() => {
    return demoExams.filter(exam => {
      const isScheduled = exam.status === 'scheduled';
      const notTaken = !studentSessions.some(s => s.examId === exam.id);
      return isScheduled && notTaken;
    });
  }, [studentSessions]);

  // Filter exams
  const filteredExams = useMemo(() => {
    let exams: ExamDefinition[] = [];
    
    if (activeTab === 'available') exams = availableExams;
    else if (activeTab === 'active') exams = activeExams;
    else if (activeTab === 'upcoming') exams = upcomingExams;
    else return completedExams;

    if (searchTerm) {
      exams = exams.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject !== 'all') {
      exams = exams.filter(exam => exam.subject === filterSubject);
    }

    return exams;
  }, [activeTab, availableExams, activeExams, upcomingExams, completedExams, searchTerm, filterSubject]);

  // Calculate statistics
  const stats = {
    available: availableExams.length,
    active: activeExams.length,
    completed: completedExams.length,
    upcoming: upcomingExams.length,
    averageScore: completedExams.length > 0
      ? completedExams.reduce((sum, item) => sum + item.result.percentage, 0) / completedExams.length
      : 0,
    passRate: completedExams.length > 0
      ? (completedExams.filter(item => item.result.passed).length / completedExams.length) * 100
      : 0,
  };

  const handleStartExam = (examId: string) => {
    navigate(`/exams/${examId}/session`);
  };

  const handleViewResult = (examId: string) => {
    navigate(`/student/exam/${examId}/review`);
  };

  const handleContinueExam = (examId: string) => {
    navigate(`/exams/${examId}/session`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sınavlarım
            </h1>
            <p className="text-gray-600 mt-2">Merhaba {STUDENT_NAME}! Sınavlarınızı buradan takip edebilirsiniz.</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Katılabilir"
            value={stats.available}
            color="blue"
          />
          <StatCard
            icon={<Play className="w-5 h-5" />}
            label="Devam Eden"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Tamamlanan"
            value={stats.completed}
            color="purple"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Yaklaşan"
            value={stats.upcoming}
            color="orange"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Ort. Puan"
            value={`${stats.averageScore.toFixed(0)}%`}
            color="yellow"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Başarı Oranı"
            value={`${stats.passRate.toFixed(0)}%`}
            color="teal"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
        <TabButton
          active={activeTab === 'available'}
          onClick={() => setActiveTab('available')}
          icon={<Unlock className="w-4 h-4" />}
          label="Katılabilir Sınavlar"
          count={stats.available}
        />
        <TabButton
          active={activeTab === 'active'}
          onClick={() => setActiveTab('active')}
          icon={<Play className="w-4 h-4" />}
          label="Devam Eden"
          count={stats.active}
        />
        <TabButton
          active={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
          icon={<Calendar className="w-4 h-4" />}
          label="Yaklaşan"
          count={stats.upcoming}
        />
        <TabButton
          active={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
          icon={<History className="w-4 h-4" />}
          label="Geçmiş Sınavlar"
          count={stats.completed}
        />
      </div>

      {/* Filters */}
      {activeTab !== 'completed' && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sınav ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Dersler</option>
              <option value="Matematik">Matematik</option>
              <option value="Türkçe">Türkçe</option>
              <option value="Fizik">Fizik</option>
              <option value="Kimya">Kimya</option>
              <option value="Biyoloji">Biyoloji</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab !== 'completed' ? (
          <ExamListView
            exams={filteredExams as ExamDefinition[]}
            type={activeTab}
            onStart={handleStartExam}
            onContinue={handleContinueExam}
          />
        ) : (
          <CompletedExamsView
            completedExams={completedExams as any[]}
            onViewResult={handleViewResult}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ExamListView({ exams, type, onStart, onContinue }: any) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Şu anda {
          type === 'available' ? 'katılabileceğiniz' :
          type === 'active' ? 'devam eden' : 'yaklaşan'
        } sınav bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === 'available' ? 'Katılabilir Sınavlar' :
           type === 'active' ? 'Devam Eden Sınavlar' : 'Yaklaşan Sınavlar'} ({exams.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam: ExamDefinition) => (
          <StudentExamCard
            key={exam.id}
            exam={exam}
            type={type}
            onStart={() => onStart(exam.id)}
            onContinue={() => onContinue(exam.id)}
          />
        ))}
      </div>
    </div>
  );
}

function StudentExamCard({ exam, type, onStart, onContinue }: any) {
  const isAvailable = type === 'available';
  const isActive = type === 'active';
  const isUpcoming = type === 'upcoming';

  return (
    <div className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1 text-lg">{exam.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
        </div>
        {isActive && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium animate-pulse">
            Devam Ediyor
          </span>
        )}
        {isUpcoming && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
            Yakında
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{exam.subject} • {exam.grade}. Sınıf</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{exam.questionCount} soru • {exam.totalPoints} puan</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{exam.duration} dakika</span>
        </div>
        {exam.scheduledStart && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(exam.scheduledStart).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 bg-blue-50 rounded-lg mb-4">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Geçme Notu:</span>
            <span className="font-medium text-blue-600">{exam.passingScore} puan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deneme Hakkı:</span>
            <span className="font-medium text-blue-600">
              {exam.allowedAttempts === -1 ? 'Sınırsız' : exam.allowedAttempts}
            </span>
          </div>
        </div>
      </div>

      {isAvailable && (
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium"
        >
          <Play className="w-5 h-5" />
          Sınava Başla
        </button>
      )}

      {isActive && (
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium animate-pulse"
        >
          <Play className="w-5 h-5" />
          Sınavı Devam Ettir
        </button>
      )}

      {isUpcoming && (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
        >
          <Lock className="w-5 h-5" />
          Henüz Başlamadı
        </button>
      )}
    </div>
  );
}

function CompletedExamsView({ completedExams, onViewResult }: any) {
  if (completedExams.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Henüz tamamlanmış sınavınız bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Geçmiş Sınavlar ({completedExams.length})</h2>
      </div>

      <div className="space-y-4">
        {completedExams.map(({ exam, result }: any) => (
          <CompletedExamCard
            key={result.id}
            exam={exam}
            result={result}
            onViewResult={() => onViewResult(exam.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CompletedExamCard({ exam, result, onViewResult }: any) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-800 text-lg">{exam.title}</h3>
            {result.passed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{exam.subject} • {exam.grade}. Sınıf</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Puan</div>
              <div className="text-2xl font-bold text-blue-600">{result.score}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Yüzde</div>
              <div className="text-2xl font-bold text-purple-600">{result.percentage}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Not</div>
              <div className="text-2xl font-bold text-orange-600">{result.grade}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Süre</div>
              <div className="text-lg font-bold text-gray-700">{Math.floor(result.timeSpent / 60)}dk</div>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Doğru: <span className="font-bold">{result.correctAnswers}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">Yanlış: <span className="font-bold">{result.incorrectAnswers}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Boş: <span className="font-bold">{result.unanswered}</span></span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            Teslim: {new Date(result.submittedAt).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          <button
            onClick={onViewResult}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Eye className="w-4 h-4" />
            Detaylı İnceleme
          </button>
        </div>

        <div className="ml-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.percentage}
              </div>
              <div className={`text-xs ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.passed ? 'GEÇTİ' : 'KALDI'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

