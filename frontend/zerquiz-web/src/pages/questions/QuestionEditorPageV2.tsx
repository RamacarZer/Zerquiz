import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Copy, 
  Trash2, 
  Plus,
  BookOpen,
  FileQuestion,
  Presentation,
  X
} from 'lucide-react';
import AdvancedRichTextEditor from '../../components/common/AdvancedRichTextEditor';
import TldrawBoard from '../../components/common/TldrawBoard';
import VideoRecorder from '../../components/common/VideoRecorder';
import Alert from '../../components/common/Alert';

// Content Type Selection
type ContentType = 'lesson' | 'question' | 'presentation';

// Question interface
interface QuestionItem {
  id: string;
  type: 'mcq' | 'true-false' | 'multi-select' | 'essay' | 'fill-blank';
  questionText: string;
  options: Array<{
    key: string;
    text: string;
    isCorrect: boolean;
    feedback?: string;
  }>;
  explanation: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  tldrawSnapshot?: any;
  videoUrl?: string;
  points: number;
}

export default function QuestionEditorPageV2() {
  const navigate = useNavigate();
  
  // Form state
  const [contentType, setContentType] = useState<ContentType>('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Question metadata
  const [formatType, setFormatType] = useState('mcq');
  const [pedagogyType, setPedagogyType] = useState('knowledge'); // Bloom's taxonomy
  const [difficulty, setDifficulty] = useState('medium');
  const [weight, setWeight] = useState(1);
  const [presentationType, setPresentationType] = useState('standard'); // Presentation/Display type
  
  // Curriculum
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  
  // Questions array
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: '1',
      type: 'mcq',
      questionText: '',
      options: [
        { key: 'A', text: '', isCorrect: false },
        { key: 'B', text: '', isCorrect: false },
      ],
      explanation: '',
      points: 1,
    }
  ]);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'content' | 'tldraw' | 'video'>('content');
  
  // Current editing question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Tldraw state
  const [tldrawSnapshot, setTldrawSnapshot] = useState<any>(null);
  
  // Video state
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Add new question
  const addQuestion = () => {
    const newQuestion: QuestionItem = {
      id: Date.now().toString(),
      type: 'mcq',
      questionText: '',
      options: [
        { key: 'A', text: '', isCorrect: false },
        { key: 'B', text: '', isCorrect: false },
      ],
      explanation: '',
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  // Duplicate question
  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...questions[index], id: Date.now().toString() };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    setQuestions(newQuestions);
  };

  // Delete question
  const deleteQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(newQuestions.length - 1);
      }
    }
  };

  // Update current question
  const updateCurrentQuestion = (updates: Partial<QuestionItem>) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      ...updates,
    };
    setQuestions(newQuestions);
  };

  // Add option to current question
  const addOption = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newKey = String.fromCharCode(65 + currentQuestion.options.length);
    updateCurrentQuestion({
      options: [
        ...currentQuestion.options,
        { key: newKey, text: '', isCorrect: false }
      ]
    });
  };

  // Update option
  const updateOption = (optionIndex: number, updates: Partial<typeof questions[0]['options'][0]>) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newOptions = [...currentQuestion.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
    updateCurrentQuestion({ options: newOptions });
  };

  // Delete option
  const deleteOption = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== optionIndex);
      updateCurrentQuestion({ options: newOptions });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Başlıksız"
                className="text-xl font-semibold border-none focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Eye className="h-5 w-5" />
                Ön İzleme
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-5 w-5" />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Type Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                İçerik Türü
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setContentType('lesson')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    contentType === 'lesson'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`h-6 w-6 ${contentType === 'lesson' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${contentType === 'lesson' ? 'text-blue-600' : 'text-gray-700'}`}>
                    Ders
                  </span>
                </button>
                <button
                  onClick={() => setContentType('question')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    contentType === 'question'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileQuestion className={`h-6 w-6 ${contentType === 'question' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${contentType === 'question' ? 'text-blue-600' : 'text-gray-700'}`}>
                    Soru
                  </span>
                </button>
                <button
                  onClick={() => setContentType('presentation')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    contentType === 'presentation'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Presentation className={`h-6 w-6 ${contentType === 'presentation' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${contentType === 'presentation' ? 'text-blue-600' : 'text-gray-700'}`}>
                    Sunum
                  </span>
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="İçerik açıklaması..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Question Format & Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Soru Formatı ve Ayarlar</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soru Tipi
                  </label>
                  <select
                    value={formatType}
                    onChange={(e) => setFormatType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mcq">Çoktan Seçmeli</option>
                    <option value="true-false">Doğru/Yanlış</option>
                    <option value="multi-select">Çoklu Seçim</option>
                    <option value="essay">Açık Uçlu</option>
                    <option value="fill-blank">Boşluk Doldurma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pedagoji Tipi (Bloom)
                  </label>
                  <select
                    value={pedagogyType}
                    onChange={(e) => setPedagogyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="knowledge">Bilgi</option>
                    <option value="comprehension">Kavrama</option>
                    <option value="application">Uygulama</option>
                    <option value="analysis">Analiz</option>
                    <option value="synthesis">Sentez</option>
                    <option value="evaluation">Değerlendirme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zorluk Seviyesi
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="very-easy">Çok Kolay</option>
                    <option value="easy">Kolay</option>
                    <option value="medium">Orta</option>
                    <option value="hard">Zor</option>
                    <option value="very-hard">Çok Zor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ağırlık (Puan)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Müfredat</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branş
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="math">Matematik</option>
                    <option value="physics">Fizik</option>
                    <option value="chemistry">Kimya</option>
                    <option value="biology">Biyoloji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={!subject}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="algebra">Cebir</option>
                    <option value="geometry">Geometri</option>
                    <option value="trigonometry">Trigonometri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kazanım
                  </label>
                  <select
                    value={learningOutcome}
                    onChange={(e) => setLearningOutcome(e.target.value)}
                    disabled={!topic}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="lo1">Denklem çözebilir</option>
                    <option value="lo2">Eşitsizlik çözebilir</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sorular ({questions.length})
                </h3>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Soru
                </button>
              </div>

              {/* Question Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                      currentQuestionIndex === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Soru {index + 1}
                  </button>
                ))}
              </div>

              {/* Current Question Content */}
              <div className="space-y-6">
                {/* İçerik Girişi Section */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">İçerik Girişi</h4>
                  
                  {/* Presentation Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sunum Şekli
                    </label>
                    <select
                      value={presentationType}
                      onChange={(e) => setPresentationType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standart</option>
                      <option value="slide">Slayt</option>
                      <option value="interactive">İnteraktif</option>
                      <option value="video">Video</option>
                      <option value="whiteboard">Beyaz Tahta</option>
                      <option value="mixed">Karma</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soru Metni *
                    </label>
                    <AdvancedRichTextEditor
                      value={currentQuestion.questionText}
                      onChange={(html) => updateCurrentQuestion({ questionText: html })}
                      placeholder="Sorunuzu yazın..."
                      height={200}
                      enableKatex
                      enableMedia
                    />
                  </div>
                </div>

                {/* Seçenekler Section */}
                {/* Seçenekler Section */}
                {(formatType === 'mcq' || formatType === 'multi-select' || formatType === 'true-false') && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Seçenekler</h4>
                      {formatType !== 'true-false' && (
                        <button
                          onClick={addOption}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Seçenek Ekle
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <input
                              type={formatType === 'multi-select' ? 'checkbox' : 'radio'}
                              checked={option.isCorrect}
                              onChange={(e) => {
                                if (formatType === 'mcq') {
                                  // Single selection - uncheck others
                                  const newOptions = currentQuestion.options.map((opt, i) => ({
                                    ...opt,
                                    isCorrect: i === optionIndex ? e.target.checked : false
                                  }));
                                  updateCurrentQuestion({ options: newOptions });
                                } else {
                                  updateOption(optionIndex, { isCorrect: e.target.checked });
                                }
                              }}
                              className="mt-3"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-300">
                                  {option.key}
                                </span>
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
                                  placeholder={`Seçenek ${option.key} metnini girin...`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {formatType !== 'true-false' && currentQuestion.options.length > 2 && (
                                  <button
                                    onClick={() => deleteOption(optionIndex)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={option.feedback || ''}
                                onChange={(e) => updateOption(optionIndex, { feedback: e.target.value })}
                                placeholder="Geri bildirim (opsiyonel) - Bu seçenek seçildiğinde öğrenciye gösterilecek mesaj"
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Açıklama/Çözüm Section */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Açıklama / Çözüm</h4>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) => updateCurrentQuestion({ explanation: e.target.value })}
                    placeholder="Sorunun açıklamasını veya çözümünü yazın... Bu metin öğrencilere gösterilecektir."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Question Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => duplicateQuestion(currentQuestionIndex)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Çoğalt
                  </button>
                  {questions.length > 1 && (
                    <button
                      onClick={() => deleteQuestion(currentQuestionIndex)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ön İzleme</h3>
              
              {/* Preview Mode Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPreviewMode('content')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    previewMode === 'content'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  İçerik
                </button>
                <button
                  onClick={() => setPreviewMode('tldraw')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    previewMode === 'tldraw'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beyaz Tahta
                </button>
                <button
                  onClick={() => setPreviewMode('video')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    previewMode === 'video'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Video
                </button>
              </div>

              {/* Preview Content */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {previewMode === 'content' && (
                  <div className="p-4 max-h-[600px] overflow-y-auto">
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Soru {currentQuestionIndex + 1}</div>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentQuestion.questionText || '<p class="text-gray-400">Soru metni girilmedi</p>' }}
                      />
                    </div>
                    
                    {currentQuestion.options.length > 0 && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 border-2 rounded-lg ${
                              option.isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{option.key}.</span>
                              <span>{option.text || 'Seçenek metni girilmedi'}</span>
                            </div>
                            {option.feedback && (
                              <div className="mt-1 text-xs text-gray-600 ml-6">
                                💡 {option.feedback}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQuestion.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs font-medium text-blue-900 mb-1">Açıklama:</div>
                        <div className="text-sm text-blue-800">{currentQuestion.explanation}</div>
                      </div>
                    )}
                  </div>
                )}

                {previewMode === 'tldraw' && (
                  <div className="p-4">
                    <Alert
                      type="info"
                      message="Beyaz tahta üzerinde çizim yaparak soru çözümü veya açıklama oluşturabilirsiniz."
                    />
                    <div className="mt-4">
                      <TldrawBoard
                        onSave={(snapshot) => {
                          setTldrawSnapshot(snapshot);
                          updateCurrentQuestion({ tldrawSnapshot: snapshot });
                        }}
                        initialData={currentQuestion.tldrawSnapshot || tldrawSnapshot}
                        height={400}
                        showToolbar={true}
                      />
                    </div>
                  </div>
                )}

                {previewMode === 'video' && (
                  <div className="p-4">
                    <Alert
                      type="info"
                      message="Soru çözümünü veya konu anlatımını video kaydı yaparak oluşturabilirsiniz."
                    />
                    <div className="mt-4">
                      <VideoRecorder
                        onRecordingComplete={(blob, url) => {
                          setVideoBlob(blob);
                          setVideoUrl(url);
                          updateCurrentQuestion({ videoUrl: url });
                        }}
                        recordingMode="camera"
                        includeAudio={true}
                        maxDuration={600}
                        height={300}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

