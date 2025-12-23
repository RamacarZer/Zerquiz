import { Plus, Trash2 } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
}

interface QuestionSelectorProps {
  selectedQuestions: Question[];
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
}

export default function QuestionSelector({
  selectedQuestions,
  onAddQuestion,
  onRemoveQuestion,
}: QuestionSelectorProps) {
  return (
    <div className="card bg-white shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">Seçili Sorular ({selectedQuestions.length})</h2>
          <button onClick={onAddQuestion} className="btn btn-primary btn-sm gap-2">
            <Plus size={16} />
            Soru Ekle
          </button>
        </div>

        {selectedQuestions.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <p className="text-gray-600">Henüz soru eklenmedi</p>
            <button onClick={onAddQuestion} className="btn btn-sm btn-outline mt-4">
              İlk Soruyu Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-base-100 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="badge badge-neutral">{index + 1}</div>
                    <span className="text-sm font-semibold text-gray-600">
                      {question.type === 'multiple-choice' && 'Çoktan Seçmeli'}
                      {question.type === 'true-false' && 'Doğru/Yanlış'}
                      {question.type === 'essay' && 'Açık Uçlu'}
                    </span>
                    <div className="badge badge-primary">{question.points} puan</div>
                  </div>
                  <p className="text-gray-800 text-sm">{question.text}</p>
                </div>
                <button
                  onClick={() => onRemoveQuestion(question.id)}
                  className="btn btn-sm btn-ghost btn-circle text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="divider"></div>

        <div className="stats stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Toplam Soru</div>
            <div className="stat-value text-2xl">{selectedQuestions.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Toplam Puan</div>
            <div className="stat-value text-2xl">
              {selectedQuestions.reduce((sum, q) => sum + q.points, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

