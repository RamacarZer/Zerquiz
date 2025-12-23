import { BookOpen, Calendar, Plus } from 'lucide-react';
import { useClassroomData } from '../hooks/useClassroomData';

export default function LessonsTab() {
  const { lessons } = useClassroomData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Dersler</h2>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Ders
        </button>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {lesson.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {lesson.date}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                lesson.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lesson.status === 'completed' ? 'Tamamlandı' :
                 lesson.status === 'ongoing' ? 'Devam Ediyor' : 'Yaklaşan'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

