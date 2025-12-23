import { Sparkles } from 'lucide-react';

export default function AIGenerationTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">AI İçerik Üretimi</h2>
      </div>
      <div className="border rounded-xl p-8 text-center">
        <p className="text-gray-600">AI destekli içerik üretim araçları</p>
        <button className="btn btn-primary mt-4">Yeni İçerik Oluştur</button>
      </div>
    </div>
  );
}

