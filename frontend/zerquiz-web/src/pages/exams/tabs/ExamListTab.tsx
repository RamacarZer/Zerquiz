import { List, Plus } from 'lucide-react';
import { useExamData } from '../hooks/useExamData';

export default function ExamListTab() {
  const { exams } = useExamData();

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      draft: { label: 'Taslak', color: 'bg-gray-100 text-gray-800' },
      published: { label: 'Yayında', color: 'bg-green-100 text-green-800' },
      ongoing: { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Tamamlandı', color: 'bg-purple-100 text-purple-800' },
    };
    const config = configs[status] || configs.draft;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <List className="w-8 h-8 text-blue-600" />
          Sınav Listesi
        </h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Sınav
        </button>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📚 {exam.subject}</span>
                  <span>⏱️ {exam.duration} dakika</span>
                  <span>❓ {exam.questionCount} soru</span>
                  {exam.participants && <span>👥 {exam.participants} katılımcı</span>}
                </div>
              </div>
              {getStatusBadge(exam.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

