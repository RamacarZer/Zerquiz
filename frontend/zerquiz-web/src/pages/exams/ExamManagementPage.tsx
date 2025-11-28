/**
 * Comprehensive Exam Management Page
 * Tam Gelişmiş Sınav Yönetim Sistemi
 */

import React, { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Calendar, Clock, Users, FileText, Play, Edit,
  Trash2, Copy, Download, Upload, Settings, Eye, CheckCircle, XCircle,
  AlertCircle, TrendingUp, BarChart3, Award, BookOpen, Target, Zap,
} from 'lucide-react';
import {
  demoExams, demoSessions, demoResults, demoAnalytics,
  ExamDefinition, ExamSession, ExamResult, ExamStatus, ExamType,
  getExamById, getExamsByStatus, getExamsByType, getActiveExams,
  getExamStatistics,
} from '../../mocks/examSystemData';

type ViewMode = 'list' | 'calendar' | 'analytics' | 'sessions';
type FilterStatus = ExamStatus | 'all';
type FilterType = ExamType | 'all';

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  practice: 'Pratik',
  mock: 'Deneme',
  official: 'Resmi Sınav',
  quiz: 'Quiz',
  assessment: 'Değerlendirme',
};

const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  draft: 'Taslak',
  scheduled: 'Zamanlanmış',
  active: 'Aktif',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
};

export default function ExamManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedExam, setSelectedExam] = useState<ExamDefinition | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = useMemo(() => getExamStatistics(), []);

  const filteredExams = useMemo(() => {
    let filtered = [...demoExams];

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.examType === filterType);
    }

    return filtered;
  }, [searchTerm, filterStatus, filterType]);

  const handleCreateExam = () => {
    setShowCreateModal(true);
  };

  const handleEditExam = (exam: ExamDefinition) => {
    // Navigate to exam wizard
    window.location.href = `/exams/wizard/${exam.id}`;
  };

  const handleDeleteExam = (exam: ExamDefinition) => {
    if (confirm(`"${exam.title}" sınavını silmek istediğinizden emin misiniz?`)) {
      alert('Sınav silindi! (Demo)');
    }
  };

  const handleDuplicateExam = (exam: ExamDefinition) => {
    alert(`"${exam.title}" sınavı kopyalandı! (Demo)`);
  };

  const handleViewDetails = (exam: ExamDefinition) => {
    setSelectedExam(exam);
    setShowDetailModal(true);
  };

  const handleStartExam = (exam: ExamDefinition) => {
    window.location.href = `/exams/${exam.id}/session`;
  };

  const handleViewResults = (exam: ExamDefinition) => {
    window.location.href = `/exams/${exam.id}/grading`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sınav Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">Sınavları oluşturun, yönetin ve analiz edin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateExam}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Yeni Sınav Oluştur
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
              <Upload className="w-5 h-5" />
              İçe Aktar
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Toplam Sınav"
            value={stats.totalExams}
            color="blue"
          />
          <StatCard
            icon={<Play className="w-5 h-5" />}
            label="Aktif Sınav"
            value={stats.activeExams}
            color="green"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Zamanlanmış"
            value={stats.scheduledExams}
            color="orange"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Tamamlandı"
            value={stats.completedExams}
            color="purple"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Oturum"
            value={stats.totalSessions}
            color="cyan"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Devam Eden"
            value={stats.activeSessions}
            color="yellow"
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label="Başarı Oranı"
            value={`${stats.averagePassRate.toFixed(0)}%`}
            color="teal"
          />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2">
        <TabButton
          active={viewMode === 'list'}
          onClick={() => setViewMode('list')}
          icon={<FileText className="w-4 h-4" />}
          label="Sınav Listesi"
        />
        <TabButton
          active={viewMode === 'calendar'}
          onClick={() => setViewMode('calendar')}
          icon={<Calendar className="w-4 h-4" />}
          label="Takvim"
        />
        <TabButton
          active={viewMode === 'sessions'}
          onClick={() => setViewMode('sessions')}
          icon={<Users className="w-4 h-4" />}
          label="Oturumlar"
        />
        <TabButton
          active={viewMode === 'analytics'}
          onClick={() => setViewMode('analytics')}
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analitik"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            {Object.entries(EXAM_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Tipler</option>
            {Object.entries(EXAM_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {viewMode === 'list' && (
          <ExamListView
            exams={filteredExams}
            onEdit={handleEditExam}
            onDelete={handleDeleteExam}
            onDuplicate={handleDuplicateExam}
            onViewDetails={handleViewDetails}
            onStartExam={handleStartExam}
            onViewResults={handleViewResults}
          />
        )}

        {viewMode === 'calendar' && (
          <CalendarView exams={filteredExams} />
        )}

        {viewMode === 'sessions' && (
          <SessionsView sessions={demoSessions} />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView analytics={demoAnalytics} />
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExam(null);
          }}
          onEdit={() => handleEditExam(selectedExam)}
          onDelete={() => handleDeleteExam(selectedExam)}
        />
      )}

      {showCreateModal && (
        <CreateExamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => {
            setShowCreateModal(false);
            // Navigate to wizard
            window.location.href = '/exams/wizard';
          }}
        />
      )}
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
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
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

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ExamListView({ exams, onEdit, onDelete, onDuplicate, onViewDetails, onStartExam, onViewResults }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sınav Listesi ({exams.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam: ExamDefinition) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onEdit={() => onEdit(exam)}
            onDelete={() => onDelete(exam)}
            onDuplicate={() => onDuplicate(exam)}
            onViewDetails={() => onViewDetails(exam)}
            onStartExam={() => onStartExam(exam)}
            onViewResults={() => onViewResults(exam)}
          />
        ))}
      </div>
    </div>
  );
}

