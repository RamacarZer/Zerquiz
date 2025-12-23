import { FileText, Plus, Users } from 'lucide-react';
import { useClassroomData } from '../hooks/useClassroomData';

export default function HomeworksTab() {
  const { homeworks } = useClassroomData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold">Ödevler</h2>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Ödev
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeworks.map((homework) => (
          <div key={homework.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{homework.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                homework.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {homework.status === 'open' ? 'Açık' : 'Kapalı'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Son Tarih: <span className="font-semibold">{homework.dueDate}</span></p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{homework.submittedCount}/{homework.totalStudents} öğrenci teslim etti</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(homework.submittedCount / homework.totalStudents) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

