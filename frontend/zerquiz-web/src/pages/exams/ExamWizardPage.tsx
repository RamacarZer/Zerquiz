import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wizard from '../../components/common/Wizard';
import Alert from '../../components/common/Alert';
import { FileQuestion, Clock, Settings as SettingsIcon, Eye } from 'lucide-react';
import { Exam, examService } from '../../mocks/examMocks';
import { Question, questionService } from '../../mocks/questionMocks';
import { generateUUID } from '../../lib/mockStorage';

const WIZARD_STEPS = ['Genel Bilgiler', 'Soru Seçimi', 'Ayarlar', 'Önizleme'];

export const ExamWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Exam>>({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 0,
    totalPoints: 100,
    passingScore: 50,
    examType: 'online',
    status: 'draft',
    shuffleQuestions: true,
    shuffleOptions: true,
    allowReview: true,
    showResults: true,
    bookletCount: 2,
  });

  React.useEffect(() => {
    if (currentStep === 1) {
      loadQuestions();
    }
  }, [currentStep]);

  const loadQuestions = async () => {
    const data = await questionService.getAll();
    setQuestions(data.filter((q) => q.status === 'published'));
  };

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleNext = () => {
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

      const newExam: Omit<Exam, 'createdAt' | 'updatedAt'> = {
        id: generateUUID(),
        title: formData.title || 'Yeni Sınav',
        description: formData.description,
        duration: formData.duration || 60,
        totalQuestions: selectedQuestions.length,
        totalPoints: formData.totalPoints || 100,
        passingScore: formData.passingScore || 50,
        examType: formData.examType || 'online',
        status: 'draft',
        shuffleQuestions: formData.shuffleQuestions || false,
        shuffleOptions: formData.shuffleOptions || false,
        allowReview: formData.allowReview || false,
        showResults: formData.showResults || false,
        bookletCount: formData.bookletCount || 1,
      };

      await examService.create(newExam);
      alert('Sınav başarıyla oluşturuldu!');
      navigate('/exams');
    } catch (error) {
      alert('Sınav oluşturulamadı!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (confirm('Değişiklikler kaydedilmeyecek. Çıkmak istediğinizden emin misiniz?')) {
      navigate('/exams');
    }
  };

  return (
    <Wizard
      steps={WIZARD_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onFinish={handleFinish}
      onClose={handleClose}
      title="Yeni Sınav Oluştur"
      isLoading={isSaving}
    >
      {/* Step 1: General Info */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sınav Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: Matematik Ara Sınav"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Sınav hakkında açıklama..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Süre (dakika)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sınav Tipi</label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="online">Online</option>
                <option value="offline">Kağıt (Offline)</option>
                <option value="hybrid">Hibrit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toplam Puan</label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geçme Puanı</label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max={formData.totalPoints}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Question Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Sınava Eklenecek Soruları Seçin
            </h3>
            <span className="text-sm text-gray-600">
              {selectedQuestions.length} soru seçildi
            </span>
          </div>

          {questions.length === 0 ? (
            <Alert type="warning" message="Henüz yayınlanmış soru bulunmuyor. Önce soru oluşturun." />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => toggleQuestion(question.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedQuestions.includes(question.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestion(question.id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div
                        className="text-gray-900 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: question.content.stem.html || question.content.stem.text,
                        }}
                      />
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>ID: {question.id.slice(0, 8)}</span>
                        <span>Versiyon: {question.version}</span>
                        {question.metadata.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {question.metadata.estimatedTime}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Settings */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Sınav Ayarları
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={formData.shuffleQuestions}
                  onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">Soruları Karıştır</div>
                  <div className="text-sm text-gray-600">Her öğrenci farklı sırada sorular görsün</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">Şıkları Karıştır</div>
                  <div className="text-sm text-gray-600">A, B, C, D şıklarının sırası değişsin</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={formData.allowReview}
                  onChange={(e) => setFormData({ ...formData, allowReview: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">Sınav Sonrası İnceleme</div>
                  <div className="text-sm text-gray-600">Öğrenciler cevaplarını inceleyebilsin</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={formData.showResults}
                  onChange={(e) => setFormData({ ...formData, showResults: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">Anında Sonuç Göster</div>
                  <div className="text-sm text-gray-600">Sınav bitince puanı göster</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kitapçık Sayısı</label>
            <select
              value={formData.bookletCount}
              onChange={(e) => setFormData({ ...formData, bookletCount: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Kitapçık (A)</option>
              <option value={2}>2 Kitapçık (A, B)</option>
              <option value={4}>4 Kitapçık (A, B, C, D)</option>
              <option value={8}>8 Kitapçık</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Sınav Özeti
            </h3>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h4>
                {formData.description && (
                  <p className="text-gray-600">{formData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Süre</div>
                    <div className="font-semibold">{formData.duration} dakika</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Soru Sayısı</div>
                    <div className="font-semibold">{selectedQuestions.length} soru</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Toplam Puan</div>
                  <div className="font-semibold">{formData.totalPoints}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Geçme Puanı</div>
                  <div className="font-semibold">{formData.passingScore}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Sınav Tipi</div>
                  <div className="font-semibold capitalize">{formData.examType}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Kitapçık Sayısı</div>
                  <div className="font-semibold">{formData.bookletCount}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Aktif Ayarlar:</div>
                <div className="flex flex-wrap gap-2">
                  {formData.shuffleQuestions && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      ✓ Sorular Karışık
                    </span>
                  )}
                  {formData.shuffleOptions && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      ✓ Şıklar Karışık
                    </span>
                  )}
                  {formData.allowReview && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      ✓ İnceleme İzni
                    </span>
                  )}
                  {formData.showResults && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      ✓ Anında Sonuç
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Alert
            type="success"
            title="Hazır!"
            message="Sınavınız tamamlandı. 'Tamamla' butonuna tıklayarak kaydedebilirsiniz."
          />
        </div>
      )}
    </Wizard>
  );
};

export default ExamWizardPage;

