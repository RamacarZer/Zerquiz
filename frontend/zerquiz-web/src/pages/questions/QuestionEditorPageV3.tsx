import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Wizard from '../../components/common/Wizard';
import AdvancedRichTextEditor from '../../components/common/AdvancedRichTextEditor';
import EnhancedWhiteboard from '../../components/common/EnhancedWhiteboard';
import Alert from '../../components/common/Alert';
import { Spinner } from '../../components/common/LoadingStates';
import { 
  Save, 
  Eye, 
  X,
  CheckCircle,
  BookOpen,
  FileQuestion,
  Presentation,
  Trash2
} from 'lucide-react';
import {
  realQuestionService,
  QuestionFormatType,
  QuestionPedagogicalType,
  QuestionDifficultyLevel,
  QuestionPresentationType,
} from '../../services/api/realQuestionService';
import {
  questionFormatTypeService,
  questionDifficultyLevelService,
  questionPresentationTypeService,
} from '../../mocks/questionMocks';

const WIZARD_STEPS = ['Temel Bilgiler', 'Müfredat', 'İçerik Girişi', 'Ön İzleme'];

type ContentType = 'lesson' | 'question' | 'presentation';
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

const FALLBACK_PEDAGOGICAL_TYPES: QuestionPedagogicalType[] = [
  {
    id: 'knowledge',
    code: 'knowledge',
    name: 'Bilgi',
    description: 'Bilgi düzeyi',
    bloomLevel: 1,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'comprehension',
    code: 'comprehension',
    name: 'Kavrama',
    description: 'Kavrama düzeyi',
    bloomLevel: 2,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'application',
    code: 'application',
    name: 'Uygulama',
    description: 'Uygulama düzeyi',
    bloomLevel: 3,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'analysis',
    code: 'analysis',
    name: 'Analiz',
    description: 'Analiz düzeyi',
    bloomLevel: 4,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'synthesis',
    code: 'synthesis',
    name: 'Sentez',
    description: 'Sentez düzeyi',
    bloomLevel: 5,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'evaluation',
    code: 'evaluation',
    name: 'Değerlendirme',
    description: 'Değerlendirme düzeyi',
    bloomLevel: 6,
    isActive: true,
    displayOrder: 6,
  },
];

const OUTPUT_CHANNELS = [
  { id: 'book', label: 'Kitap' },
  { id: 'mock_exam', label: 'Deneme' },
  { id: 'question_bank', label: 'Soru Bankası' },
  { id: 'presentation', label: 'Sunum' },
  { id: 'exam', label: 'Sınav' },
];

const DELIVERY_MODES = [
  { id: 'online', label: 'Online' },
  { id: 'offline', label: 'Offline' },
  { id: 'hybrid', label: 'Hibrit' },
];

