// Advanced Question Generator with All Question Types
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Wand2, FileText, ArrowRight, ArrowLeft, Save, Eye,
  Plus, Trash2, Copy, Check, X, Upload, Download, Sparkles
} from 'lucide-react';
import { AdvancedRichTextEditor } from '../../components/editor/AdvancedRichTextEditor';

// Tüm 30 soru tipi
const QUESTION_TYPES = [
  // Kategori 1: Klasik Test Soruları
  { id: 'multiple_choice_single', name: 'Çoktan Seçmeli (Tek Doğru)', category: 'Klasik', icon: '📝', hasOptions: true },
  { id: 'multiple_choice_multiple', name: 'Çoktan Seçmeli (Çoklu Doğru)', category: 'Klasik', icon: '✅', hasOptions: true },
  { id: 'true_false', name: 'Doğru/Yanlış', category: 'Klasik', icon: '✓✗', hasOptions: true },
  { id: 'short_answer', name: 'Kısa Cevap', category: 'Klasik', icon: '📄', hasOptions: false },
  { id: 'essay', name: 'Uzun Cevap/Essay', category: 'Klasik', icon: '📰', hasOptions: false },
  { id: 'fill_blank', name: 'Boşluk Doldurma', category: 'Klasik', icon: '___', hasOptions: false },
  { id: 'open_ended', name: 'Açık Uçlu', category: 'Klasik', icon: '💭', hasOptions: false },
  { id: 'numeric_input', name: 'Sayısal Cevap', category: 'Klasik', icon: '🔢', hasOptions: false },
  { id: 'ordering_sequence', name: 'Sıralama', category: 'Klasik', icon: '🔀', hasOptions: true },
  { id: 'matching_pairs', name: 'Eşleştirme', category: 'Klasik', icon: '🔗', hasOptions: true },
  { id: 'table_matching', name: 'Tablo Eşleştirme', category: 'Klasik', icon: '📊', hasOptions: true },
  { id: 'matrix_type', name: 'Matrix/Kıyaslama', category: 'Klasik', icon: '⬜', hasOptions: true },

  // Kategori 2: İleri Etkileşimli
  { id: 'drag_drop_text', name: 'Sürükle-Bırak Metin', category: 'Etkileşimli', icon: '🔤', hasOptions: false },
  { id: 'drag_drop_image', name: 'Sürükle-Bırak Görsel', category: 'Etkileşimli', icon: '🖼️', hasOptions: false },
  { id: 'hotspot', name: 'Hotspot (Tek Nokta)', category: 'Etkileşimli', icon: '🎯', hasOptions: false },
  { id: 'multi_hotspot', name: 'Multi-Hotspot', category: 'Etkileşimli', icon: '🎪', hasOptions: false },
  { id: 'image_labeling', name: 'Etiketleme', category: 'Etkileşimli', icon: '🏷️', hasOptions: false },
  { id: 'map_point_select', name: 'Harita Nokta Seçme', category: 'Etkileşimli', icon: '🗺️', hasOptions: false },
  { id: 'area_selection', name: 'Alan Seçme', category: 'Etkileşimli', icon: '🔲', hasOptions: false },
  { id: 'simulation_based', name: 'Simülasyon Tabanlı', category: 'Etkileşimli', icon: '🎮', hasOptions: false },
  { id: '3d_model_marking', name: '3D Model İşaretleme', category: 'Etkileşimli', icon: '🎲', hasOptions: false },
  { id: 'sorting_categories', name: 'Kategori Ayırma', category: 'Etkileşimli', icon: '📦', hasOptions: true },

  // Kategori 3: Medya Tabanlı
  { id: 'video_prompt', name: 'Video Tabanlı Soru', category: 'Medya', icon: '🎬', hasOptions: false },
  { id: 'audio_response', name: 'Ses Dinleme', category: 'Medya', icon: '🎧', hasOptions: false },
  { id: 'speech_oral_exam', name: 'Konuşarak Cevap', category: 'Medya', icon: '🎤', hasOptions: false },
  { id: 'image_prompt', name: 'Resim Tabanlı', category: 'Medya', icon: '🖼️', hasOptions: false },
  { id: 'gif_animation', name: 'GIF/Animasyon', category: 'Medya', icon: '🎞️', hasOptions: false },
  { id: 'pdf_document', name: 'PDF Doküman', category: 'Medya', icon: '📕', hasOptions: false },
  { id: 'chart_graph', name: 'Chart/Grafik', category: 'Medya', icon: '📈', hasOptions: false },
  { id: 'table_data', name: 'Tablo Analizi', category: 'Medya', icon: '📋', hasOptions: false },
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Kolay', color: 'bg-green-100 text-green-700' },
  { id: 'medium', name: 'Orta', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'hard', name: 'Zor', color: 'bg-red-100 text-red-700' },
];

