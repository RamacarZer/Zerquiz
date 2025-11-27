import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Presentation, Plus, Play, Edit, Trash2, Copy, Eye } from 'lucide-react';
import {
  demoPresentations,
  presentationTemplates,
  getPresentationStats,
  createPresentationFromTemplate,
  type Presentation as PresentationType,
} from '../../mocks/presentationData';

export default function PresentationBuilderPageEnhanced() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | PresentationType['status']>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<PresentationType | null>(null);

  const stats = getPresentationStats();

  const filteredPresentations = filterStatus === 'all'
    ? demoPresentations
    : demoPresentations.filter(p => p.status === filterStatus);

  const handleCreateFromTemplate = (templateId: string) => {
    const title = prompt('Sunum başlığı:');
    if (title) {
      const newPresentation = createPresentationFromTemplate(templateId, title);
      alert(`"${title}" sunumu oluşturuldu! (ID: ${newPresentation.id})`);
      setShowTemplates(false);
    }
  };

  const handleAction = (presentation: PresentationType, action: string) => {
    switch (action) {
      case 'play':
        alert(`"${presentation.title}" sunumu oynatılıyor...`);
        break;
      case 'edit':
        alert(`"${presentation.title}" düzenleniyor...`);
        break;
      case 'duplicate':
        alert(`"${presentation.title}" kopyalanıyor...`);
        break;
      case 'delete':
        if (confirm(`"${presentation.title}" sunumunu silmek istediğinizden emin misiniz?`)) {
          alert('Sunum silindi!');
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Presentation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sunum Oluşturucu</h1>
                <p className="text-sm text-gray-600">İnteraktif sunumlar oluşturun</p>
              </div>
            </div>

            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Yeni Sunum
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Toplam</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-green-600 mb-1">Yayında</div>
            <div className="text-2xl font-bold text-green-900">{stats.published}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-xs text-yellow-600 mb-1">Taslak</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.draft}</div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Arşiv</div>
            <div className="text-2xl font-bold text-gray-900">{stats.archived}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({demoPresentations.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'published' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yayında ({stats.published})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'draft' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Taslak ({stats.draft})
            </button>
          </div>
        </div>

        {/* Presentations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresentations.map((pres) => (
            <div key={pres.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={pres.thumbnailUrl}
                  alt={pres.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    pres.status === 'published' ? 'bg-green-100 text-green-800' :
                    pres.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pres.status === 'published' ? '✓ Yayında' : pres.status === 'draft' ? '📝 Taslak' : '📦 Arşiv'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded">
                    {pres.slides.length} slayt
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pres.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pres.description}</p>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {pres.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {pres.createdBy} • {new Date(pres.updatedAt).toLocaleDateString('tr-TR')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(pres, 'play')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    <Play className="h-4 w-4" />
                    Oynat
                  </button>
                  <button
                    onClick={() => handleAction(pres, 'edit')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedPresentation(pres)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    title="Detaylar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPresentations.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Presentation className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Sunum bulunamadı</p>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowTemplates(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Şablon Seç</h2>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {presentationTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-indigo-500 transition cursor-pointer"
                    onClick={() => handleCreateFromTemplate(template.id)}
                  >
                    <img src={template.thumbnail} alt={template.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="mt-3">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPresentation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedPresentation(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <button
                onClick={() => setSelectedPresentation(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPresentation.title}</h2>
              <p className="text-gray-600 mb-6">{selectedPresentation.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Slayt Sayısı</div>
                  <div className="text-xl font-bold text-gray-900">{selectedPresentation.slides.length}</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Durum</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedPresentation.status === 'published' ? '✓ Yayında' : '📝 Taslak'}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(selectedPresentation, 'play')}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Oynat
                </button>
                <button
                  onClick={() => handleAction(selectedPresentation, 'edit')}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

