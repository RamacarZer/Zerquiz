import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Eye, Edit, Trash2, Copy, Users, Star,
  FileText, Presentation, Briefcase, BookOpen, FlaskConical, ClipboardList,
  CheckCircle, Clock, BarChart3, Download,
} from 'lucide-react';
import {
  Rubric, StudentRubricEvaluation, RubricCriterion, CriterionScore,
  mockRubricTemplates, mockStudentEvaluations, getGradeFromPercentage, getRubricById,
} from '../../mocks/rubricData';

type ViewMode = 'templates' | 'evaluate' | 'results';

export default function RubricEvaluationPage() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Evaluation state
  const [studentName, setStudentName] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [criteriaScores, setCriteriaScores] = useState<Record<string, { levelId: string; points: number; feedback: string }>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');

  const categoryIcons = {
    essay: FileText,
    project: Briefcase,
    presentation: Presentation,
    portfolio: BookOpen,
    lab_report: FlaskConical,
    assignment: ClipboardList,
  };

  const categoryLabels = {
    essay: 'Kompozisyon',
    project: 'Proje',
    presentation: 'Sunum',
    portfolio: 'Portfolyo',
    lab_report: 'Lab Raporu',
    assignment: 'Ödev',
  };

  const filteredRubrics = mockRubricTemplates.filter(r =>
    (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || r.category === categoryFilter)
  );

  const handleSelectLevel = (criterionId: string, level: any, criterion: RubricCriterion) => {
    const points = Math.floor((level.minPoints + level.maxPoints) / 2);
    setCriteriaScores(prev => ({
      ...prev,
      [criterionId]: {
        levelId: level.id,
        points: points,
        feedback: '',
      },
    }));
  };

  const handleUpdateFeedback = (criterionId: string, feedback: string) => {
    setCriteriaScores(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        feedback: feedback,
      },
    }));
  };

  const calculateTotalScore = (): number => {
    return Object.values(criteriaScores).reduce((sum, score) => sum + score.points, 0);
  };

  const handleSubmitEvaluation = () => {
    const totalScore = calculateTotalScore();
    const totalPoints = selectedRubric?.totalPoints || 100;
    const percentage = Math.round((totalScore / totalPoints) * 100);
    const grade = getGradeFromPercentage(percentage);

    alert(`Değerlendirme Kaydedildi!\n\nÖğrenci: ${studentName}\nToplam Puan: ${totalScore}/${totalPoints}\nYüzde: ${percentage}%\nNot: ${grade}\n\n(Demo Mode)`);
    setShowEvaluateModal(false);
    resetEvaluationForm();
  };

  const resetEvaluationForm = () => {
    setStudentName('');
    setAssignmentTitle('');
    setCriteriaScores({});
    setGeneralFeedback('');
  };

  const statCards = [
    { label: 'Toplam Rubric', value: mockRubricTemplates.length, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Halka Açık', value: mockRubricTemplates.filter(r => r.isPublic).length, icon: Users, color: 'bg-green-500' },
    { label: 'Değerlendirmeler', value: mockStudentEvaluations.length, icon: CheckCircle, color: 'bg-purple-500' },
    { label: 'Toplam Kullanım', value: mockRubricTemplates.reduce((sum, r) => sum + r.usageCount, 0), icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="h-7 w-7 text-blue-600" />
                Rubric Değerlendirme Sistemi
              </h1>
              <p className="text-sm text-gray-600 mt-1">Ölçüt bazlı detaylı puanlama ve geri bildirim</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Yeni Rubric Oluştur
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.color} text-white p-4 rounded-lg shadow-md flex items-center justify-between`}>
                <div>
                  <div className="text-sm font-medium opacity-80">{card.label}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                <card.icon className="h-8 w-8 opacity-50" />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              onClick={() => setViewMode('templates')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'templates'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" /> Rubric Şablonları
            </button>
            <button
              onClick={() => setViewMode('evaluate')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'evaluate'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Edit className="h-4 w-4" /> Değerlendirme Yap
            </button>
            <button
              onClick={() => setViewMode('results')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'results'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" /> Sonuçlar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'templates' && (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rubric ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="essay">Kompozisyon</option>
                <option value="project">Proje</option>
                <option value="presentation">Sunum</option>
                <option value="portfolio">Portfolyo</option>
                <option value="lab_report">Lab Raporu</option>
                <option value="assignment">Ödev</option>
              </select>
            </div>

            {/* Rubric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRubrics.map(rubric => {
                const IconComponent = categoryIcons[rubric.category];
                return (
                  <div key={rubric.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{rubric.name}</h3>
                          <p className="text-xs text-gray-600">{categoryLabels[rubric.category]}</p>
                        </div>
                      </div>
                      {rubric.isPublic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Halka Açık</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{rubric.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{rubric.criteria.length} Kriter</span>
                      <span>{rubric.totalPoints} Puan</span>
                      <span>{rubric.usageCount} Kullanım</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRubric(rubric);
                          setShowRubricModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Eye className="h-4 w-4" /> Görüntüle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRubric(rubric);
                          setShowEvaluateModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                      >
                        <Edit className="h-4 w-4" /> Kullan
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'evaluate' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Değerlendirme Yapılacak Rubric Seçin</h2>
            <p className="text-gray-600">Lütfen önce "Rubric Şablonları" sekmesinden bir rubric seçip "Kullan" butonuna tıklayın.</p>
          </div>
        )}

        {viewMode === 'results' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Değerlendirme Sonuçları</h2>
            {mockStudentEvaluations.map(evaluation => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{evaluation.studentName}</h3>
                    <p className="text-sm text-gray-600">{evaluation.assignmentTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Değerlendiren: {evaluation.evaluatorName} • {evaluation.evaluatedAt.toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{evaluation.grade}</div>
                    <div className="text-sm text-gray-600">{evaluation.totalScore}/{evaluation.totalPoints} ({evaluation.percentage}%)</div>
                  </div>
                </div>

                {/* Criteria Scores */}
                <div className="space-y-3 mb-4">
                  {evaluation.criteriaScores.map(score => (
                    <div key={score.criterionId} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{score.criterionName}</span>
                        <span className="text-sm font-semibold text-gray-700">{score.points}/{score.maxPoints}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{score.selectedLevelName}</span>
                      </div>
                      {score.feedback && (
                        <p className="text-sm text-gray-600 italic">{score.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* General Feedback */}
                {evaluation.feedback && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Genel Geri Bildirim:</h4>
                    <p className="text-gray-700">{evaluation.feedback}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Download className="h-4 w-4" /> PDF İndir
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <Eye className="h-4 w-4" /> Detay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evaluation Modal */}
      {showEvaluateModal && selectedRubric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900">Değerlendirme: {selectedRubric.name}</h2>
              <button
                onClick={() => {
                  setShowEvaluateModal(false);
                  resetEvaluationForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Adı *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Örn: Ali Yılmaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder="Örn: Küresel Isınma Kompozisyonu"
                  />
                </div>
              </div>

              {/* Criteria Evaluation */}
              {selectedRubric.criteria.map(criterion => (
                <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{criterion.name}</h3>
                      <p className="text-sm text-gray-600">{criterion.description}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Ağırlık: %{criterion.weight}</span>
                  </div>

                  {/* Level Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {criterion.levels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => handleSelectLevel(criterion.id, level, criterion)}
                        className={`p-3 border-2 rounded-lg transition ${
                          criteriaScores[criterion.id]?.levelId === level.id
                            ? `${level.color} text-white border-transparent`
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        <div className="font-semibold text-sm">{level.name}</div>
                        <div className="text-xs mt-1">{level.minPoints}-{level.maxPoints} puan</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Level Description */}
                  {criteriaScores[criterion.id] && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">
                        {criterion.levels.find(l => l.id === criteriaScores[criterion.id].levelId)?.description}
                      </p>
                    </div>
                  )}

                  {/* Feedback */}
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows={2}
                    placeholder="Bu kriter için geri bildirim (opsiyonel)..."
                    value={criteriaScores[criterion.id]?.feedback || ''}
                    onChange={(e) => handleUpdateFeedback(criterion.id, e.target.value)}
                  />
                </div>
              ))}

              {/* General Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genel Geri Bildirim</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Öğrenciye genel değerlendirme ve öneriler..."
                  value={generalFeedback}
                  onChange={(e) => setGeneralFeedback(e.target.value)}
                />
              </div>

              {/* Score Summary */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-80">Toplam Puan</div>
                    <div className="text-4xl font-bold">{calculateTotalScore()}/{selectedRubric.totalPoints}</div>
                    <div className="text-sm mt-1">
                      {Math.round((calculateTotalScore() / selectedRubric.totalPoints) * 100)}% • 
                      Not: {getGradeFromPercentage(Math.round((calculateTotalScore() / selectedRubric.totalPoints) * 100))}
                    </div>
                  </div>
                  <CheckCircle className="h-16 w-16 opacity-50" />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 rounded-b-lg">
              <button
                onClick={() => {
                  setShowEvaluateModal(false);
                  resetEvaluationForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                İptal
              </button>
              <button
                onClick={handleSubmitEvaluation}
                disabled={!studentName || !assignmentTitle || Object.keys(criteriaScores).length !== selectedRubric.criteria.length}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Değerlendirmeyi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rubric Detail Modal */}
      {showRubricModal && selectedRubric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedRubric.name}</h2>
              <button
                onClick={() => setShowRubricModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700">{selectedRubric.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-gray-600">Kategori</div>
                  <div className="font-semibold text-gray-900">{categoryLabels[selectedRubric.category]}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-gray-600">Toplam Puan</div>
                  <div className="font-semibold text-gray-900">{selectedRubric.totalPoints}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-gray-600">Kullanım</div>
                  <div className="font-semibold text-gray-900">{selectedRubric.usageCount} kez</div>
                </div>
              </div>

              {selectedRubric.criteria.map(criterion => (
                <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{criterion.name}</h3>
                    <span className="text-sm font-medium text-gray-700">%{criterion.weight}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{criterion.description}</p>
                  <div className="space-y-2">
                    {criterion.levels.map(level => (
                      <div key={level.id} className={`${level.color} text-white p-3 rounded-lg`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{level.name}</span>
                          <span className="text-sm">{level.minPoints}-{level.maxPoints} puan</span>
                        </div>
                        <p className="text-sm opacity-90">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Rubric Oluştur</h2>
            <p className="text-gray-600 mb-4">Bu özellik yakında eklenecek! (Demo Mode)</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

