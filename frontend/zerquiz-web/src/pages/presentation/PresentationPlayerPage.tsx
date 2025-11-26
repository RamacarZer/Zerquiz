import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  presentationService,
  Presentation,
  Slide,
} from "../../services/api/presentationService";
import SlideRenderer from "../../components/presentation/SlideRenderer";

export default function PresentationPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadPresentation();
  }, [id]);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          nextSlide();
          break;
        case "ArrowLeft":
          prevSlide();
          break;
        case "Escape":
          if (isFullscreen) exitFullscreen();
          else navigate("/presentations");
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "s":
        case "S":
          setShowSpeakerNotes((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length, isFullscreen]);

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

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
    } catch (error) {
      console.error("Failed to load presentation:", error);
      alert("Sunum yüklenemedi!");
      navigate("/presentations");
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setShowControls(true);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setShowControls(true);
    }
  }, [currentSlideIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!presentation || slides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl mb-4">Sunum bulunamadı veya slayt yok</h2>
          <button
            onClick={() => navigate("/presentations")}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <div
      className="relative h-screen bg-gray-900 overflow-hidden"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Main slide area */}
      <div className="h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <SlideRenderer slide={currentSlide} theme={presentation.theme} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {presentation.showProgressBar && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Slide number */}
      {presentation.showSlideNumbers && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          {currentSlideIndex + 1} / {slides.length}
        </div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-6 pointer-events-auto">
              <div className="flex items-center justify-between text-white">
                <h1 className="text-2xl font-bold">{presentation.title}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                    className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30"
                    title="Konuşmacı Notları (S)"
                  >
                    📝
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30"
                    title="Tam Ekran (F)"
                  >
                    {isFullscreen ? "🗗" : "⛶"}
                  </button>
                  <button
                    onClick={() => navigate("/presentations")}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                    title="Çıkış (ESC)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            {currentSlideIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 pointer-events-auto"
                title="Önceki (←)"
              >
                ←
              </button>
            )}
            {currentSlideIndex < slides.length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 pointer-events-auto"
                title="Sonraki (→ veya Space)"
              >
                →
              </button>
            )}

            {/* Thumbnail navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlideIndex
                      ? "bg-blue-500 w-8"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  title={`Slayt ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaker notes */}
      <AnimatePresence>
        {showSpeakerNotes && currentSlide.speakerNotes && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 text-white p-6 max-h-64 overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg">📝 Konuşmacı Notları</h3>
              <button
                onClick={() => setShowSpeakerNotes(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300">{currentSlide.speakerNotes}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts help */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-50 text-white text-xs p-3 rounded-lg">
        <div className="font-semibold mb-2">⌨️ Kısayollar:</div>
        <div className="space-y-1 opacity-80">
          <div>→ / Space: Sonraki</div>
          <div>←: Önceki</div>
          <div>F: Tam ekran</div>
          <div>S: Notlar</div>
          <div>ESC: Çıkış</div>
        </div>
      </div>
    </div>
  );
}

