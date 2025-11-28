/**
 * Advanced Exam Session with Proctoring & Adaptive Features
 * Gözetimli ve Adaptif Sınav Oturumu
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Camera, Video, AlertTriangle, Eye, EyeOff, Monitor, CheckCircle,
  XCircle, Clock, Flag, ChevronLeft, ChevronRight, Send, Pause, Play,
} from 'lucide-react';
import {
  ExamDefinition, ExamSession, ProctoringViolation,
  createExamSession,
} from '../../mocks/examSystemData';
import { demoExams } from '../../mocks/examSystemData';

type AdaptiveDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface ProctoringState {
  webcamEnabled: boolean;
  screenRecordingEnabled: boolean;
  isFullscreen: boolean;
  faceDetected: boolean;
  multipleFaces: boolean;
  tabSwitchCount: number;
  fullscreenExitCount: number;
  violations: ProctoringViolation[];
}

export default function AdvancedExamSessionPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<ExamDefinition | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<AdaptiveDifficulty>('medium');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  
  // Proctoring state
  const [proctoring, setProctoring] = useState<ProctoringState>({
    webcamEnabled: false,
    screenRecordingEnabled: false,
    isFullscreen: false,
    faceDetected: false,
    multipleFaces: false,
    tabSwitchCount: 0,
    fullscreenExitCount: 0,
    violations: [],
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load exam
  useEffect(() => {
    if (!examId) return;
    
    const foundExam = demoExams.find(e => e.id === examId);
    if (foundExam) {
      setExam(foundExam);
      setTimeRemaining(foundExam.duration * 60);
      
      // Create session
      const newSession = createExamSession(foundExam, 'student-001', 'Ali Yılmaz');
      setSession(newSession);
    }
  }, [examId]);

  // Initialize proctoring
  useEffect(() => {
    if (!exam || !exam.proctoring.enabled) return;

    const initProctoring = async () => {
      try {
        // Request fullscreen
        if (exam.proctoring.fullscreenRequired) {
          await document.documentElement.requestFullscreen();
          setProctoring(prev => ({ ...prev, isFullscreen: true }));
        }

        // Request webcam
        if (exam.proctoring.webcamRequired) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          webcamStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setProctoring(prev => ({ ...prev, webcamEnabled: true }));
          startFaceDetection();
        }

        // Request screen recording
        if (exam.proctoring.screenRecording) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = screenStream;
          setProctoring(prev => ({ ...prev, screenRecordingEnabled: true }));
        }
      } catch (error) {
        console.error('Proctoring initialization failed:', error);
        addViolation('no_face', 'Kamera veya ekran paylaşımı başlatılamadı', 'high');
      }
    };

    initProctoring();

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [exam]);

  // Tab switch detection
  useEffect(() => {
    if (!exam?.proctoring.enabled || !exam.proctoring.tabSwitchDetection) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctoring(prev => {
          const newCount = prev.tabSwitchCount + 1;
          addViolation('tab_switch', `Sekme değiştirme tespit edildi (${newCount}. kez)`, 'medium');
          return { ...prev, tabSwitchCount: newCount };
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [exam]);

  // Fullscreen exit detection
  useEffect(() => {
    if (!exam?.proctoring.enabled || !exam.proctoring.fullscreenRequired) return;

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setProctoring(prev => {
        if (!isFullscreen && prev.isFullscreen) {
          const newCount = prev.fullscreenExitCount + 1;
          addViolation('exit_fullscreen', `Tam ekrandan çıkıldı (${newCount}. kez)`, 'high');
          return { ...prev, isFullscreen: false, fullscreenExitCount: newCount };
        }
        return { ...prev, isFullscreen };
      });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [exam]);

  // Timer
  useEffect(() => {
    if (!exam || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        if (prev <= 300 && !showWarning) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [exam, isPaused, showWarning]);

  const startFaceDetection = () => {
    // Simulated face detection (in production, use face-api.js or similar)
    const faceCheckInterval = setInterval(() => {
      const random = Math.random();
      
      if (random < 0.1) {
        // Simulate no face detected
        setProctoring(prev => {
          if (prev.faceDetected) {
            addViolation('no_face', 'Yüz tespit edilemedi', 'high');
          }
          return { ...prev, faceDetected: false };
        });
      } else if (random < 0.15) {
        // Simulate multiple faces
        setProctoring(prev => {
          if (!prev.multipleFaces) {
            addViolation('multiple_faces', 'Birden fazla kişi tespit edildi', 'high');
          }
          return { ...prev, faceDetected: true, multipleFaces: true };
        });
      } else {
        setProctoring(prev => ({
          ...prev,
          faceDetected: true,
          multipleFaces: false,
        }));
      }
    }, 5000);

    return () => clearInterval(faceCheckInterval);
  };

  const addViolation = (type: ProctoringViolation['type'], description: string, severity: ProctoringViolation['severity']) => {
    const violation: ProctoringViolation = {
      id: `violation-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      severity,
      description,
    };

    setProctoring(prev => ({
      ...prev,
      violations: [...prev.violations, violation],
    }));
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Adaptive logic
    if (exam?.examMode === 'adaptive') {
      const question = exam.questions[currentQuestion];
      const isCorrect = question.correctAnswer === answer;

      if (isCorrect) {
        setConsecutiveCorrect(prev => prev + 1);
        setConsecutiveWrong(0);

        // Increase difficulty after 3 consecutive correct answers
        if (consecutiveCorrect >= 2 && adaptiveDifficulty !== 'expert') {
          const levels: AdaptiveDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
          const currentIndex = levels.indexOf(adaptiveDifficulty);
          setAdaptiveDifficulty(levels[currentIndex + 1]);
          alert(`Zorluk seviyesi artırıldı: ${levels[currentIndex + 1]}`);
        }
      } else {
        setConsecutiveWrong(prev => prev + 1);
        setConsecutiveCorrect(0);

        // Decrease difficulty after 3 consecutive wrong answers
        if (consecutiveWrong >= 2 && adaptiveDifficulty !== 'easy') {
          const levels: AdaptiveDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
          const currentIndex = levels.indexOf(adaptiveDifficulty);
          setAdaptiveDifficulty(levels[currentIndex - 1]);
          alert(`Zorluk seviyesi azaltıldı: ${levels[currentIndex - 1]}`);
        }
      }
    }
  };

  const handleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handlePause = () => {
    if (!exam?.settings.allowPause) {
      alert('Bu sınavda duraklatma izni yok!');
      return;
    }
    setIsPaused(!isPaused);
  };

  const handleSubmit = () => {
    if (!confirm('Sınavı teslim etmek istediğinizden emin misiniz?')) {
      return;
    }

    // Calculate score with negative marking and partial credit
    let totalScore = 0;
    
    exam?.questions.forEach(question => {
      const answer = answers[question.id];
      
      if (answer) {
        const isCorrect = question.correctAnswer === answer;
        
        if (isCorrect) {
          totalScore += question.points;
        } else if (exam.settings.negativeMarking) {
          const negValue = exam.settings.negativeMarkingValue || 0.25;
          totalScore -= question.points * negValue;
        }
      }
    });

    alert(`Sınav teslim edildi!\nPuanınız: ${totalScore.toFixed(2)}\nİhlal Sayısı: ${proctoring.violations.length}`);
    navigate('/exams');
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Sınav yükleniyor...</div>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">{exam.subject} • {exam.grade}. Sınıf</p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Adaptive difficulty indicator */}
              {exam.examMode === 'adaptive' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                  <span className="text-sm font-medium">Zorluk: {adaptiveDifficulty}</span>
                </div>
              )}

              {/* Pause button */}
              {exam.settings.allowPause && (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Devam Et' : 'Duraklat'}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Soru {currentQuestion + 1} / {exam.questions.length}</span>
              <span>{progress.toFixed(0)}% Tamamlandı</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Panel (if enabled) */}
      {exam.proctoring.enabled && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Camera className={`w-4 h-4 ${proctoring.webcamEnabled ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">Kamera: {proctoring.faceDetected ? '✓ Yüz tespit edildi' : '✗ Yüz tespit edilemedi'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Monitor className={`w-4 h-4 ${proctoring.isFullscreen ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">Tam Ekran: {proctoring.isFullscreen ? '✓ Aktif' : '✗ Pasif'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">İhlal: {proctoring.violations.length}</span>
                </div>
              </div>

              {proctoring.multipleFaces && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Birden fazla kişi tespit edildi!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Question header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">
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
                  <span className="text-sm text-gray-500">{question.points} puan</span>
                </div>

                <button
                  onClick={() => handleFlag(question.id)}
                  className={`p-2 rounded-lg transition ${
                    flaggedQuestions.has(question.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Question text */}
              <div className="prose max-w-none mb-6">
                <p className="text-lg text-gray-800">{question.question}</p>
              </div>

              {/* Answer options */}
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-3">
                  {question.options.map(option => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        answers[question.id] === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() => handleAnswer(question.id, option.id)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-gray-800">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    answers[question.id] === 'true'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="true"
                      checked={answers[question.id] === 'true'}
                      onChange={() => handleAnswer(question.id, 'true')}
                      className="w-5 h-5 text-green-600"
                    />
                    <span className="text-gray-800">Doğru</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    answers[question.id] === 'false'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="false"
                      checked={answers[question.id] === 'false'}
                      onChange={() => handleAnswer(question.id, 'false')}
                      className="w-5 h-5 text-red-600"
                    />
                    <span className="text-gray-800">Yanlış</span>
                  </label>
                </div>
              )}

              {/* Scoring info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doğru cevap:</span>
                    <span className="font-medium text-green-600">+{question.points} puan</span>
                  </div>
                  {exam.settings.negativeMarking && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yanlış cevap:</span>
                      <span className="font-medium text-red-600">
                        -{(question.points * (exam.settings.negativeMarkingValue || 0.25)).toFixed(2)} puan
                      </span>
                    </div>
                  )}
                  {exam.settings.partialCredit && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kısmi puan:</span>
                      <span className="font-medium text-orange-600">Uygulanabilir</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0 || !exam.settings.allowBackNavigation}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Önceki
              </button>

              {currentQuestion === exam.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Send className="w-5 h-5" />
                  Sınavı Teslim Et
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sonraki
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Question navigator & Webcam */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {/* Webcam feed */}
          {exam.proctoring.enabled && exam.proctoring.webcamRequired && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Kamera
              </h3>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded-lg bg-black"
              />
            </div>
          )}

          {/* Question navigator */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Sorular</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-lg font-medium text-sm transition ${
                    idx === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[q.id]
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : flaggedQuestions.has(q.id)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                  {flaggedQuestions.has(q.id) && <Flag className="w-3 h-3 mx-auto mt-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Violations list */}
          {exam.proctoring.enabled && proctoring.violations.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                İhlaller ({proctoring.violations.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {proctoring.violations.map(violation => (
                  <div
                    key={violation.id}
                    className={`p-2 rounded text-sm ${
                      violation.severity === 'high' ? 'bg-red-50 border border-red-200' :
                      violation.severity === 'medium' ? 'bg-orange-50 border border-orange-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{violation.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(violation.timestamp).toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning modal */}
      {showWarning && timeRemaining > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Süre Uyarısı</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sınav sürenizin son 5 dakikası! Lütfen cevaplarınızı kontrol edin.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