function ExamCard({ exam, onEdit, onDelete, onDuplicate, onViewDetails, onStartExam, onViewResults }: any) {
  const statusColors: Record<ExamStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const typeColors: Record<ExamType, string> = {
    practice: 'bg-cyan-50 border-cyan-200',
    mock: 'bg-blue-50 border-blue-200',
    official: 'bg-purple-50 border-purple-200',
    quiz: 'bg-green-50 border-green-200',
    assessment: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all ${typeColors[exam.examType]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{exam.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[exam.status]}`}>
          {EXAM_STATUS_LABELS[exam.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{exam.subject} • {exam.grade}. Sınıf</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{exam.questionCount} soru • {exam.totalPoints} puan</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{exam.duration} dakika</span>
        </div>
        {exam.scheduledStart && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(exam.scheduledStart).toLocaleDateString('tr-TR')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {exam.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-white/50 text-xs rounded">{tag}</span>
        ))}
      </div>

      <div className="flex gap-2">
        {exam.status === 'active' && (
          <button
            onClick={onStartExam}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
          >
            <Play className="w-4 h-4" />
            Başlat
          </button>
        )}
        {exam.status === 'completed' && (
          <button
            onClick={onViewResults}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all"
          >
            <Award className="w-4 h-4" />
            Sonuçlar
          </button>
        )}
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all"
        >
          <Eye className="w-4 h-4" />
          Detay
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CalendarView({ exams }: { exams: ExamDefinition[] }) {
  const scheduledExams = exams.filter(e => e.scheduledStart);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sınav Takvimi</h2>
      <div className="space-y-4">
        {scheduledExams.map(exam => (
          <div key={exam.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Date(exam.scheduledStart!).getDate()}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(exam.scheduledStart!).toLocaleDateString('tr-TR', { month: 'short' })}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{exam.title}</h3>
              <p className="text-sm text-gray-600">{exam.subject} • {exam.duration} dakika</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date(exam.scheduledStart!).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionsView({ sessions }: { sessions: ExamSession[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktif Oturumlar ({sessions.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Öğrenci</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sınav</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İlerleme</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Süre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{session.studentName}</td>
                <td className="px-4 py-3 text-sm">{session.examTitle}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    session.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                    session.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {session.status === 'in_progress' ? 'Devam Ediyor' :
                     session.status === 'paused' ? 'Duraklatıldı' :
                     session.status === 'submitted' ? 'Teslim Edildi' : session.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {session.currentQuestion} / {session.answers.length} soru
                </td>
                <td className="px-4 py-3 text-sm">
                  {Math.floor(session.timeSpent / 60)}:{(session.timeSpent % 60).toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView({ analytics }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sınav Analitiği</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{analytics.totalAttempts}</div>
          <div className="text-blue-100">Toplam Deneme</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{analytics.averageScore.toFixed(1)}</div>
          <div className="text-green-100">Ortalama Puan</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{analytics.passRate.toFixed(0)}%</div>
          <div className="text-purple-100">Geçme Oranı</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{Math.floor(analytics.averageTime / 60)}dk</div>
          <div className="text-orange-100">Ortalama Süre</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Puan Dağılımı</h3>
        <div className="space-y-3">
          {analytics.scoreDistribution.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{item.range}</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / analytics.totalAttempts) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {((item.count / analytics.totalAttempts) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">En Başarılı Öğrenciler</h3>
        <div className="space-y-3">
          {analytics.topPerformers.map((performer: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-800">{performer.name}</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{performer.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamDetailModal({ exam, onClose, onEdit, onDelete }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{exam.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Temel Bilgiler</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Sınav Tipi" value={EXAM_TYPE_LABELS[exam.examType]} />
              <InfoItem label="Durum" value={EXAM_STATUS_LABELS[exam.status]} />
              <InfoItem label="Konu" value={exam.subject} />
              <InfoItem label="Sınıf" value={exam.grade} />
              <InfoItem label="Süre" value={`${exam.duration} dakika`} />
              <InfoItem label="Soru Sayısı" value={exam.questionCount} />
              <InfoItem label="Toplam Puan" value={exam.totalPoints} />
              <InfoItem label="Geçme Notu" value={exam.passingScore} />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Talimatlar</h3>
            <ul className="list-disc list-inside space-y-2">
              {exam.instructions.map((instruction: string, idx: number) => (
                <li key={idx} className="text-gray-600">{instruction}</li>
              ))}
            </ul>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Ayarlar</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingItem label="Geri Dönüş" value={exam.settings.allowBackNavigation} />
              <SettingItem label="Hesap Makinesi" value={exam.settings.allowCalculator} />
              <SettingItem label="Not Defteri" value={exam.settings.allowNotes} />
              <SettingItem label="Duraklama" value={exam.settings.allowPause} />
              <SettingItem label="Soru Karıştırma" value={exam.settings.randomizeQuestions} />
              <SettingItem label="Seçenek Karıştırma" value={exam.settings.randomizeOptions} />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all"
          >
            Sil
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );
}

function SettingItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <span className="text-sm text-gray-700">{label}</span>
      {value ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      )}
    </div>
  );
}

function CreateExamModal({ onClose, onCreate }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Yeni Sınav Oluştur</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Sınav Wizard'a yönlendirileceksiniz. Orada sınavınızı adım adım oluşturabilirsiniz.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Sınav detaylarını belirleyin</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Soruları seçin ve düzenleyin</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Ayarları yapılandırın</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            İptal
          </button>
          <button
            onClick={onCreate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Wizard'a Git
          </button>
        </div>
      </div>
    </div>
  );
}

