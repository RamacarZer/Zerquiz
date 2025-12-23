import { Bot } from 'lucide-react';

export default function AIAssistantsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">AI Asistanları</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Yazım Asistanı</h3>
          <p className="text-gray-600 mb-4">Metinlerinizi düzeltin ve geliştirin</p>
          <button className="btn btn-secondary">Başlat</button>
        </div>
        <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Analiz Asistanı</h3>
          <p className="text-gray-600 mb-4">İçeriklerinizi analiz edin</p>
          <button className="btn btn-secondary">Başlat</button>
        </div>
      </div>
    </div>
  );
}

