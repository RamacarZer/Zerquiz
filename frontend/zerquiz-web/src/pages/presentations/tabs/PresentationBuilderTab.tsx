import { Plus, Layout } from 'lucide-react';

export default function PresentationBuilderTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Plus className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Sunum Oluşturucu</h2>
      </div>
      <div className="border rounded-xl p-8">
        <div className="text-center mb-6">
          <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Yeni Sunum Oluştur</h3>
          <p className="text-gray-600">Profesyonel sunumlar oluşturmak için başlayın</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-semibold mb-2">Boş Sunum</h4>
            <p className="text-sm text-gray-600">Sıfırdan başla</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-semibold mb-2">Şablondan</h4>
            <p className="text-sm text-gray-600">Hazır şablon kullan</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-semibold mb-2">AI ile Oluştur</h4>
            <p className="text-sm text-gray-600">AI desteğiyle hızlı oluştur</p>
          </div>
        </div>
      </div>
    </div>
  );
}

