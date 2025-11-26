import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  presentationService,
  Presentation,
  Slide,
  CreateSlideRequest,
  UpdateSlideRequest,
} from "../../services/api/presentationService";
import SlideTypeSelector, {
  SlideType,
} from "../../components/presentation/SlideTypeSelector";
import SlideThumbnail from "../../components/presentation/SlideThumbnail";
import SlideEditor from "../../components/presentation/SlideEditor";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

export default function PresentationBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Presentation metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("default");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditMode) {
      loadPresentation();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadPresentation = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [presentationData, slidesData] = await Promise.all([
        presentationService.getById(id),
        presentationService.getSlides(id),
      ]);

      setPresentation(presentationData);
      setSlides(slidesData.sort((a, b) => a.order - b.order));
      setTitle(presentationData.title);
      setDescription(presentationData.description || "");
      setTheme(presentationData.theme);
    } catch (error) {
      console.error("Failed to load presentation:", error);
      alert("Sunum yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      setSaving(true);

      if (isEditMode && id) {
        await presentationService.update(id, { title, description, theme });
      } else {
        const newPresentation = await presentationService.create({
          title: title || "Yeni Sunum",
          description,
          theme,
        });
        setPresentation(newPresentation);
        navigate(`/presentations/${newPresentation.id}/edit`, {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Failed to save presentation:", error);
      alert("Sunum kaydedilemedi!");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = async (type: SlideType) => {
    if (!presentation?.id) {
      // First save the presentation, then add slide
      try {
        setSaving(true);
        const newPresentation = await presentationService.create({
          title,
          description,
          theme,
        });
        setPresentation(newPresentation);

        // Now add the slide
        const newSlide: CreateSlideRequest = {
          presentationId: newPresentation.id,
          order: 0,
          type,
          title: `Yeni ${type} Slayt`,
          content: "",
          transition: "fade",
          duration: 0,
        };

        const createdSlide = await presentationService.createSlide(
          newPresentation.id,
          newSlide
        );
        setSlides([createdSlide]);
        setActiveSlideIndex(0);
        navigate(`/presentations/${newPresentation.id}/edit`, {
          replace: true,
        });
      } catch (error) {
        console.error("Failed to create presentation and slide:", error);
        alert("Sunum oluşturulamadı!");
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      const newSlide: CreateSlideRequest = {
        presentationId: presentation.id,
        order: slides.length,
        type,
        title: `Yeni ${type} Slayt`,
        content: "",
        transition: "fade",
        duration: 0,
      };

      const createdSlide = await presentationService.createSlide(
        presentation.id,
        newSlide
      );
      setSlides([...slides, createdSlide]);
      setActiveSlideIndex(slides.length);
    } catch (error) {
      console.error("Failed to add slide:", error);
      alert("Slayt eklenemedi!");
    }
  };

  const handleUpdateSlide = async (
    slideId: string,
    data: UpdateSlideRequest
  ) => {
    if (!presentation?.id) return;

    try {
      const updatedSlide = await presentationService.updateSlide(
        presentation.id,
        slideId,
        data
      );
      setSlides(slides.map((s) => (s.id === slideId ? updatedSlide : s)));
    } catch (error) {
      console.error("Failed to update slide:", error);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!presentation?.id) return;
    if (!confirm("Bu slaytı silmek istediğinizden emin misiniz?")) return;

    try {
      await presentationService.deleteSlide(presentation.id, slideId);
      const newSlides = slides.filter((s) => s.id !== slideId);
      setSlides(newSlides);
      if (activeSlideIndex >= newSlides.length) {
        setActiveSlideIndex(Math.max(0, newSlides.length - 1));
      }
    } catch (error) {
      console.error("Failed to delete slide:", error);
      alert("Slayt silinemedi!");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !presentation?.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedSlides = [...slides];
    const [movedSlide] = reorderedSlides.splice(oldIndex, 1);
    reorderedSlides.splice(newIndex, 0, movedSlide);

    // Update order property
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      order: index,
    }));

    setSlides(updatedSlides);

    try {
      await presentationService.reorderSlides(
        presentation.id,
        updatedSlides.map((s) => s.id)
      );
    } catch (error) {
      console.error("Failed to reorder slides:", error);
      setSlides(slides); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => navigate("/presentations")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Geri
          </button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunum başlığı..."
            className="flex-1 max-w-md"
          />
          <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="default">Varsayılan</option>
            <option value="dark">Koyu</option>
            <option value="minimal">Minimal</option>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveMetadata}
            disabled={saving || !title}
            variant="secondary"
          >
            {saving ? "Kaydediliyor..." : "💾 Kaydet"}
          </Button>
          {presentation && (
            <Button
              onClick={() => navigate(`/presentations/${presentation.id}/play`)}
              variant="primary"
            >
              ▶️ Oynat
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Slide list */}
        <div className="w-64 bg-white border-r overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Slaytlar</h3>
            <button
              onClick={() => setShowTypeSelector(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              ➕ Ekle
            </button>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p className="mb-2">Henüz slayt yok</p>
              <button
                onClick={() => setShowTypeSelector(true)}
                className="text-blue-600 hover:underline"
              >
                İlk slaytı ekle
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {slides.map((slide, index) => (
                    <SlideThumbnail
                      key={slide.id}
                      slide={slide}
                      index={index}
                      isActive={index === activeSlideIndex}
                      onClick={() => setActiveSlideIndex(index)}
                      onDelete={() => handleDeleteSlide(slide.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Center - Slide editor */}
        <div className="flex-1 bg-white overflow-hidden">
          {slides.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-2xl font-bold mb-2">
                  Sunumunuzu Oluşturun
                </h2>
                <p className="mb-4">Başlamak için slayt ekleyin</p>
                <Button onClick={() => setShowTypeSelector(true)}>
                  ➕ İlk Slaytı Ekle
                </Button>
              </div>
            </div>
          ) : (
            slides[activeSlideIndex] && (
              <SlideEditor
                key={slides[activeSlideIndex].id}
                slide={slides[activeSlideIndex]}
                onUpdate={handleUpdateSlide}
              />
            )
          )}
        </div>

        {/* Right sidebar - Preview (simplified for MVP) */}
        <div className="w-80 bg-gray-100 border-l p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">📱 Önizleme</h3>
          {slides[activeSlideIndex] ? (
            <div className="bg-white rounded-lg shadow-lg aspect-video p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {slides[activeSlideIndex].type === "Title" && "📋"}
                  {slides[activeSlideIndex].type === "Content" && "📝"}
                  {slides[activeSlideIndex].type === "Image" && "🖼️"}
                  {slides[activeSlideIndex].type === "TwoColumn" && "⚖️"}
                  {slides[activeSlideIndex].type === "Quiz" && "❓"}
                  {slides[activeSlideIndex].type === "Poll" && "📊"}
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {slides[activeSlideIndex].title || "Başlıksız"}
                </h3>
                <p className="text-sm text-gray-600">
                  {slides[activeSlideIndex].content?.substring(0, 100) ||
                    "İçerik yok"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Önizleme yok</div>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Toplam slayt:</span>
              <span className="font-semibold">{slides.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aktif slayt:</span>
              <span className="font-semibold">{activeSlideIndex + 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tema:</span>
              <span className="font-semibold">{theme}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide type selector modal */}
      {showTypeSelector && (
        <SlideTypeSelector
          onSelect={handleAddSlide}
          onClose={() => setShowTypeSelector(false)}
        />
      )}
    </div>
  );
}
