import { Activity } from 'lucide-react';

export default function ExamMonitoringTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold">Sınav İzleme</h2>
      </div>
      <div className="border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Aktif Sınavlar</h3>
        <p className="text-gray-600">Gerçek zamanlı sınav takibi</p>
      </div>
    </div>
  );
}

