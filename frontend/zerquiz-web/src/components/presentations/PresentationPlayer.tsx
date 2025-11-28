import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Maximize,
  Volume2,
  Settings,
  Home,
} from 'lucide-react';
import { Presentation, Slide } from '../../mocks/presentationData';

interface PresentationPlayerProps {
  presentation: Presentation;
  onClose: () => void;
}

export default function PresentationPlayer({ presentation, onClose }: PresentationPlayerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentSlide = presentation.slides[currentSlideIndex];
  const totalSlides = presentation.slides.length;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      } else if (presentation.settings.loop) {
        setCurrentSlideIndex(0);
      } else {
        setIsPlaying(false);
      }
    }, (currentSlide.duration || presentation.settings.defaultDuration) * 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlideIndex, totalSlides, presentation.settings, currentSlide.duration]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, totalSlides, onClose]);

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderSlideContent = (slide: Slide) => {
    const { content } = slide;
    const backgroundColor = content.backgroundColor || '#FFFFFF';
    const textColor = content.textColor || '#000000';

    const layoutClasses = {
      center: 'justify-center items-center text-center',
      left: 'justify-start items-start text-left pl-12',
      right: 'justify-end items-end text-right pr-12',
      split: 'justify-between items-center',
    };

    const layoutClass = layoutClasses[content.layout || 'center'];

    return (
      <div
        className={`w-full h-full flex flex-col ${layoutClass} p-8`}
        style={{ backgroundColor, color: textColor }}
      >
        {slide.type === 'title' && (
          <>
            <h1 className="text-6xl font-bold mb-4">{content.title}</h1>
            {content.subtitle && <p className="text-3xl opacity-80">{content.subtitle}</p>}
          </>
        )}

        {slide.type === 'content' && (
          <>
            {content.title && <h2 className="text-4xl font-bold mb-6">{content.title}</h2>}
            {content.body && (
              <div className="text-2xl whitespace-pre-wrap max-w-4xl">
                {content.body}
              </div>
            )}
          </>
        )}

        {slide.type === 'image' && content.imageUrl && (
          <>
            {content.title && <h2 className="text-4xl font-bold mb-6">{content.title}</h2>}
            <img
              src={content.imageUrl}
              alt={content.title}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
            />
          </>
        )}

        {slide.type === 'video' && content.videoUrl && (
          <>
            {content.title && <h2 className="text-4xl font-bold mb-6">{content.title}</h2>}
            <video
              src={content.videoUrl}
              controls
              className="max-w-full max-h-[60vh] rounded-lg shadow-2xl"
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Slide Content */}
      <div className="w-full h-full relative">
        <div className="w-full h-full">{renderSlideContent(currentSlide)}</div>

        {/* Navigation Overlay */}
        {showControls && (
          <>
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold">{presentation.title}</h3>
                  <p className="text-sm opacity-80">
                    {currentSlideIndex + 1} / {totalSlides}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  title="Kapat (Esc)"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            {currentSlideIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                title="Önceki (◀)"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {currentSlideIndex < totalSlides - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                title="Sonraki (▶)"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between text-white mb-2">
                {/* Progress Bar */}
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-white">
                {/* Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  title={isPlaying ? 'Duraklat (Space)' : 'Oynat (Space)'}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                {/* Slide Thumbnails */}
                <div className="flex-1 flex items-center justify-center gap-2 mx-4 overflow-x-auto">
                  {presentation.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition ${
                        index === currentSlideIndex
                          ? 'border-white scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: slide.content.backgroundColor || '#FFFFFF' }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Tam Ekran"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Toggle Controls on Mouse Move */}
        <div
          className="absolute inset-0 cursor-pointer"
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={() => setShowControls(!showControls)}
        />
      </div>
    </div>
  );
}

