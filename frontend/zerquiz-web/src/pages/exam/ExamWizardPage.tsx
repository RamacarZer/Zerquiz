import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ExamWizardSteps, ExamBasicInfo, QuestionSelector } from './components';

interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
}

export default function ExamWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalPoints: 100,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    console.log('Creating exam:', { examData, questions });
    alert('Sınav oluşturuldu!');
  };

  const handleAddQuestion = () => {
    // Mock question - In production, open question selector modal
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: 'Yeni soru metni buraya gelecek...',
      type: 'multiple-choice',
      points: 5,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const isStep1Valid = examData.title.trim() && examData.duration > 0 && examData.totalPoints > 0;
  const isStep2Valid = questions.length > 0;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sınav Oluştur</h1>
      <p className="text-gray-600 mb-8">Adım adım yeni sınav oluşturun</p>

      <ExamWizardSteps currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <ExamBasicInfo
            title={examData.title}
            description={examData.description}
            duration={examData.duration}
            totalPoints={examData.totalPoints}
            onTitleChange={(title) => setExamData({ ...examData, title })}
            onDescriptionChange={(description) => setExamData({ ...examData, description })}
            onDurationChange={(duration) => setExamData({ ...examData, duration })}
            onTotalPointsChange={(totalPoints) => setExamData({ ...examData, totalPoints })}
          />
        )}

        {currentStep === 2 && (
          <QuestionSelector
            selectedQuestions={questions}
            onAddQuestion={handleAddQuestion}
            onRemoveQuestion={handleRemoveQuestion}
          />
        )}

        {currentStep === 3 && (
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Sınav Ayarları</h2>
              <div className="space-y-4">
                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary" />
                  <div>
                    <span className="label-text font-semibold">Karışık Sorular</span>
                    <p className="text-xs text-gray-500">Her öğrenci için farklı sırada göster</p>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary" />
                  <div>
                    <span className="label-text font-semibold">Geri Dönüşe İzin Ver</span>
                    <p className="text-xs text-gray-500">Önceki sorulara geri dönülebilir</p>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                  <div>
                    <span className="label-text font-semibold">Otomatik Kaydet</span>
                    <p className="text-xs text-gray-500">Cevaplar otomatik kaydedilir</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Sınav Özeti</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Başlık:</span> {examData.title}
                </div>
                <div>
                  <span className="font-semibold">Süre:</span> {examData.duration} dakika
                </div>
                <div>
                  <span className="font-semibold">Toplam Puan:</span> {examData.totalPoints}
                </div>
                <div>
                  <span className="font-semibold">Soru Sayısı:</span> {questions.length}
                </div>
              </div>

              <div className="alert alert-info mt-6">
                <span>
                  Sınavı oluşturduktan sonra öğrencilerle paylaşabilir veya programa
                  atayabilirsiniz.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn btn-outline gap-2"
        >
          <ArrowLeft size={18} />
          Geri
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)
            }
            className="btn btn-primary gap-2"
          >
            İleri
            <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={handleFinish} className="btn btn-success gap-2">
            <Check size={18} />
            Sınavı Oluştur
          </button>
        )}
      </div>
    </div>
  );
}