interface QuestionData {
  id: string;
  type: string;
  stem: string;
  options?: Array<{ key: string; text: string; isCorrect: boolean }>;
  correctAnswer?: string;
  explanation?: string;
  difficulty: string;
  points: number;
  tags: string[];
  media?: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
}

export default function QuestionGeneratorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(QUESTION_TYPES.map(t => t.category))];
  
  const filteredTypes = QUESTION_TYPES.filter(type => {
    const matchesCategory = categoryFilter === 'all' || type.category === categoryFilter;
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const startCreating = () => {
    if (selectedTypes.length === 0) {
      alert('Lütfen en az bir soru tipi seçin!');
      return;
    }
    setStep(2);
    createNewQuestion();
  };

  const createNewQuestion = () => {
    const type = selectedTypes[0]; // First selected type
    const questionType = QUESTION_TYPES.find(t => t.id === type);
    
    const newQuestion: QuestionData = {
      id: Date.now().toString(),
      type,
      stem: '',
      difficulty: 'medium',
      points: 10,
      tags: [],
    };

    if (questionType?.hasOptions) {
      newQuestion.options = [
        { key: 'A', text: '', isCorrect: false },
        { key: 'B', text: '', isCorrect: false },
        { key: 'C', text: '', isCorrect: false },
        { key: 'D', text: '', isCorrect: false },
      ];
    }

    setCurrentQuestion(newQuestion);
    setEditingIndex(questions.length);
  };

  const saveCurrentQuestion = () => {
    if (!currentQuestion || !currentQuestion.stem) {
      alert('Lütfen soru metnini doldurun!');
      return;
    }

    if (editingIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = currentQuestion;
      setQuestions(newQuestions);
    } else {
      setQuestions([...questions, currentQuestion]);
    }

    setCurrentQuestion(null);
    setEditingIndex(null);
  };

  const addOption = () => {
    if (!currentQuestion?.options) return;
    const nextKey = String.fromCharCode(65 + currentQuestion.options.length);
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { key: nextKey, text: '', isCorrect: false }]
    });
  };

  const removeOption = (index: number) => {
    if (!currentQuestion?.options) return;
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index)
    });
  };

  const toggleCorrect = (index: number) => {
    if (!currentQuestion?.options) return;
    const questionType = QUESTION_TYPES.find(t => t.id === currentQuestion.type);
    
    const newOptions = currentQuestion.options.map((opt, i) => {
      if (questionType?.id === 'multiple_choice_single') {
        // Single answer - uncheck others
        return { ...opt, isCorrect: i === index };
      } else {
        // Multiple answers
        return i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt;
      }
    });

    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const updateOptionText = (index: number, text: string) => {
    if (!currentQuestion?.options) return;
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = text;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/questions')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gelişmiş Soru Üreticisi
              </h1>
              <p className="text-lg text-gray-600">
                30 farklı soru tipi • MathJax desteği • Medya entegrasyonu
              </p>
            </div>
            {step === 2 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Toplam Soru</p>
                <p className="text-3xl font-bold text-blue-600">{questions.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Tip Seçimi' },
              { num: 2, label: 'Soru Oluşturma' },
              { num: 3, label: 'Önizleme & Kaydet' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-3 ${idx > 0 ? 'ml-4' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`text-sm font-medium ${
                    step >= s.num ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Soru tipi ara..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat === 'all' ? 'Tümü' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTypes.map(type => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{type.name}</h3>
                        <p className="text-xs text-gray-600">{type.category}</p>
                        {type.hasOptions && (
                          <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            Seçenekli
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Count */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Seçilen Tip Sayısı</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTypes.length}</p>
                </div>
                <button
                  onClick={startCreating}
                  disabled={selectedTypes.length === 0}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Soru Oluşturmaya Başla
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Question Creation */}
        {step === 2 && currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Question List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Sorular ({questions.length})</h3>
                  <button
                    onClick={createNewQuestion}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestion(q);
                        setEditingIndex(idx);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        editingIndex === idx
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-bold text-gray-500">#{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {q.stem || 'Soru metni girilmedi'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {QUESTION_TYPES.find(t => t.id === q.type)?.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={questions.length === 0}
                  className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  Önizlemeye Geç ({questions.length})
                </button>
              </div>
            </div>

            {/* Right: Question Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Question Type Info */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {QUESTION_TYPES.find(t => t.id === currentQuestion.type)?.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {QUESTION_TYPES.find(t => t.id === currentQuestion.type)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {QUESTION_TYPES.find(t => t.id === currentQuestion.type)?.category}
                      </p>
                    </div>
                  </div>
                  
                  {/* Difficulty Selector */}
                  <select
                    value={currentQuestion.difficulty}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                {/* Question Stem with MathJax */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Soru Metni * <span className="text-blue-600">(MathJax Destekli)</span>
                  </label>
                  <AdvancedRichTextEditor
                    value={currentQuestion.stem}
                    onChange={(html) => setCurrentQuestion({ ...currentQuestion, stem: html })}
                    placeholder="Sorunuzu yazın... Formül için: $x^2 + y^2 = z^2$ veya $$\frac{a}{b}$$"
                    height={250}
                    enableKatex={true}
                    enableMedia={true}
                  />
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>MathJax İpuçları:</strong><br/>
                      • Inline: <code>$x^2$</code> → $x^2$<br/>
                      • Block: <code>$$\frac{'{a}'}{'{b}'}$$</code> → $$\frac{'{a}'}{'{b}'}$$<br/>
                      • Özel karakterler: <code>\alpha, \beta, \sum, \int</code>
                    </p>
                  </div>
                </div>

                {/* Options for MCQ, etc */}
                {currentQuestion.options && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-gray-900">
                        Seçenekler
                      </label>
                      <button
                        onClick={addOption}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Seçenek Ekle
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <button
                            onClick={() => toggleCorrect(idx)}
                            className={`mt-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              option.isCorrect
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                            }`}
                          >
                            {option.isCorrect && <Check className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-700">{option.key}.</span>
                            </div>
                            <AdvancedRichTextEditor
                              value={option.text}
                              onChange={(html) => updateOptionText(idx, html)}
                              placeholder={`Seçenek ${option.key}`}
                              height={100}
                              enableKatex={true}
                            />
                          </div>
                          
                          <button
                            onClick={() => removeOption(idx)}
                            className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Açıklama (Opsiyonel)
                  </label>
                  <AdvancedRichTextEditor
                    value={currentQuestion.explanation || ''}
                    onChange={(html) => setCurrentQuestion({ ...currentQuestion, explanation: html })}
                    placeholder="Sorunun çözümünü veya açıklamasını yazın..."
                    height={150}
                    enableKatex={true}
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Puan
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 0 })}
                    className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>

                {/* Save Button */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={saveCurrentQuestion}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                  >
                    <Save className="w-5 h-5" />
                    Soruyu Kaydet
                  </button>
                  {editingIndex !== null && (
                    <button
                      onClick={() => {
                        const newQuestions = questions.filter((_, idx) => idx !== editingIndex);
                        setQuestions(newQuestions);
                        createNewQuestion();
                      }}
                      className="px-6 py-4 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Soru Önizlemesi ({questions.length} Soru)
              </h2>
              
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">#{idx + 1}</span>
                        <div>
                          <p className="text-sm text-gray-600">
                            {QUESTION_TYPES.find(t => t.id === q.type)?.name}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        DIFFICULTY_LEVELS.find(d => d.id === q.difficulty)?.color
                      }`}>
                        {DIFFICULTY_LEVELS.find(d => d.id === q.difficulty)?.name}
                      </span>
                    </div>
                    
                    <div 
                      className="prose max-w-none mb-4" 
                      dangerouslySetInnerHTML={{ __html: q.stem }}
                    />
                    
                    {q.options && (
                      <div className="space-y-2 ml-4">
                        {q.options.map((opt) => (
                          <div key={opt.key} className="flex items-start gap-3">
                            <span className={`font-bold ${opt.isCorrect ? 'text-green-600' : 'text-gray-600'}`}>
                              {opt.key}.
                            </span>
                            <div 
                              className={`flex-1 ${opt.isCorrect ? 'text-green-700 font-medium' : ''}`}
                              dangerouslySetInnerHTML={{ __html: opt.text }}
                            />
                            {opt.isCorrect && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {q.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-bold text-blue-900 mb-2">Açıklama:</p>
                        <div 
                          className="text-sm text-blue-800 prose-sm"
                          dangerouslySetInnerHTML={{ __html: q.explanation }}
                        />
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <span>Puan: <strong>{q.points}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Geri Dön
                </button>
                <button
                  onClick={() => {
                    console.log('Saving questions:', questions);
                    alert(`${questions.length} soru kaydedildi!`);
                    navigate('/questions');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-blue-700"
                >
                  <Save className="w-5 h-5" />
                  Tüm Soruları Kaydet ({questions.length})
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

