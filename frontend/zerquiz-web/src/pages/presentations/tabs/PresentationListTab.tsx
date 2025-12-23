import { List, Plus, Eye, Edit } from 'lucide-react';
import { usePresentationData } from '../hooks/usePresentationData';

export default function PresentationListTab() {
  const { presentations } = usePresentationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <List className="w-8 h-8 text-blue-600" />
          Sunum Listesi
        </h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Sunum
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presentations.map((presentation) => (
          <div key={presentation.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{presentation.title}</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                presentation.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {presentation.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {presentation.slideCount} slayt • {presentation.createdBy}
            </p>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-secondary flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Görüntüle
              </button>
              <button className="btn btn-sm btn-primary flex items-center gap-1">
                <Edit className="w-4 h-4" />
                Düzenle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

