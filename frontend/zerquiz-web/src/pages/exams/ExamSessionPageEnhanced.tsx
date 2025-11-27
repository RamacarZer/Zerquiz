import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flag, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import ExamTimer from '../../components/exams/ExamTimer';
import QuestionNavigator from '../../components/exams/QuestionNavigator';
import {
  demoSession,
  getSessionQuestions,
  saveAnswer,
  toggleFlag,
  markVisited,
  submitSession,
  getSessionStats,
  type StudentAnswer,
} from '../../mocks/examSessionData';
import { demoExams } from '../../mocks/examDemoData';

export default function ExamSessionPageEnhanced() {
  const navigate = useNavigate();
  const { id: examId } = useParams();
  
  const [session, setSession] = useState(demoSession);
  const [questions, setQuestions] = useState(getSessionQuestions(session.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const exam = demoExams.find((e) => e.id === session.examId);
  const currentQuestion = questions[currentIndex];
  const stats = getSessionStats(session.id);

  useEffect(() => {
    // Load existing answer
    if (currentQuestion) {
      const existing = session.answers[currentQuestion.questionId];
      if (existing) {
        setSelectedAnswer(existing.answerId || '');
        setTextAnswer(existing.textAnswer || '');
      } else {
        setSelectedAnswer('');
        setTextAnswer('');
      }
      markVisited(session.id, currentQuestion.questionId);
    }
  }, [currentIndex, currentQuestion]);

  const handleAnswerSelect = (optionKey: string) => {
    setSelectedAnswer(optionKey);
    
    // Auto-save
    if (currentQuestion) {
      saveAnswer(session.id, currentQuestion.questionId, {
        answerId: optionKey,
        timeSpent: 0,
      });
      setSession({ ...session, answers: { ...session.answers } });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  const handleToggleFlag = () => {
    if (currentQuestion) {
      toggleFlag(session.id, currentQuestion.questionId);
      setSession({
        ...session,
        flaggedQuestions: [...session.flaggedQuestions],
      });
    }
  };

  const handleTimeUp = () => {
    alert('Süreniz doldu! Sınav otomatik olarak teslim ediliyor...');
    handleSubmit();
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleSubmit = () => {
    submitSession(session.id);
    navigate(`/exams/${session.examId}/results`);
  };

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Sınav yükleniyor...</p>
        </div>
      </div>
    );
  }

  const answeredQuestions = Object.keys(session.answers);
  const isFlagged = session.flaggedQuestions.includes(currentQuestion.questionId);
  const isAnswered = answeredQuestions.includes(currentQuestion.questionId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                {session.studentName} - Kitapçık {session.bookletVariant}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Soru <span className="font-bold text-gray-900">{currentIndex + 1}</span> / {questions.length}
              </div>
              <button
                onClick={handleSubmitClick}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
              >
                <Send className="h-4 w-4" />
                Sınavı Bitir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-4">
            <ExamTimer
              initialSeconds={session.remainingTime}
              onTimeUp={handleTimeUp}
              isPaused={false}
            />
            
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              answeredQuestions={answeredQuestions}
              flaggedQuestions={session.flaggedQuestions}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-4">
            {/* Question Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg font-bold">
                    {currentIndex + 1}
                  </span>
                  <div>
                    <div className="text-sm text-gray-600">Soru {currentIndex + 1}</div>
                    <div className="text-lg font-bold text-gray-900">{currentQuestion.points} Puan</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAnswered && (
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      ✓ Cevaplandı
                    </span>
                  )}
                  <button
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      isFlagged
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Flag className={`h-4 w-4 ${isFlagged ? 'fill-yellow-600' : ''}`} />
                    {isFlagged ? 'İşaretli' : 'İşaretle'}
                  </button>
                </div>
              </div>

              {/* Question Content */}
              {currentQuestion.questionData?.headerText && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.questionData.headerText }} />
                </div>
              )}

              <div className="mb-6">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.questionData?.questionText || 'Soru yükleniyor...' }}
                />
              </div>

              {/* Options */}
              {currentQuestion.questionData?.options && currentQuestion.questionData.options.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.questionData.options.map((option: any) => (
                    <label
                      key={option.key}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAnswer === option.key
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.key}
                        checked={selectedAnswer === option.key}
                        onChange={() => handleAnswerSelect(option.key)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                            {option.key}
                          </span>
                          <span className={`text-sm ${selectedAnswer === option.key ? 'font-medium text-blue-900' : 'text-gray-900'}`}>
                            {option.text}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                <ChevronLeft className="h-5 w-5" />
                Önceki Soru
              </button>

              <div className="text-sm text-gray-600">
                {stats.answeredCount} / {stats.totalQuestions} cevaplandı
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                Sonraki Soru
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSubmitModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sınavı Bitirmek İstediğinizden Emin misiniz?</h3>
                <p className="text-sm text-gray-600">
                  {stats.unansweredCount > 0 && (
                    <span className="block mb-2 text-orange-600 font-medium">
                      ⚠️ {stats.unansweredCount} soru boş!
                    </span>
                  )}
                  Sınavı bitirdikten sonra sorulara geri dönemezsiniz.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-gray-600">Toplam</div>
                  <div className="text-lg font-bold text-gray-900">{stats.totalQuestions}</div>
                </div>
                <div className="bg-green-50 rounded p-3 text-center">
                  <div className="text-green-600">Cevaplanan</div>
                  <div className="text-lg font-bold text-green-900">{stats.answeredCount}</div>
                </div>
                <div className="bg-red-50 rounded p-3 text-center">
                  <div className="text-red-600">Boş</div>
                  <div className="text-lg font-bold text-red-900">{stats.unansweredCount}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Evet, Bitir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

