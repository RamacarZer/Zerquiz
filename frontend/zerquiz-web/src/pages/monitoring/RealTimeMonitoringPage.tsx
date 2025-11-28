import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, AlertTriangle, CheckCircle, XCircle, Clock, Wifi, WifiOff,
  Camera, Monitor, Flag, MessageSquare, Bell, Grid3x3, List, Eye, Play, Pause,
  Search, Filter, RefreshCw, Download, Volume2, VideoOff, Maximize2, Activity,
} from 'lucide-react';
import {
  StudentLiveStatus, ExamLiveStats, ProctorAlert,
  mockStudentsLiveStatus, mockExamLiveStats, mockProctorAlerts,
  getActiveStudents, getFlaggedStudents, getUnacknowledgedAlerts,
  formatTime, getStatusColor, getStatusLabel, getSeverityColor,
} from '../../mocks/realTimeMonitoringData';

type ViewMode = 'grid' | 'list' | 'alerts';
type FilterMode = 'all' | 'active' | 'flagged' | 'disconnected' | 'violations';

export default function RealTimeMonitoringPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentLiveStatus[]>(mockStudentsLiveStatus);
  const [stats, setStats] = useState<ExamLiveStats>(mockExamLiveStats);
  const [alerts, setAlerts] = useState<ProctorAlert[]>(mockProctorAlerts);
  const [selectedStudent, setSelectedStudent] = useState<StudentLiveStatus | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simüle: Öğrenci durumlarını güncelle
      setStudents(prev => prev.map(s => ({
        ...s,
        currentQuestionIndex: Math.min(s.currentQuestionIndex + Math.floor(Math.random() * 2), s.totalQuestions),
        timeRemaining: Math.max(s.timeRemaining - 5, 0),
        timeElapsed: s.timeElapsed + 5,
        lastActivity: new Date(),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterMode === 'all' ? true :
      filterMode === 'active' ? s.status === 'active' :
      filterMode === 'flagged' ? s.status === 'flagged' || s.suspiciousActivity :
      filterMode === 'disconnected' ? s.status === 'disconnected' :
      filterMode === 'violations' ? s.violations.length > 0 :
      true;
    
    return matchesSearch && matchesFilter;
  });

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, acknowledged: true, resolvedBy: 'Gözetmen', resolvedAt: new Date() } 
        : a
    ));
  };

  const handleSendMessage = (studentId: string) => {
    alert(`Mesaj gönder: ${students.find(s => s.id === studentId)?.name} (Demo)`);
  };

  const handleTerminateExam = (studentId: string) => {
    if (confirm('Bu öğrencinin sınavını sonlandırmak istediğinizden emin misiniz?')) {
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, status: 'submitted' } : s
      ));
    }
  };

  const statCards = [
    { label: 'Toplam Kayıtlı', value: stats.totalRegistered, icon: Users, color: 'bg-blue-500' },
    { label: 'Aktif Şimdi', value: stats.activeNow, icon: Activity, color: 'bg-green-500' },
    { label: 'Teslim Etti', value: stats.submitted, icon: CheckCircle, color: 'bg-indigo-500' },
    { label: 'Bağlantı Kesildi', value: stats.disconnected, icon: WifiOff, color: 'bg-red-500' },
    { label: 'İşaretli', value: stats.flagged, icon: Flag, color: 'bg-orange-500' },
    { label: 'Toplam İhlal', value: stats.totalViolations, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Ort. İlerleme', value: `${stats.averageProgress}%`, icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/exams')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  Canlı Sınav İzleme
                </h1>
                <p className="text-sm text-gray-600">{stats.examTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {autoRefresh ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {autoRefresh ? 'Otomatik Yenileme' : 'Durduruldu'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <RefreshCw className="h-4 w-4" /> Yenile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <Download className="h-4 w-4" /> Rapor İndir
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-4">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.color} text-white p-3 rounded-lg shadow-md flex items-center justify-between`}>
                <div>
                  <div className="text-xs font-medium opacity-80">{card.label}</div>
                  <div className="text-xl font-bold">{card.value}</div>
                </div>
                <card.icon className="h-6 w-6 opacity-50" />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Öğrenci ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as FilterMode)}
              >
                <option value="all">Tümü ({students.length})</option>
                <option value="active">Aktif ({students.filter(s => s.status === 'active').length})</option>
                <option value="flagged">İşaretli ({students.filter(s => s.status === 'flagged' || s.suspiciousActivity).length})</option>
                <option value="disconnected">Bağlantı Kesildi ({students.filter(s => s.status === 'disconnected').length})</option>
                <option value="violations">İhlalli ({students.filter(s => s.violations.length > 0).length})</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('alerts')}
                className={`p-2 rounded-lg transition ${viewMode === 'alerts' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Bell className="h-5 w-5" />
                {getUnacknowledgedAlerts().length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getUnacknowledgedAlerts().length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto px-6 py-6">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className={`bg-white rounded-lg shadow-md p-4 border-2 transition hover:shadow-lg cursor-pointer ${
                  student.suspiciousActivity ? 'border-red-500' :
                  student.status === 'flagged' ? 'border-orange-500' :
                  student.status === 'disconnected' ? 'border-gray-400' :
                  'border-transparent'
                }`}
                onClick={() => {
                  setSelectedStudent(student);
                  setShowDetailModal(true);
                }}
              >
                {/* Webcam Thumbnail */}
                <div className="relative mb-3">
                  {student.webcamActive ? (
                    <img
                      src={student.webcamThumbnail}
                      alt={student.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </div>
                  {/* Violations Badge */}
                  {student.violations.length > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {student.violations.length}
                    </div>
                  )}
                </div>

                {/* Student Info */}
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{student.name}</h3>
                  <p className="text-xs text-gray-600">{student.studentNumber} - {student.seatNumber}</p>
                </div>

                {/* Progress */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Soru {student.currentQuestionIndex + 1}/{student.totalQuestions}</span>
                    <span>{Math.floor((student.currentQuestionIndex / student.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(student.currentQuestionIndex / student.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time & Icons */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatTime(student.timeRemaining)}
                  </span>
                  <div className="flex items-center gap-1">
                    {student.webcamActive ? <Camera className="h-3 w-3 text-green-500" /> : <Camera className="h-3 w-3 text-red-500" />}
                    {student.isFullScreen ? <Maximize2 className="h-3 w-3 text-green-500" /> : <Maximize2 className="h-3 w-3 text-red-500" />}
                    {student.status === 'disconnected' ? <WifiOff className="h-3 w-3 text-red-500" /> : <Wifi className="h-3 w-3 text-green-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öğrenci</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İlerleme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalan Süre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İhlal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kamera</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => (
                  <tr key={student.id} className={student.suspiciousActivity ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={student.webcamThumbnail} alt="" className="h-10 w-10 rounded-full mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.studentNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.currentQuestionIndex + 1}/{student.totalQuestions} ({Math.floor((student.currentQuestionIndex / student.totalQuestions) * 100)}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(student.timeRemaining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.violations.length > 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {student.violations.length} İhlal
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.webcamActive ? (
                        <Camera className="h-5 w-5 text-green-500" />
                      ) : (
                        <Camera className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleSendMessage(student.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <MessageSquare className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleTerminateExam(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Gözetmen Uyarıları</h2>
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  alert.severity === 'critical' ? 'border-purple-500' :
                  alert.severity === 'warning' ? 'border-orange-500' :
                  'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {alert.timestamp.toLocaleTimeString('tr-TR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{alert.studentName}</h3>
                    <p className="text-gray-700">{alert.message}</p>
                    {alert.acknowledged && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ {alert.resolvedBy} tarafından {alert.resolvedAt?.toLocaleTimeString('tr-TR')} çözüldü
                      </div>
                    )}
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Onayla
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Öğrenci Detay: {selectedStudent.name}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Webcam Feed */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Canlı Kamera</h3>
                <img
                  src={selectedStudent.webcamThumbnail}
                  alt={selectedStudent.name}
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Soru İlerlemesi</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.currentQuestionIndex + 1}/{selectedStudent.totalQuestions}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Cevaplanan</div>
                  <div className="text-2xl font-bold text-green-600">{selectedStudent.answeredCount}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Kalan Süre</div>
                  <div className="text-2xl font-bold text-yellow-600">{formatTime(selectedStudent.timeRemaining)}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">İhlal Sayısı</div>
                  <div className="text-2xl font-bold text-red-600">{selectedStudent.violations.length}</div>
                </div>
              </div>

              {/* Violations */}
              {selectedStudent.violations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">İhlal Geçmişi</h3>
                  <div className="space-y-2">
                    {selectedStudent.violations.map(violation => (
                      <div key={violation.id} className={`p-3 rounded-lg border-l-4 ${
                        violation.severity === 'critical' ? 'bg-purple-50 border-purple-500' :
                        violation.severity === 'high' ? 'bg-red-50 border-red-500' :
                        violation.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-gray-50 border-gray-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(violation.severity)}`}>
                              {violation.severity}
                            </span>
                            <span className="ml-3 text-gray-900">{violation.description}</span>
                          </div>
                          <span className="text-sm text-gray-600">{violation.timestamp.toLocaleTimeString('tr-TR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleSendMessage(selectedStudent.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageSquare className="h-4 w-4" /> Mesaj Gönder
                </button>
                <button
                  onClick={() => handleTerminateExam(selectedStudent.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <XCircle className="h-4 w-4" /> Sınavı Sonlandır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

