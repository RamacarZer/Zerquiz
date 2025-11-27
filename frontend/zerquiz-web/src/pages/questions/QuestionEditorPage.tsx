import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wizard from '../../components/common/Wizard';
import AdvancedRichTextEditor from '../../components/common/AdvancedRichTextEditor';
import Alert from '../../components/common/Alert';
import { EmptyState, Spinner } from '../../components/common/LoadingStates';
import FileUploader, { UploadedFile } from '../../components/common/FileUploader';
import TldrawBoard from '../../components/common/TldrawBoard';
import VideoRecorder from '../../components/common/VideoRecorder';
import { FileQuestion, CheckCircle, Eye, Save, Pencil, Video as VideoIcon } from 'lucide-react';
import {
  questionService,
  questionFormatTypeService,
  questionDifficultyLevelService,
  questionPresentationTypeService,
  Question,
  QuestionFormatType,
  QuestionDifficultyLevel,
  QuestionPresentationType,
} from '../../mocks/questionMocks';
import { generateUUID } from '../../lib/mockStorage';

const WIZARD_STEPS = ['Format Seç', 'Müfredat', 'İçerik Gir', 'Seçenekler', 'Önizleme'];

export const QuestionEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data sources
  const [formatTypes, setFormatTypes] = useState<QuestionFormatType[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<QuestionDifficultyLevel[]>([]);
  const [presentationTypes, setPresentationTypes] = useState<QuestionPresentationType[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    formatTypeId: '',
    presentationTypeId: '',
    difficultyLevelId: '',
    subjectId: '',
    topicId: '',
    learningOutcomeId: '',
    content: {
      stem: { text: '', latex: '', html: '' },
      options: [] as Array<{ key: string; text: string; latex?: string; html?: string; isCorrect?: boolean }>,
      correctAnswers: [] as string[],
      explanation: '',
    },
    metadata: {
      bloomTaxonomy: '',
      estimatedTime: 60,
      tags: [] as string[],
    },
    status: 'draft' as 'draft' | 'review' | 'published' | 'archived',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showTldraw, setShowTldraw] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
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
      const [formats, difficulties, presentations] = await Promise.all([
        questionFormatTypeService.getAll(),
        questionDifficultyLevelService.getAll(),
        questionPresentationTypeService.getAll(),
      ]);

      setFormatTypes(formats);
      setDifficultyLevels(difficulties);
      setPresentationTypes(presentations);

      // Set defaults
      if (formats.length > 0) {
        setFormData((prev) => ({ ...prev, formatTypeId: formats[0].id }));
      }
      if (difficulties.length > 0) {
        setFormData((prev) => ({ ...prev, difficultyLevelId: difficulties[2].id })); // medium
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFormat = formatTypes.find((f) => f.id === formData.formatTypeId);

  // Initialize options when format changes
  useEffect(() => {
    if (selectedFormat && selectedFormat.requiresOptions) {
      const defaultCount = selectedFormat.minOptions || 4;
      const options = Array.from({ length: defaultCount }, (_, i) => ({
        key: String.fromCharCode(65 + i), // A, B, C, D...
        text: '',
        isCorrect: false,
      }));
      setFormData((prev) => ({ ...prev, content: { ...prev.content, options } }));
    }
  }, [selectedFormat]);

  const handleNext = async () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      setIsSaving(true);

      const newQuestion: Omit<Question, 'createdAt' | 'updatedAt'> = {
        id: generateUUID(),
        formatTypeId: formData.formatTypeId,
        presentationTypeId: formData.presentationTypeId || undefined,
        difficultyLevelId: formData.difficultyLevelId || undefined,
        subjectId: formData.subjectId || undefined,
        topicId: formData.topicId || undefined,
        learningOutcomeId: formData.learningOutcomeId || undefined,
        content: formData.content,
        metadata: formData.metadata,
        status: formData.status,
        version: 1,
      };

      await questionService.create(newQuestion);

      alert('Soru başarıyla kaydedildi!');
      navigate('/questions');
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Soru kaydedilemedi!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (confirm('Değişiklikler kaydedilmeyecek. Çıkmak istediğinizden emin misiniz?')) {
      navigate('/questions');
    }
  };

  const handleFilesAdded = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: generateUUID(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 100,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileRemove = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Wizard
      steps={WIZARD_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onFinish={handleFinish}
      onClose={handleClose}
      title="Yeni Soru Oluştur"
      isLoading={isSaving}
      finishButtonText="Kaydet ve Bitir"
    >
      {/* Step 1: Format Selection */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Soru Formatını Seçin</h3>
            <div className="grid grid-cols-2 gap-4">
              {formatTypes.map((format) => (
                <div
                  key={format.id}
                  onClick={() => setFormData({ ...formData, formatTypeId: format.id })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition hover:shadow-lg ${
                    formData.formatTypeId === format.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.formatTypeId === format.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <FileQuestion
                        className={`w-6 h-6 ${formData.formatTypeId === format.id ? 'text-white' : 'text-gray-600'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{format.name}</h4>
                      <p className="text-sm text-gray-600">{format.description}</p>
                      {format.requiresOptions && (
                        <p className="text-xs text-gray-500 mt-2">
                          Seçenekler: {format.minOptions} - {format.maxOptions}
                        </p>
                      )}
                    </div>
                    {formData.formatTypeId === format.id && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zorluk Seviyesi</h3>
            <div className="flex gap-3">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficultyLevelId: level.id })}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                    formData.difficultyLevelId === level.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{level.name}</div>
                  {level.description && (
                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Curriculum */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Alert
            type="info"
            message="Bu adımda soruyu müfredata bağlayabilirsiniz. Bu adım opsiyoneldir, daha sonra da ekleyebilirsiniz."
          />

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branş</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçiniz...</option>
                <option value="math">Matematik</option>
                <option value="physics">Fizik</option>
                <option value="chemistry">Kimya</option>
                <option value="biology">Biyoloji</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
              <select
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                disabled={!formData.subjectId}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Seçiniz...</option>
                <option value="algebra">Cebir</option>
                <option value="geometry">Geometri</option>
                <option value="trigonometry">Trigonometri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kazanım</label>
              <select
                value={formData.learningOutcomeId}
                onChange={(e) => setFormData({ ...formData, learningOutcomeId: e.target.value })}
                disabled={!formData.topicId}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Seçiniz...</option>
                <option value="lo1">Denklem çözebilir</option>
                <option value="lo2">Eşitsizlik çözebilir</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Content */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Tab Selection */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowTldraw(false);
                setShowVideoRecorder(false);
              }}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                !showTldraw && !showVideoRecorder
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Metin Editörü
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTldraw(true);
                setShowVideoRecorder(false);
              }}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                showTldraw
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Pencil className="inline h-4 w-4 mr-1" />
              Beyaz Tahta
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTldraw(false);
                setShowVideoRecorder(true);
              }}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                showVideoRecorder
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <VideoIcon className="inline h-4 w-4 mr-1" />
              Video Kayıt
            </button>
          </div>

          {/* Content Area */}
          {!showTldraw && !showVideoRecorder && (
            <>
              <div>
                <AdvancedRichTextEditor
                  value={formData.content.stem.html || formData.content.stem.text}
                  onChange={(html) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, stem: { ...formData.content.stem, html, text: html } },
                    })
                  }
                  label="Soru Metni"
                  required
                  height={300}
                  enableKatex
                  enableMedia
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medya Ekle</label>
                <FileUploader
                  onFilesAdded={handleFilesAdded}
                  onFileRemove={handleFileRemove}
                  uploadedFiles={uploadedFiles}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'], 'video/*': ['.mp4', '.webm'] }}
                  maxSize={20 * 1024 * 1024}
                  maxFiles={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={formData.content.explanation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, explanation: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Sorunun çözümünü veya açıklamasını buraya yazabilirsiniz..."
                />
              </div>
            </>
          )}

          {showTldraw && (
            <div>
              <Alert
                type="info"
                message="Beyaz tahta üzerinde çizim yaparak soru çözümü veya açıklama oluşturabilirsiniz. Çizimleriniz otomatik olarak kaydedilecektir."
              />
              <div className="mt-4">
                <TldrawBoard
                  onSave={(snapshot) => setTldrawSnapshot(snapshot)}
                  initialData={tldrawSnapshot}
                  height={500}
                  showToolbar
                />
              </div>
            </div>
          )}

          {showVideoRecorder && (
            <div>
              <Alert
                type="info"
                message="Soru çözümünü veya konu anlatımını video kaydı yaparak oluşturabilirsiniz. Hem ekran hem de kamera kaydı yapabilirsiniz."
              />
              <div className="mt-4">
                <VideoRecorder
                  onRecordingComplete={(blob, url) => {
                    setVideoBlob(blob);
                    setVideoUrl(url);
                  }}
                  recordingMode="camera"
                  includeAudio
                  maxDuration={600}
                  height={500}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Options */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {selectedFormat?.requiresOptions ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Seçenekler</h3>
                <button
                  type="button"
                  onClick={() => {
                    const newKey = String.fromCharCode(65 + formData.content.options.length);
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        options: [...formData.content.options, { key: newKey, text: '', isCorrect: false }],
                      },
                    });
                  }}
                  disabled={
                    selectedFormat.maxOptions !== undefined &&
                    formData.content.options.length >= selectedFormat.maxOptions
                  }
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  + Seçenek Ekle
                </button>
              </div>

              <div className="space-y-4">
                {formData.content.options.map((option, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {option.key}
                      </div>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = [...formData.content.options];
                          newOptions[index].isCorrect = e.target.checked;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, options: newOptions },
                          });
                        }}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                    </div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...formData.content.options];
                        newOptions[index].text = e.target.value;
                        setFormData({
                          ...formData,
                          content: { ...formData.content, options: newOptions },
                        });
                      }}
                      placeholder={`Seçenek ${option.key}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.content.options.length > (selectedFormat.minOptions || 2) && (
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = formData.content.options.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            content: { ...formData.content, options: newOptions },
                          });
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Alert
                type="info"
                message="Doğru seçeneği işaretlemek için checkbox'ı kullanın."
              />
            </>
          ) : (
            <EmptyState
              icon={<CheckCircle className="w-16 h-16" />}
              title="Seçenek Gerektirmez"
              description="Bu soru formatı seçenek gerektirmez. Sonraki adıma geçebilirsiniz."
            />
          )}
        </div>
      )}

      {/* Step 5: Preview */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Soru Önizlemesi
            </h3>

            {/* Question Content */}
            <div className="bg-white rounded-lg p-6 mb-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content.stem.html || formData.content.stem.text }}
              />

              {/* Options */}
              {formData.content.options.length > 0 && (
                <div className="mt-6 space-y-3">
                  {formData.content.options.map((option) => (
                    <div
                      key={option.key}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                        option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          option.isCorrect ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {option.key}
                      </div>
                      <span className="flex-1">{option.text}</span>
                      {option.isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              {formData.content.explanation && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Açıklama:</h4>
                  <p className="text-gray-700">{formData.content.explanation}</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-semibold">
                  {formatTypes.find((f) => f.id === formData.formatTypeId)?.name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Zorluk:</span>
                <span className="ml-2 font-semibold">
                  {difficultyLevels.find((d) => d.id === formData.difficultyLevelId)?.name}
                </span>
              </div>
              {formData.subjectId && (
                <div>
                  <span className="text-gray-600">Branş:</span>
                  <span className="ml-2 font-semibold">{formData.subjectId}</span>
                </div>
              )}
              {formData.topicId && (
                <div>
                  <span className="text-gray-600">Konu:</span>
                  <span className="ml-2 font-semibold">{formData.topicId}</span>
                </div>
              )}
            </div>
          </div>

          <Alert
            type="success"
            title="Hazır!"
            message="Sorunuz tamamlandı. 'Kaydet ve Bitir' butonuna tıklayarak kaydedebilirsiniz."
          />
        </div>
      )}
    </Wizard>
  );
};

export default QuestionEditorPage;

