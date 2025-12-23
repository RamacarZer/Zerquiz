import { useState } from 'react';
import {
  QuestionHeader,
  QuestionTypeSelect,
  MultipleChoiceEditor,
  QuestionMetadata,
} from './components';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function QuestionEditorPage() {
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { id: 'opt_1', text: '', isCorrect: false },
    { id: 'opt_2', text: '', isCorrect: false },
    { id: 'opt_3', text: '', isCorrect: false },
    { id: 'opt_4', text: '', isCorrect: false },
  ]);
  const [metadata, setMetadata] = useState({
    difficulty: '',
    subject: '',
    topic: '',
    points: 5,
    estimatedTime: 2,
  });

  const handleSave = () => {
    console.log('Saving question:', { questionType, questionText, options, metadata });
    alert('Soru kaydedildi!');
  };

  const handlePreview = () => {
    alert('Önizleme özelliği yakında eklenecek!');
  };

  const handleMetadataChange = (field: string, value: string | number) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const isSaveDisabled = !questionType || !questionText.trim();

  return (
    <div className="container mx-auto px-6 py-8">
      <QuestionHeader
        title="Soru Editörü"
        description="Yeni soru oluştur veya mevcut soruyu düzenle"
        onSaveClick={handleSave}
        onPreviewClick={handlePreview}
        saveDisabled={isSaveDisabled}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <QuestionTypeSelect value={questionType} onChange={setQuestionType} />

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Soru Metni</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Sorunuzu buraya yazın..."
                />
              </div>

              {questionType === 'multiple-choice' && (
                <div className="mt-6">
                  <MultipleChoiceEditor options={options} onChange={setOptions} />
                </div>
              )}

              {questionType === 'true-false' && (
                <div className="mt-6 space-y-3">
                  <label className="label">
                    <span className="label-text font-semibold">Doğru Cevap</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="label cursor-pointer gap-2 p-4 border rounded-lg flex-1">
                      <span className="label-text">Doğru</span>
                      <input type="radio" name="trueFalse" className="radio radio-success" />
                    </label>
                    <label className="label cursor-pointer gap-2 p-4 border rounded-lg flex-1">
                      <span className="label-text">Yanlış</span>
                      <input type="radio" name="trueFalse" className="radio radio-error" />
                    </label>
                  </div>
                </div>
              )}

              {questionType === 'fill-blank' && (
                <div className="mt-6">
                  <label className="label">
                    <span className="label-text font-semibold">Doğru Cevaplar (virgülle ayırın)</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="cevap1, cevap2, cevap3"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuestionMetadata
            difficulty={metadata.difficulty}
            subject={metadata.subject}
            topic={metadata.topic}
            points={metadata.points}
            estimatedTime={metadata.estimatedTime}
            onChange={handleMetadataChange}
          />
        </div>
      </div>
    </div>
  );
}
