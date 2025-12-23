import { Settings } from 'lucide-react';

export default function ExamManagementTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Sınav Yönetimi</h2>
      </div>
      <div className="border rounded-xl p-8 text-center">
        <p className="text-gray-600">Sınav ayarları ve yapılandırma</p>
      </div>
    </div>
  );
}

