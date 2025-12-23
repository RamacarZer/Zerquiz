import { Library, Upload, Search } from 'lucide-react';
import { useContentData } from '../hooks/useContentData';

export default function LibraryTab() {
  const { content } = useContentData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Library className="w-8 h-8 text-blue-600" />
          İçerik Kütüphanesi
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="İçerik ara..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Yükle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <div key={item.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">
              {item.uploadedBy} • {new Date(item.uploadedAt).toLocaleDateString('tr-TR')}
            </p>
            <div className="flex gap-2 mt-3">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

