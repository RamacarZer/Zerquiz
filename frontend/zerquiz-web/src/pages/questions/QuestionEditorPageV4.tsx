import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Wizard from '../../components/common/Wizard';
import { Spinner } from '../../components/common/LoadingStates';
import { Save, X } from 'lucide-react';
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

// Import step components
import BasicInfoStep from '../../components/questions/BasicInfoStep';
import CurriculumStep from '../../components/questions/CurriculumStep';
import ContentEntryStepV2 from '../../components/questions/ContentEntryStepV2';
import OutputSettingsStep from '../../components/questions/OutputSettingsStep';
import PreviewStep from '../../components/questions/PreviewStep';

const WIZARD_STEPS = ['Temel Bilgiler', 'Müfredat', 'İçerik Girişi', 'Çıktı Ayarları', 'Ön İzleme'];

type ContentType = 'lesson' | 'question' | 'presentation';
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

const FALLBACK_PEDAGOGICAL_TYPES: QuestionPedagogicalType[] = [
  { id: 'general', code: 'general', name: 'Genel Sorular', bloomLevel: 1, isActive: true, displayOrder: 1 },
  { id: 'learning', code: 'learning', name: 'Öğrenme Soruları', bloomLevel: 1, isActive: true, displayOrder: 2 },
  { id: 'practice', code: 'practice', name: 'Alıştırma Soruları', bloomLevel: 2, isActive: true, displayOrder: 3 },
  { id: 'remedial', code: 'remedial', name: 'Yetiştirme Soruları', bloomLevel: 2, isActive: true, displayOrder: 4 },
  { id: 'reinforcement', code: 'reinforcement', name: 'Pekiştirme Soruları', bloomLevel: 2, isActive: true, displayOrder: 5 },
  { id: 'development', code: 'development', name: 'Geliştirme Soruları', bloomLevel: 3, isActive: true, displayOrder: 6 },
  { id: 'comprehension', code: 'comprehension', name: 'Kavrama Soruları', bloomLevel: 2, isActive: true, displayOrder: 7 },
  { id: 'outcome_measurement', code: 'outcome_measurement', name: 'Kazanım Ölçme Soruları', bloomLevel: 3, isActive: true, displayOrder: 8 },
  { id: 'lecture_based', code: 'lecture_based', name: 'Konu Anlatımlı Sorular', bloomLevel: 1, isActive: true, displayOrder: 9 },
  { id: 'knowledge', code: 'knowledge', name: 'Bilgi Soruları', bloomLevel: 1, isActive: true, displayOrder: 10 },
  { id: 'application', code: 'application', name: 'Uygulama Soruları', bloomLevel: 3, isActive: true, displayOrder: 11 },
  { id: 'analysis', code: 'analysis', name: 'Analiz Soruları', bloomLevel: 4, isActive: true, displayOrder: 12 },
  { id: 'synthesis', code: 'synthesis', name: 'Sentez Soruları', bloomLevel: 5, isActive: true, displayOrder: 13 },
  { id: 'listening', code: 'listening', name: 'Dinlemeli Sorular', bloomLevel: 2, isActive: true, displayOrder: 14 },
  { id: 'video_watching', code: 'video_watching', name: 'Video İzlemeli Sorular', bloomLevel: 2, isActive: true, displayOrder: 15 },
  { id: 'visual_examination', code: 'visual_examination', name: 'Görsel İncelemeli Sorular', bloomLevel: 3, isActive: true, displayOrder: 16 },
  { id: 'file_examination', code: 'file_examination', name: 'Dosya İncelemeli Sorular', bloomLevel: 3, isActive: true, displayOrder: 17 },
  { id: 'mind_map', code: 'mind_map', name: 'Zihin Haritası Soruları', bloomLevel: 4, isActive: true, displayOrder: 18 },
  { id: 'intuitive', code: 'intuitive', name: 'Sezgisel Sorular', bloomLevel: 4, isActive: true, displayOrder: 19 },
  { id: 'subjective', code: 'subjective', name: 'Öznel Sorular', bloomLevel: 5, isActive: true, displayOrder: 20 },
  { id: 'objective', code: 'objective', name: 'Nesnel Sorular', bloomLevel: 2, isActive: true, displayOrder: 21 },
  { id: 'open_ended', code: 'open_ended', name: 'Açık Uçlu Sorular', bloomLevel: 5, isActive: true, displayOrder: 22 },
  { id: 'written', code: 'written', name: 'Yazılı Sorular', bloomLevel: 3, isActive: true, displayOrder: 23 },
  { id: 'activity', code: 'activity', name: 'Etkinlik Soruları', bloomLevel: 3, isActive: true, displayOrder: 24 },
  { id: 'assessment', code: 'assessment', name: 'Değerlendirme Soruları', bloomLevel: 6, isActive: true, displayOrder: 25 },
  { id: 'unit_assessment', code: 'unit_assessment', name: 'Ünite Değerlendirme', bloomLevel: 6, isActive: true, displayOrder: 26 },
  { id: 'examples', code: 'examples', name: 'Örnekler', bloomLevel: 2, isActive: true, displayOrder: 27 },
  { id: 'undefined', code: 'undefined', name: 'Tanımsızlar', bloomLevel: 1, isActive: true, displayOrder: 28 },
];

