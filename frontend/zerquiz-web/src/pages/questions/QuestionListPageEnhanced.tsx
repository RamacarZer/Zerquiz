import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileDown, FileUp, RefreshCw } from 'lucide-react';
import QuestionFilters, { QuestionFiltersState } from '../../components/questions/QuestionFilters';
import BulkActionsBar from '../../components/questions/BulkActionsBar';
import QuestionPreviewModal from '../../components/questions/QuestionPreviewModal';
import { demoQuestions, type DemoQuestion } from '../../mocks/questionDemoData';

export default function QuestionListPageEnhanced() {
  const navigate = useNavigate();
  
  // States
  const [questions, setQuestions] = useState<DemoQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DemoQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewQuestion, setPreviewQuestion] = useState<DemoQuestion | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Filters
  const [filters, setFilters] = useState<QuestionFiltersState>({
    search: '',
    status: '',
    difficultyLevel: '',
    questionType: '',
    subjectId: '',
    topicId: '',
    pedagogicalType: '',
    authorId: '',
    dateFrom: '',
    dateTo: '',
    tags: '',
  });

  // Load demo data on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [questions, filters, currentPage]);

  const loadQuestions = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setQuestions(demoQuestions);
      setLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.code.toLowerCase().includes(searchLower) ||
          q.questionText.toLowerCase().includes(searchLower) ||
          q.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((q) => q.status === filters.status);
    }

    // Difficulty filter
    if (filters.difficultyLevel) {
      filtered = filtered.filter((q) => q.difficultyLevelId === filters.difficultyLevel);
    }

    // Question type filter
    if (filters.questionType) {
      filtered = filtered.filter((q) => q.formatTypeId === filters.questionType);
    }

    // Subject filter
    if (filters.subjectId) {
      filtered = filtered.filter((q) => q.subjectId === filters.subjectId);
    }

    // Topic filter
    if (filters.topicId) {
      filtered = filtered.filter((q) => q.topicId === filters.topicId);
    }

    // Pedagogical type filter
    if (filters.pedagogicalType) {
      filtered = filtered.filter((q) => q.pedagogicalTypeId === filters.pedagogicalType);
    }

    // Author filter
    if (filters.authorId) {
      filtered = filtered.filter((q) => q.createdBy === filters.authorId);
    }

    // Date from filter
    if (filters.dateFrom) {
      filtered = filtered.filter((q) => new Date(q.createdAt) >= new Date(filters.dateFrom));
    }

    // Date to filter
    if (filters.dateTo) {
      filtered = filtered.filter((q) => new Date(q.createdAt) <= new Date(filters.dateTo));
    }

    // Tags filter
    if (filters.tags) {
      const filterTags = filters.tags.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((q) =>
        filterTags.some((ft) => q.tags?.some((qt) => qt.toLowerCase().includes(ft)))
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    applyFilters();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: '',
      difficultyLevel: '',
      questionType: '',
      subjectId: '',
      topicId: '',
      pedagogicalType: '',
      authorId: '',
      dateFrom: '',
      dateTo: '',
      tags: '',
    });
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / pageSize);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection handlers
  const isAllSelected = selectedIds.size === paginatedQuestions.length && paginatedQuestions.length > 0;
  
  const handleSelectAll = () => {
    const newSet = new Set(selectedIds);
    paginatedQuestions.forEach((q) => newSet.add(q.id));
    setSelectedIds(newSet);
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (confirm(`${selectedIds.size} soruyu silmek istediğinizden emin misiniz?`)) {
      setQuestions(questions.filter((q) => !selectedIds.has(q.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBulkArchive = () => {
    if (confirm(`${selectedIds.size} soruyu arşivlemek istediğinizden emin misiniz?`)) {
      setQuestions(
        questions.map((q) =>
          selectedIds.has(q.id) ? { ...q, status: 'archived' as const } : q
        )
      );
      setSelectedIds(new Set());
    }
  };

  const handleBulkCopy = () => {
    alert(`${selectedIds.size} soru kopyalanıyor... (Geliştirme aşamasında)`);
  };

  const handleBulkMove = () => {
    alert(`${selectedIds.size} soru taşınıyor... (Geliştirme aşamasında)`);
  };

  const handleBulkExport = () => {
    const selected = questions.filter((q) => selectedIds.has(q.id));
    const dataStr = JSON.stringify(selected, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sorular-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Single question actions
  const handlePreview = (question: DemoQuestion) => {
    setPreviewQuestion(question);
    setIsPreviewOpen(true);
  };

  const handleEdit = (id: string) => {
    navigate(`/questions/editor/${id}`);
  };

  const handleCopy = (id: string) => {
    alert(`Soru ${id} kopyalanıyor... (Geliştirme aşamasında)`);
  };

  const handleArchive = (id: string) => {
    if (confirm('Bu soruyu arşivlemek istediğinizden emin misiniz?')) {
      setQuestions(
        questions.map((q) => (q.id === id ? { ...q, status: 'archived' as const } : q))
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Badge helpers
  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: '📝 Taslak' },
      review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🔍 İnceleme' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Onaylanmış' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: '🌐 Yayınlanmış' },
      archived: { bg: 'bg-red-100', text: 'text-red-800', label: '📦 Arşivlenmiş' },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Kolay' },
      medium: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Orta' },
      hard: { bg: 'bg-red-50', text: 'text-red-700', label: 'Zor' },
      very_hard: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Çok Zor' },
    };
    return badges[difficulty as keyof typeof badges] || badges.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Soru Bankası</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {filteredQuestions.length} soru ({questions.length} toplam)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadQuestions}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Yenile
              </button>
              <button
                onClick={() => alert('Excel import özelliği geliştirme aşamasında')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                <FileUp className="h-4 w-4" />
                İçe Aktar
              </button>
              <button
                onClick={() => navigate('/questions/editor')}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Yeni Soru
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="mb-6">
          <QuestionFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            resultCount={filteredQuestions.length}
          />
        </div>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedIds.size}
          totalCount={paginatedQuestions.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkArchive={handleBulkArchive}
          onBulkCopy={handleBulkCopy}
          onBulkMove={handleBulkMove}
          onBulkExport={handleBulkExport}
          isAllSelected={isAllSelected}
        />

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          ) : paginatedQuestions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">Soru bulunamadı</p>
              <p className="text-sm text-gray-400 mb-4">Filtreleri değiştirin veya yeni soru oluşturun</p>
              <button
                onClick={() => navigate('/questions/editor')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                İlk Soruyu Oluştur
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={isAllSelected ? handleDeselectAll : handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kod
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branş / Konu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip / Zorluk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İstatistik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedQuestions.map((question) => {
                    const status = getStatusBadge(question.status);
                    const difficulty = getDifficultyBadge(question.difficultyLevelId);
                    
                    return (
                      <tr
                        key={question.id}
                        className={`hover:bg-gray-50 transition cursor-pointer ${
                          selectedIds.has(question.id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).tagName !== 'INPUT' && 
                              (e.target as HTMLElement).tagName !== 'BUTTON' &&
                              !(e.target as HTMLElement).closest('button')) {
                            handlePreview(question);
                          }
                        }}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(question.id)}
                            onChange={() => handleToggleSelect(question.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900">
                            {question.code}
                          </div>
                          <div className="text-xs text-gray-500">{question.createdByName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {question.subjectName || '-'}
                          </div>
                          <div className="text-xs text-gray-500">{question.topicName || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${difficulty.bg} ${difficulty.text}`}>
                              {difficulty.label}
                            </span>
                            <div className="text-xs text-gray-500">{question.formatTypeName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          <div>👁️ {question.viewCount}</div>
                          <div>📊 {question.usageCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(question.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(question.id);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(question.id);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Sayfa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
              <span className="ml-2 text-gray-500">
                ({(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredQuestions.length)} / {filteredQuestions.length})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm font-medium"
              >
                Önceki
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm font-medium"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <QuestionPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        question={previewQuestion}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
}

