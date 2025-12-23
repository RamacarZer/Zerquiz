import React, { useState } from 'react';
import { Sparkles, Wand2, FileText, Download, Settings, Filter, Check } from 'lucide-react';
import { QUESTION_TYPES, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, getQuestionTypesByCategory, getQuestionTypesWithTemplates } from '../../../data/questionTypes';

export default function AIQuestionTab() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('orta');
  const [questionCount, setQuestionCount] = useState(10);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const subjects = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'İngilizce'];
  const difficultyLevels = [
    { value: 'kolay', label: 'Kolay', color: 'blue' },
    { value: 'orta', label: 'Orta', color: 'yellow' },
    { value: 'zor', label: 'Zor', color: 'red' },
  ];

  const categories = Object.keys(CATEGORY_LABELS);
  const availableQuestionTypes = getQuestionTypesWithTemplates();
  const displayedTypes = selectedCategory === 'all' 
    ? availableQuestionTypes 
    : getQuestionTypesByCategory(selectedCategory).filter(qt => qt.hasTemplate);

  const toggleQuestionType = (code: string) => {
    setSelectedTypes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const selectAllInCategory = () => {
    const codes = displayedTypes.map(qt => qt.code);
    setSelectedTypes(codes);
  };

  const clearSelection = () => {
    setSelectedTypes([]);
  };

  const handleGenerate = () => {
    console.log('Generating questions:', { selectedTypes, difficulty, questionCount, subject, topic });
    alert(`AI ile ${questionCount} adet soru üretiliyor...\n\nSeçilen tipler: ${selectedTypes.length}\nZorluk: ${difficulty}\nDers: ${subject || 'Seçilmedi'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI ile Soru Üretimi - 65 Soru Tipi
          </h2>
          <p className="text-gray-600 mt-1">
            {availableQuestionTypes.length} soru tipi için AI template hazır • 
            {selectedTypes.length > 0 && ` ${selectedTypes.length} tip seçildi`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Filter className="w-6 h-6 text-indigo-600" />
                Kategori Filtrele
              </h3>
              <div className="flex gap-2">
                <button onClick={selectAllInCategory} className="text-sm text-blue-600 hover:underline">
                  Tümünü Seç
                </button>
                <button onClick={clearSelection} className="text-sm text-red-600 hover:underline">
                  Temizle
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü ({availableQuestionTypes.length})
              </button>
              {categories.map((cat) => {
                const count = getQuestionTypesByCategory(cat).filter(qt => qt.hasTemplate).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? `bg-${CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS]}-500 text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]} {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Type Selection */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Soru Tipi Seçimi ({displayedTypes.length} tip mevcut)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {displayedTypes.map((type) => (
                <button
                  key={type.code}
                  onClick={() => toggleQuestionType(type.code)}
                  className={`p-4 border-2 rounded-xl text-left transition-all relative ${
                    selectedTypes.includes(type.code)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{type.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{type.nameTR}</p>
                      <p className="text-xs text-gray-500 truncate">{type.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded bg-${CATEGORY_COLORS[type.category]}-100 text-${CATEGORY_COLORS[type.category]}-700`}>
                          {CATEGORY_LABELS[type.category]}
                        </span>
                        {type.hasTemplate && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                            ✓ Template
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedTypes.includes(type.code) && (
                      <Check className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject and Topic */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Ders ve Konu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Ders Seçin</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Ders Seçin</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Konu</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Örn: Geometrik Şekiller"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Difficulty and Count */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Zorluk ve Adet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Zorluk Seviyesi</label>
                <div className="flex gap-3">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setDifficulty(level.value)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                        difficulty === level.value
                          ? `bg-${level.color}-100 text-${level.color}-800 border-2 border-${level.color}-500`
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Soru Adedi: <span className="text-purple-600">{questionCount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-600" />
              Özet
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Soru Tipi:</span>
                <span className="font-semibold text-gray-900">
                  {selectedTypes.length > 0 ? `${selectedTypes.length} / ${availableQuestionTypes.length}` : 'Seçilmedi'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'Tümü' : CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ders:</span>
                <span className="font-semibold text-gray-900">{subject || 'Seçilmedi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Konu:</span>
                <span className="font-semibold text-gray-900">{topic || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zorluk:</span>
                <span className="font-semibold text-gray-900 capitalize">{difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adet:</span>
                <span className="font-semibold text-purple-600">{questionCount} soru</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={selectedTypes.length === 0 || !subject}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-5 h-5" />
              AI ile Üret
            </button>

            <button className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <Download className="w-5 h-5" />
              Şablon İndir
            </button>
          </div>
        </div>
      </div>

      {/* AI Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          65 Soru Tipi - AI Template Durumu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-3xl font-bold text-green-600">{availableQuestionTypes.length}</p>
            <p className="text-gray-600 mt-1">Template Hazır</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{QUESTION_TYPES.length - availableQuestionTypes.length}</p>
            <p className="text-gray-600 mt-1">Geliştiriliyor</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-3xl font-bold text-purple-600">65</p>
            <p className="text-gray-600 mt-1">Toplam Tip</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-3xl font-bold text-orange-600">6</p>
            <p className="text-gray-600 mt-1">Kategori</p>
          </div>
        </div>
      </div>
    </div>
  );
}