interface CreateQuestionDto {
  tenantId: string;
  formatTypeId: string;
  pedagogicalTypeId?: string;
  difficultyLevelId: string;
  presentationTypeId?: string;
  presentationStyleId?: string;
  subjectId?: string;
  topicId?: string;
  learningOutcomeId?: string;
  code?: string;
  headerText?: string;
  questionText: string;
  options?: Array<{
    key: string;
    text: string;
    isCorrect: boolean;
    feedback?: string;
  }>;
  explanation?: string;
  correctAnswer?: string;
  bloomTaxonomyLevel?: string;
  estimatedTimeInSeconds?: number;
  weight?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export default function QuestionEditorPageV4() {
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

  // Form data - Step 1: Basic Info
  const [contentType, setContentType] = useState<ContentType>('question');
  const [title, setTitle] = useState('');
  const [difficultyLevelId, setDifficultyLevelId] = useState('');
  const [pedagogicalTypeId, setPedagogicalTypeId] = useState(FALLBACK_PEDAGOGICAL_TYPES[0].id);
  const [weight, setWeight] = useState(1);

  // Step 2: Curriculum
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [learningOutcomeId, setLearningOutcomeId] = useState('');

  // Step 3: Content Entry
  const [presentationTypeId, setPresentationTypeId] = useState('');
  const [questionTypeId, setQuestionTypeId] = useState(''); // Soru Tipi (65 tip - cevap türü)
  const [questionPresentationStyleId, setQuestionPresentationStyleId] = useState(''); // Soru Sunum Şekli (görsel stil)
  const [headerText, setHeaderText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { key: 'A', text: '', isCorrect: false, feedback: '' },
    { key: 'B', text: '', isCorrect: false, feedback: '' },
  ]);
  const [textAnswer, setTextAnswer] = useState('');
  const [numericAnswer, setNumericAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Step 4: Output Settings
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['question_bank']);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>(['online']);

  // Step 5: Preview
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


  const handleSave = async () => {
    if (!questionTypeId || !difficultyLevelId || !questionText.trim()) {
      alert('Soru tipi, zorluk seviyesi ve soru metni zorunludur.');
      return;
    }

    try {
      setIsSaving(true);

      const payload: CreateQuestionDto = {
        tenantId: DEFAULT_TENANT_ID,
        formatTypeId: questionTypeId, // Soru Tipi (65 tip)
        difficultyLevelId,
        presentationTypeId: presentationTypeId || undefined,
        presentationStyleId: questionPresentationStyleId || undefined, // Soru Sunum Şekli (görsel stil)
        pedagogicalTypeId,
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
        learningOutcomeId: learningOutcomeId || undefined,
        headerText: headerText || undefined,
        questionText,
        options: options.length > 0
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
          textAnswer: textAnswer || undefined,
          numericAnswer: numericAnswer || undefined,
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
        return !!difficultyLevelId;
      case 1:
        return true; // Curriculum is optional
      case 2:
        return (
          !!questionTypeId &&
          questionText.trim().length > 0
        );
      case 3:
        return selectedOutputs.length > 0 && selectedDeliveryModes.length > 0;
      case 4:
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
            <BasicInfoStep
              contentType={contentType}
              setContentType={setContentType}
              difficultyLevelId={difficultyLevelId}
              setDifficultyLevelId={setDifficultyLevelId}
              pedagogicalTypeId={pedagogicalTypeId}
              setPedagogicalTypeId={setPedagogicalTypeId}
              weight={weight}
              setWeight={setWeight}
              difficultyLevels={difficultyLevels}
              pedagogicalTypes={pedagogicalTypes}
            />
          )}

          {/* STEP 2: Müfredat */}
          {currentStep === 1 && (
            <CurriculumStep
              subjectId={subjectId}
              setSubjectId={setSubjectId}
              topicId={topicId}
              setTopicId={setTopicId}
              learningOutcomeId={learningOutcomeId}
              setLearningOutcomeId={setLearningOutcomeId}
            />
          )}

          {/* STEP 3: İçerik Girişi */}
          {currentStep === 2 && (
            <ContentEntryStepV2
              questionTypeId={questionTypeId}
              setQuestionTypeId={setQuestionTypeId}
              questionPresentationStyleId={questionPresentationStyleId}
              setQuestionPresentationStyleId={setQuestionPresentationStyleId}
              headerText={headerText}
              setHeaderText={setHeaderText}
              questionText={questionText}
              setQuestionText={setQuestionText}
              options={options}
              setOptions={setOptions}
              textAnswer={textAnswer}
              setTextAnswer={setTextAnswer}
              numericAnswer={numericAnswer}
              setNumericAnswer={setNumericAnswer}
              explanation={explanation}
              setExplanation={setExplanation}
            />
          )}

          {/* STEP 4: Çıktı Ayarları */}
          {currentStep === 3 && (
            <OutputSettingsStep
              selectedOutputs={selectedOutputs}
              setSelectedOutputs={setSelectedOutputs}
              selectedDeliveryModes={selectedDeliveryModes}
              setSelectedDeliveryModes={setSelectedDeliveryModes}
            />
          )}

          {/* STEP 5: Ön İzleme */}
          {currentStep === 4 && (
            <PreviewStep
              headerText={headerText}
              questionText={questionText}
              options={options}
              explanation={explanation}
              selectedOutputs={selectedOutputs}
              selectedDeliveryModes={selectedDeliveryModes}
              tldrawSnapshot={tldrawSnapshot}
              setTldrawSnapshot={setTldrawSnapshot}
              videoBlob={videoBlob}
              setVideoBlob={setVideoBlob}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
            />
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

