import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, CheckSquare, Square, Eye, DragHandleDots2 } from 'lucide-react';
import { demoQuestions, type DemoQuestion, getDemoSubjects, getDemoTopics } from '../../mocks/questionDemoData';
import QuestionPreviewModal from '../questions/QuestionPreviewModal';

interface QuestionSelectorProps {
  selectedQuestionIds: string[];
  onQuestionsChange: (questionIds: string[]) => void;
  onOrderChange?: (questionIds: string[]) => void;
}

export default function QuestionSelector({
  selectedQuestionIds,
  onQuestionsChange,
  onOrderChange,
}: QuestionSelectorProps) {
  const [questions, setQuestions] = useState<DemoQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DemoQuestion[]>([]);
  const [previewQuestion, setPreviewQuestion] = useState<DemoQuestion | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'available' | 'selected'>('available');

  useEffect(() => {
    // Sadece published soruları yükle
    const published = demoQuestions.filter((q) => q.status === 'published');
    setQuestions(published);
    setFilteredQuestions(published);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, subjectFilter, topicFilter, difficultyFilter, questions]);

  const applyFilters = () => {
    let filtered = [...questions];

    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.code.toLowerCase().includes(searchLower) ||
          q.questionText.toLowerCase().includes(searchLower)
      );
    }

    // Subject
    if (subjectFilter) {
      filtered = filtered.filter((q) => q.subjectId === subjectFilter);
    }

    // Topic
    if (topicFilter) {
      filtered = filtered.filter((q) => q.topicId === topicFilter);
    }

    // Difficulty
    if (difficultyFilter) {
      filtered = filtered.filter((q) => q.difficultyLevelId === difficultyFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleToggleQuestion = (questionId: string) => {
    if (selectedQuestionIds.includes(questionId)) {
      onQuestionsChange(selectedQuestionIds.filter((id) => id !== questionId));
    } else {
      onQuestionsChange([...selectedQuestionIds, questionId]);
    }
  };

  const handleSelectAll = () => {
    const availableIds = filteredQuestions
      .filter((q) => !selectedQuestionIds.includes(q.id))
      .map((q) => q.id);
    onQuestionsChange([...selectedQuestionIds, ...availableIds]);
  };

  const handleDeselectAll = () => {
    onQuestionsChange([]);
  };

  const handleAutoSelect = (count: number) => {
    const availableQuestions = filteredQuestions.filter(
      (q) => !selectedQuestionIds.includes(q.id)
    );
    const toAdd = availableQuestions.slice(0, count).map((q) => q.id);
    onQuestionsChange([...selectedQuestionIds, ...toAdd]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...selectedQuestionIds];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onQuestionsChange(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedQuestionIds.length - 1) return;
    const newOrder = [...selectedQuestionIds];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onQuestionsChange(newOrder);
  };

  const handleRemove = (questionId: string) => {
    onQuestionsChange(selectedQuestionIds.filter((id) => id !== questionId));
  };

  const selectedQuestions = selectedQuestionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q) => q !== undefined) as DemoQuestion[];

  const availableQuestions = filteredQuestions.filter(
    (q) => !selectedQuestionIds.includes(q.id)
  );

  const subjects = getDemoSubjects();
  const topics = getDemoTopics(subjectFilter);

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
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">{selectedQuestionIds.length}</div>
            <div className="text-xs text-blue-700">Seçili Soru</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-900">{availableQuestions.length}</div>
            <div className="text-xs text-purple-700">Mevcut Soru</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-900">
              {selectedQuestionIds.length * 5}
            </div>
            <div className="text-xs text-emerald-700">Toplam Puan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-900">
              {Math.ceil((selectedQuestionIds.length * 2) / 60)} dk
            </div>
            <div className="text-xs text-orange-700">Tahmini Süre</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'available'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Mevcut Sorular ({availableQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('selected')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'selected'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ✅ Seçilen Sorular ({selectedQuestionIds.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              Tümünü Seç
            </button>
            <button
              onClick={() => handleAutoSelect(10)}
              className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
            >
              Otomatik 10 Soru
            </button>
          </div>
        )}
      </div>

      {/* Available Questions Tab */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <Filter className="h-4 w-4" />
                Filtreler
                {showFilters ? '▲' : '▼'}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ara..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setTopicFilter('');
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Branşlar</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  disabled={!subjectFilter}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Tüm Konular</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Zorluklar</option>
                  <option value="easy">Kolay</option>
                  <option value="medium">Orta</option>
                  <option value="hard">Zor</option>
                  <option value="very_hard">Çok Zor</option>
                </select>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {availableQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Filtrelere uygun soru bulunamadı</p>
              </div>
            ) : (
              availableQuestions.map((question) => {
                const difficulty = getDifficultyBadge(question.difficultyLevelId);
                return (
                  <div
                    key={question.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.includes(question.id)}
                        onChange={() => handleToggleQuestion(question.id)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-600">{question.code}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${difficulty.bg} ${difficulty.text}`}>
                            {difficulty.label}
                          </span>
                          {question.subjectName && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {question.subjectName}
                            </span>
                          )}
                        </div>
                        <div
                          className="text-sm text-gray-900 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: question.questionText }}
                        />
                        {question.topicName && (
                          <div className="text-xs text-gray-500 mt-1">📖 {question.topicName}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPreviewQuestion(question);
                            setIsPreviewOpen(true);
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                          title="Önizle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleQuestion(question.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Ekle"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Selected Questions Tab */}
      {activeTab === 'selected' && (
        <div className="space-y-3">
          {selectedQuestions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">Henüz soru seçilmedi</p>
              <button
                onClick={() => setActiveTab('available')}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Soru Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {selectedQuestions.map((question, index) => {
                const difficulty = getDifficultyBadge(question.difficultyLevelId);
                return (
                  <div
                    key={question.id}
                    className="bg-white border-2 border-blue-200 rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Yukarı"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === selectedQuestions.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Aşağı"
                        >
                          ▼
                        </button>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-600">{question.code}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${difficulty.bg} ${difficulty.text}`}>
                            {difficulty.label}
                          </span>
                          {question.subjectName && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {question.subjectName}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 ml-auto">5 puan</span>
                        </div>
                        <div
                          className="text-sm text-gray-900 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: question.questionText }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPreviewQuestion(question);
                            setIsPreviewOpen(true);
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                          title="Önizle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemove(question.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Kaldır"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <QuestionPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        question={previewQuestion}
      />
    </div>
  );
}

