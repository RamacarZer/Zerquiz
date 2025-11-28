/**
 * Exam Presentation Mode - Sınav Sunum Modu
 * Sınavın sorularını sunum olarak gösterme (öğretmen için)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Pause, ChevronLeft, ChevronRight, Maximize, Minimize,
  Eye, EyeOff, Settings, X, Grid, List, Monitor, Users,
} from 'lucide-react';
import { demoExams, ExamDefinition } from '../../mocks/examSystemData';

type DisplayMode = 'question' | 'answer' | 'both';
type ViewLayout = 'fullscreen' | 'split' | 'grid';

export default function ExamPresentationPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<ExamDefinition | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('question');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('fullscreen');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState(10); // seconds
  const [showSettings, setShowSettings] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load exam
  useEffect(() => {
    if (!examId) return;
    const foundExam = demoExams.find(e => e.id === examId);
    if (foundExam) {
      setExam(foundExam);
    }
  }, [examId]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !exam) return;

    timeoutRef.current = setTimeout(() => {
      if (currentQuestion < exam.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, autoPlayInterval * 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentQuestion, autoPlayInterval, exam]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
      if (e.key === 'Escape' && isFullscreen) {
        handleExitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, exam, isFullscreen]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    if (isFullscreen) {
      window.addEventListener('mousemove', handleMouseMove);
      timeout = setTimeout(() => setShowControls(false), 3000);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  const handleNext = () => {
    if (!exam) return;
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleExitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Sınav yükleniyor...</p>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col overflow-hidden`}
    >
      {/* Header - Only show when controls are visible */}
      {showControls && (
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isFullscreen && (
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl font-bold text-white">{exam.title}</h1>
                  <p className="text-sm text-gray-300">
                    {exam.subject} • Soru {currentQuestion + 1} / {exam.questions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Display Mode */}
                <select
                  value={displayMode}
                  onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="question">Sadece Soru</option>
                  <option value="answer">Sadece Cevap</option>
                  <option value="both">Soru + Cevap</option>
                </select>

                {/* Layout */}
                <button
                  onClick={() => setViewLayout(viewLayout === 'fullscreen' ? 'split' : 'fullscreen')}
                  className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                  title="Layout değiştir"
                >
                  {viewLayout === 'fullscreen' ? <Grid className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </button>

                {/* Settings */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleToggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-5xl w-full">
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Question Number */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-lg">
                Soru {currentQuestion + 1}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                question.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {question.difficulty === 'easy' ? 'Kolay' :
                 question.difficulty === 'medium' ? 'Orta' :
                 question.difficulty === 'hard' ? 'Zor' : 'Uzman'}
              </span>
              <span className="text-gray-600">{question.points} puan</span>
            </div>

            {/* Question Text */}
            {(displayMode === 'question' || displayMode === 'both') && (
              <div className="mb-8">
                <p className="text-2xl text-gray-800 font-medium leading-relaxed">
                  {question.question}
                </p>
              </div>
            )}

            {/* Answer Options */}
            {(displayMode === 'answer' || displayMode === 'both') && question.options && (
              <div className="space-y-4">
                {question.options.map((option, idx) => {
                  const letters = ['A', 'B', 'C', 'D', 'E'];
                  const isCorrect = displayMode !== 'question' && option.isCorrect;

                  return (
                    <div
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {letters[idx]}
                      </div>
                      <span className={`text-lg flex-1 ${
                        isCorrect ? 'font-medium text-green-900' : 'text-gray-700'
                      }`}>
                        {option.text}
                      </span>
                      {isCorrect && (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium">
                          Doğru Cevap
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* True/False Questions */}
            {(displayMode === 'answer' || displayMode === 'both') && question.type === 'true_false' && (
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                  question.correctAnswer === 'true'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    question.correctAnswer === 'true'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    ✓
                  </div>
                  <span className={`text-lg flex-1 ${
                    question.correctAnswer === 'true' ? 'font-medium text-green-900' : 'text-gray-700'
                  }`}>
                    Doğru
                  </span>
                  {question.correctAnswer === 'true' && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium">
                      Doğru Cevap
                    </span>
                  )}
                </div>
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                  question.correctAnswer === 'false'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    question.correctAnswer === 'false'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    ✗
                  </div>
                  <span className={`text-lg flex-1 ${
                    question.correctAnswer === 'false' ? 'font-medium text-green-900' : 'text-gray-700'
                  }`}>
                    Yanlış
                  </span>
                  {question.correctAnswer === 'false' && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium">
                      Doğru Cevap
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Explanation */}
            {displayMode === 'both' && question.explanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">Açıklama:</div>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls - Only show when controls are visible */}
      {showControls && (
        <div className="bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Navigation */}
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Önceki
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Otomatik Oynat
                  </>
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentQuestion === exam.questions.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sonraki
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Sunum Ayarları</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otomatik Geçiş Süresi
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={autoPlayInterval}
                  onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-2">
                  {autoPlayInterval} saniye
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tamam
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

