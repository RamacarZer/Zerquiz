import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Presentation,
  Slide,
  SlideTemplate,
  presentationService,
  slideTemplateService,
} from '../../mocks/presentationMocks';
import { Plus, Play, Settings, Eye, Save, Grid3x3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Spinner } from '../../components/common/LoadingStates';
import AdvancedRichTextEditor from '../../components/common/AdvancedRichTextEditor';
import { generateUUID } from '../../lib/mockStorage';

export const PresentationEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation>({
    id: generateUUID(),
    title: 'Yeni Sunum',
    theme: 'modern',
    mode: 'slides',
    status: 'draft',
    slideCount: 0,
    isLive: false,
  });
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<SlideTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await slideTemplateService.getAll();
    setTemplates(data);
  };

  const addSlideFromTemplate = (template: SlideTemplate) => {
    const newSlide: Slide = {
      id: generateUUID(),
      presentationId: presentation.id,
      order: slides.length,
      ...template.defaultContent,
      type: template.type,
    } as Slide;

    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    setShowTemplates(false);
  };

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...newSlides[currentSlideIndex], ...updates };
    setSlides(newSlides);
  };

  const deleteSlide = (index: number) => {
    if (confirm('Bu slaytı silmek istediğinizden emin misiniz?')) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (currentSlideIndex >= newSlides.length) {
        setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await presentationService.create({ ...presentation, slideCount: slides.length });
      alert('Sunum kaydedildi!');
      navigate('/presentations');
    } catch (error) {
      alert('Kayıt başarısız!');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const themes = [
    { id: 'default', name: 'Varsayılan', bg: '#FFFFFF', text: '#000000' },
    { id: 'modern', name: 'Modern', bg: '#1E40AF', text: '#FFFFFF' },
    { id: 'dark', name: 'Koyu', bg: '#1F2937', text: '#F9FAFB' },
    { id: 'minimal', name: 'Minimal', bg: '#F3F4F6', text: '#111827' },
    { id: 'elegant', name: 'Zarif', bg: '#7C3AED', text: '#FFFFFF' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/presentations')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={presentation.title}
            onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
            className="text-xl font-bold border-none focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Önizleme
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            Kaydet
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Slide Thumbnails */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto p-4 space-y-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 text-gray-600"
          >
            <Plus className="w-5 h-5" />
            Yeni Slayt
          </button>

          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => setCurrentSlideIndex(index)}
              className={`relative p-3 border-2 rounded-lg cursor-pointer transition ${
                index === currentSlideIndex ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-semibold text-gray-500 mb-1">Slayt {index + 1}</div>
              <div className="bg-white rounded p-2 aspect-video flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                {slide.type === 'title' && '📊 Başlık'}
                {slide.type === 'content' && '📝 İçerik'}
                {slide.type === 'image' && '🖼️ Görsel'}
                {slide.type === 'video' && '🎥 Video'}
                {slide.type === 'two_column' && '⚖️ İki Sütun'}
                {slide.type === 'quote' && '💬 Alıntı'}
                {slide.type === 'code' && '💻 Kod'}
                {slide.type === 'quiz' && '❓ Quiz'}
                {slide.type === 'blank' && '⬜ Boş'}
              </div>
              {index === currentSlideIndex && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Main Editor */}
        <div className="flex-1 p-8 overflow-y-auto">
          {slides.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Grid3x3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Slayt Ekleyin</h3>
                <p className="text-gray-500 mb-6">Başlamak için sol panelden yeni slayt ekleyin</p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  İlk Slaytı Ekle
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Slide Editor */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 aspect-video">
                {currentSlide && (
                  <div className="h-full flex flex-col">
                    <input
                      type="text"
                      value={currentSlide.title || ''}
                      onChange={(e) => updateSlide({ title: e.target.value })}
                      placeholder="Slayt başlığı..."
                      className="text-3xl font-bold mb-4 border-none focus:outline-none focus:ring-0"
                    />
                    
                    <div className="flex-1 overflow-y-auto">
                      <AdvancedRichTextEditor
                        value={currentSlide.content || ''}
                        onChange={(content) => updateSlide({ content })}
                        placeholder="İçerik girin..."
                        height={200}
                        showToolbar={true}
                        enableKatex={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Settings */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Slayt Ayarları</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Geçiş Efekti</label>
                    <select
                      value={currentSlide?.transition || 'fade'}
                      onChange={(e) => updateSlide({ transition: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                      <option value="flip">Flip</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre (sn)</label>
                    <input
                      type="number"
                      value={currentSlide?.duration || 0}
                      onChange={(e) => updateSlide({ duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="0 (Manuel)"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konuşmacı Notları</label>
                  <textarea
                    value={currentSlide?.speakerNotes || ''}
                    onChange={(e) => updateSlide({ speakerNotes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Sadece sizin göreceğiniz notlar..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tema & Ayarlar
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema Seç</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setPresentation({ ...presentation, theme: theme.id as any })}
                    className={`p-4 rounded-lg border-2 transition ${
                      presentation.theme === theme.id ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: theme.bg }}
                  >
                    <div className="text-xs font-medium" style={{ color: theme.text }}>
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sunum Modu</label>
              <select
                value={presentation.mode}
                onChange={(e) => setPresentation({ ...presentation, mode: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="slides">Slaytlar</option>
                <option value="scroll">Kaydırmalı</option>
                <option value="auto">Otomatik</option>
                <option value="interactive">Etkileşimli</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Toplam Slayt:</span>
                  <span className="font-semibold">{slides.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durum:</span>
                  <span className="font-semibold capitalize">{presentation.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Slayt Şablonu Seçin</h2>
              <button onClick={() => setShowTemplates(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => addSlideFromTemplate(template)}
                  className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-lg transition"
                >
                  <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-4xl">
                    {template.type === 'title' && '📊'}
                    {template.type === 'content' && '📝'}
                    {template.type === 'image' && '🖼️'}
                    {template.type === 'video' && '🎥'}
                    {template.type === 'two_column' && '⚖️'}
                    {template.type === 'quote' && '💬'}
                    {template.type === 'code' && '💻'}
                    {template.type === 'quiz' && '❓'}
                    {template.type === 'blank' && '⬜'}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {slides.length > 0 && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-200">
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium px-3">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PresentationEditorPage;