export default function QuestionEditorPageV3() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data sources from DB/API
  const [formatTypes, setFormatTypes] = useState<QuestionFormatType[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<QuestionDifficultyLevel[]>([]);
  const [presentationTypes, setPresentationTypes] = useState<QuestionPresentationType[]>([]);
  const [pedagogicalTypes, setPedagogicalTypes] = useState<QuestionPedagogicalType[]>(FALLBACK_PEDAGOGICAL_TYPES);

  // Form data
  const [contentType, setContentType] = useState<ContentType>('question');
  const [title, setTitle] = useState('');
  
  // Soru metadata
  const [formatTypeId, setFormatTypeId] = useState(''); // Soru Tipi (Çoktan seçmeli, vb.)
  const [presentationTypeId, setPresentationTypeId] = useState(''); // İçerik Sunum Şekli (Standart, Slayt, vb.)
  const [pedagogicalTypeId, setPedagogicalTypeId] = useState(FALLBACK_PEDAGOGICAL_TYPES[0].id);
  const [difficultyLevelId, setDifficultyLevelId] = useState('');
  const [weight, setWeight] = useState(1);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['question_bank']);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>(['online']);

  // Curriculum
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [learningOutcomeId, setLearningOutcomeId] = useState('');

  // Content
  const [headerText, setHeaderText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { key: 'A', text: '', isCorrect: false, feedback: '' },
    { key: 'B', text: '', isCorrect: false, feedback: '' },
  ]);
  const [explanation, setExplanation] = useState('');

  // Preview
  const [previewMode, setPreviewMode] = useState<'content' | 'whiteboard'>('content');
  const [tldrawSnapshot, setTldrawSnapshot] = useState<any>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [formats, difficulties, presentations, pedagogies] = await Promise.all([
        realQuestionService.getFormatTypes(),
        realQuestionService.getDifficultyLevels(),
        realQuestionService.getPresentationTypes(),
        realQuestionService.getPedagogicalTypes(),
      ]);

      const resolvedFormats =
        formats && formats.length > 0 ? formats : await questionFormatTypeService.getAll();
      const resolvedDifficulties =
        difficulties && difficulties.length > 0
          ? difficulties
          : await questionDifficultyLevelService.getAll();
      const resolvedPresentations =
        presentations && presentations.length > 0
          ? presentations
          : await questionPresentationTypeService.getAll();
      const resolvedPedagogies =
        pedagogies && pedagogies.length > 0 ? pedagogies : FALLBACK_PEDAGOGICAL_TYPES;

      setFormatTypes(resolvedFormats);
      setDifficultyLevels(resolvedDifficulties);
      setPresentationTypes(resolvedPresentations);
      setPedagogicalTypes(resolvedPedagogies);

      if (resolvedFormats.length > 0) setFormatTypeId(resolvedFormats[0].id);
      if (resolvedDifficulties.length > 0)
        setDifficultyLevelId(resolvedDifficulties[2]?.id || resolvedDifficulties[0].id);
      if (resolvedPresentations.length > 0) setPresentationTypeId(resolvedPresentations[0].id);
      if (resolvedPedagogies.length > 0) setPedagogicalTypeId(resolvedPedagogies[0].id);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFormat = formatTypes.find(f => f.id === formatTypeId);
  const selectedPresentation = presentationTypes.find(p => p.id === presentationTypeId);
  const formatAllowsMultiple =
    selectedFormat?.allowsMultipleCorrect ??
    (selectedFormat as Partial<QuestionFormatType> & { supportsMultipleAnswers?: boolean })
      ?.supportsMultipleAnswers ??
    false;

  const addOption = () => {
    const newKey = String.fromCharCode(65 + options.length);
    setOptions([...options, { key: newKey, text: '', isCorrect: false, feedback: '' }]);
  };

  const updateOption = (index: number, updates: Partial<typeof options[0]>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    setOptions(newOptions);
  };

  const deleteOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const toggleSelection = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      if (list.length === 1) return;
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleOutputToggle = (value: string) => {
    toggleSelection(value, selectedOutputs, setSelectedOutputs);
  };

  const handleDeliveryToggle = (value: string) => {
    toggleSelection(value, selectedDeliveryModes, setSelectedDeliveryModes);
  };

  const getOutputLabel = (value: string) =>
    OUTPUT_CHANNELS.find((channel) => channel.id === value)?.label || value;

  const getDeliveryLabel = (value: string) =>
    DELIVERY_MODES.find((mode) => mode.id === value)?.label || value;

  const handleSave = async () => {
    if (!formatTypeId || !difficultyLevelId || !questionText.trim()) {
      alert('Soru tipi, zorluk seviyesi ve soru metni zorunludur.');
      return;
    }

    if (selectedFormat?.requiresOptions) {
      if (!options.length) {
        alert('Bu soru tipi için en az iki seçenek eklemelisiniz.');
        return;
      }
      if (!options.some((option) => option.isCorrect)) {
        alert('En az bir seçeneği doğru olarak işaretleyin.');
        return;
      }
    }

    try {
      setIsSaving(true);

      const payload: CreateQuestionDto = {
        tenantId: DEFAULT_TENANT_ID,
        formatTypeId,
        difficultyLevelId,
        presentationTypeId: presentationTypeId || undefined,
        pedagogicalTypeId,
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
        learningOutcomeId: learningOutcomeId || undefined,
        headerText: headerText || undefined,
        questionText,
        options: selectedFormat?.requiresOptions
          ? options.map((option) => ({
              key: option.key,
              text: option.text,
              isCorrect: option.isCorrect,
              feedback: option.feedback || undefined,
            }))
          : undefined,
        explanation: explanation || undefined,
        weight,
        metadata: {
          contentType,
          distributionChannels: selectedOutputs,
          deliveryModes: selectedDeliveryModes,
          hasWhiteboardRecording: Boolean(tldrawSnapshot),
          videoUrl: videoUrl || undefined,
        },
      };

      if (id) {
        await realQuestionService.updateQuestion(id, payload);
      } else {
        await realQuestionService.createQuestion(payload);
      }

      alert('Soru başarıyla kaydedildi.');
      navigate('/questions');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Soru kaydedilirken bir hata oluştu. API servisinin çalıştığından emin olun.');
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!formatTypeId && !!difficultyLevelId;
      case 1:
        return true;
      case 2:
        return (
          questionText.trim().length > 0 &&
          selectedOutputs.length > 0 &&
          selectedDeliveryModes.length > 0 &&
          (selectedFormat?.requiresOptions ? options.some(o => o.isCorrect) : true)
        );
      case 3:
        return true;
      default:
        return true;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/questions')} className="text-gray-600 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Soru Başlığı"
                className="text-lg font-semibold border-none focus:ring-0 focus:outline-none w-96"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Wizard
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          showFooter={false}
          showStepIndicator={true}
          variant="inline"
        >
          
          {/* STEP 1: Temel Bilgiler */}
          {currentStep === 0 && (
            <div className="space-y-4">
              {/* İçerik Türü - Inline */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-28">İçerik Türü:</span>
                <div className="flex gap-2">
                  {[
                    { type: 'lesson', icon: BookOpen, label: 'Ders' },
                    { type: 'question', icon: FileQuestion, label: 'Soru' },
                    { type: 'presentation', icon: Presentation, label: 'Sunum' }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type as ContentType)}
                      className={`px-3 py-1.5 border-2 rounded-lg flex items-center gap-1.5 transition text-sm ${
                        contentType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Soru Format ve Ayarları - Grid 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Soru Tipi (Format) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Soru Tipi * <span className="text-xs text-gray-500">(Format)</span>
                  </label>
                  <select
                    value={formatTypeId}
                    onChange={(e) => setFormatTypeId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {formatTypes.map(format => (
                      <option key={format.id} value={format.id}>{format.name}</option>
                    ))}
                  </select>
                </div>

                {/* Zorluk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Zorluk Seviyesi *
                  </label>
                  <select
                    value={difficultyLevelId}
                    onChange={(e) => setDifficultyLevelId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                {/* Pedagojik Tip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pedagojik Tip
                  </label>
                  <select
                    value={pedagogicalTypeId}
                    onChange={(e) => setPedagogicalTypeId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {pedagogicalTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ağırlık Katsayısı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ağırlık Katsayısı
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Müfredat */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Alert type="info" message="Soruyu müfredata bağlayabilirsiniz. Bu adım opsiyoneldir." />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Branş</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="math">Matematik</option>
                    <option value="physics">Fizik</option>
                    <option value="chemistry">Kimya</option>
                    <option value="biology">Biyoloji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konu</label>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    disabled={!subjectId}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="algebra">Cebir</option>
                    <option value="geometry">Geometri</option>
                    <option value="trigonometry">Trigonometri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kazanım</label>
                  <select
                    value={learningOutcomeId}
                    onChange={(e) => setLearningOutcomeId(e.target.value)}
                    disabled={!topicId}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="lo1">Denklem çözebilir</option>
                    <option value="lo2">Eşitsizlik çözebilir</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: İçerik Girişi */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* İçerik Sunum Şekli - Inline */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-32">Sunum Şekli:</span>
                <select
                  value={presentationTypeId}
                  onChange={(e) => setPresentationTypeId(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {presentationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Üst Bilgi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Üst Bilgi <span className="text-xs text-gray-500">(Birden çok soru ile paylaşılabilir)</span>
                </label>
                <textarea
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="Ortak üst bilgi metni..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Soru Gövdesi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Soru Gövdesi *
                </label>
                <AdvancedRichTextEditor
                  value={questionText}
                  onChange={setQuestionText}
                  placeholder="Sorunuzu yazın..."
                  height={200}
                  enableKatex
                  enableMedia
                />
              </div>

              {/* Çıktı Türleri ve Teslim Şekli */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Çıktı Türleri</h4>
                    <p className="text-xs text-gray-500">
                      Kitap, deneme, soru bankası, sunum veya sınav oluşturun
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {OUTPUT_CHANNELS.map((channel) => (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => handleOutputToggle(channel.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedOutputs.includes(channel.id)
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'border-gray-300 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {channel.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Teslim Şekli</h4>
                    <p className="text-xs text-gray-500">Online, offline veya hibrit dağıtım</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleDeliveryToggle(mode.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedDeliveryModes.includes(mode.id)
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : 'border-gray-300 text-gray-600 hover:border-emerald-300'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Şıklar */}
              {selectedFormat?.requiresOptions && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Şıklar *</label>
                    <button
                      onClick={addOption}
                      disabled={selectedFormat.maxOptions !== undefined && options.length >= selectedFormat.maxOptions}
                      className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      + Şık Ekle
                    </button>
                  </div>

                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <input
                          type={formatAllowsMultiple ? 'checkbox' : 'radio'}
                          checked={option.isCorrect}
                          onChange={(e) => {
                            if (!formatAllowsMultiple) {
                              const newOptions = options.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === index ? e.target.checked : false
                              }));
                              setOptions(newOptions);
                            } else {
                              updateOption(index, { isCorrect: e.target.checked });
                            }
                          }}
                          className="mt-2"
                        />
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border">
                              {option.key}
                            </span>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(index, { text: e.target.value })}
                              placeholder={`Şık ${option.key}`}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {options.length > (selectedFormat.minOptions || 2) && (
                              <button
                                onClick={() => deleteOption(index)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={option.feedback || ''}
                            onChange={(e) => updateOption(index, { feedback: e.target.value })}
                            placeholder="Geri bildirim (opsiyonel)"
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Açıklama / Çözüm
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Sorunun açıklamasını veya çözümünü yazın..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Ön İzleme */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Preview Mode Tabs */}
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setPreviewMode('content')}
                  className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
                    previewMode === 'content'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="inline h-4 w-4 mr-1.5" />
                  Soru Ön İzleme
                </button>
                <button
                  onClick={() => setPreviewMode('whiteboard')}
                  className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
                    previewMode === 'whiteboard'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🎨 Beyaz Tahta + Video Kayıt
                </button>
              </div>

              {/* Preview Content */}
              {previewMode === 'content' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {headerText && (
                    <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-900">
                      {headerText}
                    </div>
                  )}

                  <div className="mb-4">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: questionText || '<p class="text-gray-400">Soru metni girilmedi</p>' }}
                    />
                  </div>

                  {selectedFormat?.requiresOptions && options.length > 0 && (
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 border-2 rounded-lg transition ${
                            option.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-700">{option.key}.</span>
                            <span className={`text-sm ${option.isCorrect ? 'font-medium text-green-900' : ''}`}>
                              {option.text || 'Şık metni girilmedi'}
                            </span>
                            {option.isCorrect && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                          </div>
                          {option.feedback && (
                            <div className="mt-1 ml-6 text-xs text-gray-600">💡 {option.feedback}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {explanation && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="text-xs font-medium text-purple-900 mb-1">Açıklama / Çözüm:</div>
                      <div className="text-sm text-purple-800">{explanation}</div>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Çıktı Türleri</p>
                      <p>{selectedOutputs.map((id) => getOutputLabel(id)).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Teslim Şekli</p>
                      <p>{selectedDeliveryModes.map((id) => getDeliveryLabel(id)).join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {previewMode === 'whiteboard' && (
                <div>
                  <Alert
                    type="info"
                    message="Soru içeriği arka planda gösterilir. Üzerine çizim yaparak çözüm oluşturun. İstenirse video kaydı alınabilir."
                  />
                  <div className="mt-3">
                    <EnhancedWhiteboard
                      questionContent={
                        questionText 
                          ? `${headerText ? `<div class="mb-2 text-sm text-blue-600 font-medium">${headerText}</div>` : ''}${questionText}${
                              selectedFormat?.requiresOptions && options.length > 0 
                                ? `<div class="mt-3 space-y-2">${options.map(opt => 
                                    `<div class="text-sm"><strong>${opt.key}.</strong> ${opt.text}</div>`
                                  ).join('')}</div>`
                                : ''
                            }` 
                          : undefined
                      }
                      onSave={(snapshot, videoBlob) => {
                        setTldrawSnapshot(snapshot);
                        if (videoBlob) {
                          setVideoBlob(videoBlob);
                          setVideoUrl(URL.createObjectURL(videoBlob));
                        }
                      }}
                      initialData={tldrawSnapshot}
                      height={550}
                      showToolbar={true}
                      enableVideo={true}
                    />
                    <div className="mt-2 text-xs text-gray-600">
                      💡 <strong>9 Pozisyon:</strong> "Konum" butonuyla soruyu taşıyın | 
                      <strong> Video:</strong> "Kayıt Başlat" ile çizimlerinizi kaydedin
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wizard Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Geri
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/questions')}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>

              {currentStep < WIZARD_STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed(currentStep)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Sonraki
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isSaving || !canProceed(currentStep)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? 'Kaydediliyor...' : 'Tamamla ve Kaydet'}
                </button>
              )}
            </div>
          </div>
        </Wizard>
      </div>
    </div>
  );
}

