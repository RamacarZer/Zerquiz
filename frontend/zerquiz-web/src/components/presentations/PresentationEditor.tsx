import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  Image,
  Type,
  Video,
  Grid,
  Eye,
} from 'lucide-react';
import { Presentation, Slide, SlideContent } from '../../mocks/presentationData';
import { generateUUID } from '../../lib/mockStorage';

interface PresentationEditorProps {
  presentation: Presentation;
  onSave: (presentation: Presentation) => void;
  onClose: () => void;
}

export default function PresentationEditor({
  presentation,
  onSave,
  onClose,
}: PresentationEditorProps) {
  const [editedPresentation, setEditedPresentation] = useState<Presentation>(presentation);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const selectedSlide = editedPresentation.slides[selectedSlideIndex];

  const updatePresentationField = (field: keyof Presentation, value: any) => {
    setEditedPresentation(prev => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }));
  };

  const updateSlideContent = (field: keyof SlideContent, value: any) => {
    const updatedSlides = [...editedPresentation.slides];
    updatedSlides[selectedSlideIndex] = {
      ...updatedSlides[selectedSlideIndex],
      content: {
        ...updatedSlides[selectedSlideIndex].content,
        [field]: value,
      },
    };
    setEditedPresentation(prev => ({ ...prev, slides: updatedSlides, updatedAt: new Date().toISOString() }));
  };

  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: generateUUID(),
      order: editedPresentation.slides.length + 1,
      type,
      content: {
        title: type === 'title' ? 'Yeni Başlık' : 'Yeni Slayt',
        subtitle: type === 'title' ? 'Alt başlık' : undefined,
        body: type === 'content' ? 'İçerik buraya...' : undefined,
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        layout: 'center',
      },
    };

    setEditedPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedSlideIndex(editedPresentation.slides.length);
  };

  const deleteSlide = (index: number) => {
    if (editedPresentation.slides.length <= 1) {
      alert('En az bir slayt olmalıdır!');
      return;
    }

    const updatedSlides = editedPresentation.slides.filter((_, i) => i !== index);
    setEditedPresentation(prev => ({ ...prev, slides: updatedSlides, updatedAt: new Date().toISOString() }));

    if (selectedSlideIndex >= updatedSlides.length) {
      setSelectedSlideIndex(updatedSlides.length - 1);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editedPresentation.slides.length) return;

    const updatedSlides = [...editedPresentation.slides];
    [updatedSlides[index], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[index]];
    updatedSlides.forEach((slide, i) => (slide.order = i + 1));

    setEditedPresentation(prev => ({ ...prev, slides: updatedSlides, updatedAt: new Date().toISOString() }));
    setSelectedSlideIndex(newIndex);
  };

  const handleSave = () => {
    onSave(editedPresentation);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <input
              type="text"
              value={editedPresentation.title}
              onChange={(e) => updatePresentationField('title', e.target.value)}
              className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
              placeholder="Sunum başlığı..."
            />
            <p className="text-sm text-gray-600 mt-1">{editedPresentation.slides.length} slayt</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Eye className="h-4 w-4" />
              Önizleme
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Save className="h-4 w-4" />
              Kaydet
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Slide Thumbnails */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Slaytlar</h3>

            {/* Add Slide Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => addSlide('title')}
                className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <Type className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-600">Başlık</span>
              </button>
              <button
                onClick={() => addSlide('content')}
                className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <Grid className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-600">İçerik</span>
              </button>
            </div>

            {/* Slide List */}
            <div className="space-y-2">
              {editedPresentation.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                    index === selectedSlideIndex
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSlideIndex(index)}
                >
                  <div
                    className="aspect-video flex items-center justify-center p-2 text-center"
                    style={{ backgroundColor: slide.content.backgroundColor || '#FFFFFF' }}
                  >
                    <div className="text-xs font-medium truncate" style={{ color: slide.content.textColor }}>
                      {slide.content.title || `Slayt ${index + 1}`}
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>

                  {/* Slide Actions */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(index, 'up');
                        }}
                        className="p-1 bg-black/70 hover:bg-black rounded"
                        title="Yukarı taşı"
                      >
                        <ArrowUp className="h-3 w-3 text-white" />
                      </button>
                    )}
                    {index < editedPresentation.slides.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(index, 'down');
                        }}
                        className="p-1 bg-black/70 hover:bg-black rounded"
                        title="Aşağı taşı"
                      >
                        <ArrowDown className="h-3 w-3 text-white" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Bu slaytı silmek istediğinizden emin misiniz?')) {
                          deleteSlide(index);
                        }
                      }}
                      className="p-1 bg-red-600 hover:bg-red-700 rounded"
                      title="Sil"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 bg-gray-200 p-8 overflow-auto">
            <div
              className="max-w-5xl mx-auto aspect-video bg-white rounded-lg shadow-2xl flex items-center justify-center p-12 text-center"
              style={{
                backgroundColor: selectedSlide.content.backgroundColor,
                color: selectedSlide.content.textColor,
              }}
            >
              {showPreview ? (
                <div className="w-full h-full flex flex-col justify-center">
                  {selectedSlide.type === 'title' && (
                    <>
                      <h1 className="text-6xl font-bold mb-4">{selectedSlide.content.title}</h1>
                      {selectedSlide.content.subtitle && (
                        <p className="text-3xl opacity-80">{selectedSlide.content.subtitle}</p>
                      )}
                    </>
                  )}
                  {selectedSlide.type === 'content' && (
                    <>
                      <h2 className="text-4xl font-bold mb-6">{selectedSlide.content.title}</h2>
                      {selectedSlide.content.body && (
                        <pre className="text-2xl whitespace-pre-wrap font-sans">{selectedSlide.content.body}</pre>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">
                  <Eye className="h-16 w-16 mx-auto mb-4" />
                  <p>Önizleme için üst menüden "Önizleme" butonuna tıklayın</p>
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="bg-white border-t border-gray-200 p-6 overflow-y-auto max-h-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Slayt Özellikleri</h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={selectedSlide.content.title || ''}
                  onChange={(e) => updateSlideContent('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Slayt başlığı..."
                />
              </div>

              {/* Subtitle (for title slides) */}
              {selectedSlide.type === 'title' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                  <input
                    type="text"
                    value={selectedSlide.content.subtitle || ''}
                    onChange={(e) => updateSlideContent('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Alt başlık..."
                  />
                </div>
              )}

              {/* Body (for content slides) */}
              {selectedSlide.type === 'content' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <textarea
                    value={selectedSlide.content.body || ''}
                    onChange={(e) => updateSlideContent('body', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="İçerik buraya... (Maddeler için • kullanın)"
                  />
                </div>
              )}

              {/* Layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Düzen</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['center', 'left', 'right', 'split'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => updateSlideContent('layout', layout)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition ${
                        selectedSlide.content.layout === layout
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {layout === 'center' ? 'Orta' : layout === 'left' ? 'Sol' : layout === 'right' ? 'Sağ' : 'Bölünmüş'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arka Plan Rengi</label>
                  <input
                    type="color"
                    value={selectedSlide.content.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateSlideContent('backgroundColor', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metin Rengi</label>
                  <input
                    type="color"
                    value={selectedSlide.content.textColor || '#000000'}
                    onChange={(e) => updateSlideContent('textColor', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

