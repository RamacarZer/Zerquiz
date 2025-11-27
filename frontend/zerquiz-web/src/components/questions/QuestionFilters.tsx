import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getDemoSubjects,
  getDemoTopics,
  getDemoQuestionTypes,
  getDemoDifficultyLevels,
  getDemoPedagogicalTypes,
  getDemoAuthors,
} from '../../mocks/questionDemoData';

export interface QuestionFiltersState {
  search: string;
  status: string;
  difficultyLevel: string;
  questionType: string;
  subjectId: string;
  topicId: string;
  pedagogicalType: string;
  authorId: string;
  dateFrom: string;
  dateTo: string;
  tags: string;
}

interface QuestionFiltersProps {
  filters: QuestionFiltersState;
  onFiltersChange: (filters: QuestionFiltersState) => void;
  onSearch: () => void;
  onReset: () => void;
  resultCount?: number;
}

export default function QuestionFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  resultCount,
}: QuestionFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Load data
  const subjects = getDemoSubjects();
  const topics = getDemoTopics(filters.subjectId);
  const questionTypes = getDemoQuestionTypes();
  const difficultyLevels = getDemoDifficultyLevels();
  const pedagogicalTypes = getDemoPedagogicalTypes();
  const authors = getDemoAuthors();

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(
      ([key, value]) => key !== 'search' && value !== ''
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (key: keyof QuestionFiltersState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset topic when subject changes
    if (key === 'subjectId' && value !== filters.subjectId) {
      newFilters.topicId = '';
    }
    
    onFiltersChange(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'draft', label: '📝 Taslak' },
    { value: 'review', label: '🔍 İncelemede' },
    { value: 'approved', label: '✅ Onaylanmış' },
    { value: 'published', label: '🌐 Yayınlanmış' },
    { value: 'archived', label: '📦 Arşivlenmiş' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Main Filters Row */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Soru kodu, metin veya etiket ara..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={filters.difficultyLevel}
              onChange={(e) => handleFilterChange('difficultyLevel', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Zorluklar</option>
              {difficultyLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <select
              value={filters.questionType}
              onChange={(e) => handleFilterChange('questionType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Soru Tipleri</option>
              {questionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onSearch}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Ara
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              title="Filtreleri Temizle"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <Filter className="h-4 w-4" />
            Gelişmiş Filtreler
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {activeFiltersCount}
              </span>
            )}
            {isAdvancedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {resultCount !== undefined && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{resultCount}</span> soru bulundu
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Branş
              </label>
              <select
                value={filters.subjectId}
                onChange={(e) => handleFilterChange('subjectId', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Tüm Branşlar</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Konu
              </label>
              <select
                value={filters.topicId}
                onChange={(e) => handleFilterChange('topicId', e.target.value)}
                disabled={!filters.subjectId}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Tüm Konular</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pedagogical Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Pedagojik Tip
              </label>
              <select
                value={filters.pedagogicalType}
                onChange={(e) => handleFilterChange('pedagogicalType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Tüm Pedagojik Tipler</option>
                {pedagogicalTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Oluşturan
              </label>
              <select
                value={filters.authorId}
                onChange={(e) => handleFilterChange('authorId', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Tüm Yazarlar</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Etiketler (virgülle ayırın)
              </label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                placeholder="örn: cebir, denklem, temel"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

