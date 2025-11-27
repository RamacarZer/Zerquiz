import { generateUUID } from '../lib/mockStorage';
import { demoExams, getExamQuestions } from './examDemoData';
import { demoQuestions } from './questionDemoData';

// ==================== SINAV OTURUMU VERİLERİ ====================

export interface ExamSession {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  bookletVariant: string; // A, B, C, D
  startTime: string;
  endTime?: string;
  remainingTime: number; // saniye
  status: 'in_progress' | 'completed' | 'submitted' | 'timed_out';
  answers: Record<string, StudentAnswer>; // questionId -> answer
  currentQuestionIndex: number;
  flaggedQuestions: string[]; // işaretlenen sorular
  visitedQuestions: string[]; // ziyaret edilen sorular
  autoSaveInterval: number; // saniye
  lastSaveTime: string;
}

export interface StudentAnswer {
  questionId: string;
  answerId?: string; // Tek seçenekli için
  answerIds?: string[]; // Çoklu seçenekli için
  textAnswer?: string; // Açık uçlu için
  numericAnswer?: number; // Sayısal için
  answeredAt: string;
  timeSpent: number; // saniye
}

export interface SessionQuestion {
  id: string;
  order: number;
  questionId: string;
  points: number;
  questionData: any; // Full question data
}

// ==================== DEMO SESSION OLUŞTUR ====================

function createDemoSession(): ExamSession {
  const activeExam = demoExams.find((e) => e.status === 'active') || demoExams[0];
  const examQuestions = getExamQuestions(activeExam.id);
  
  const session: ExamSession = {
    id: generateUUID(),
    examId: activeExam.id,
    studentId: 'student-001',
    studentName: 'Demo Öğrenci',
    bookletVariant: 'A',
    startTime: new Date().toISOString(),
    remainingTime: activeExam.duration * 60, // dakika -> saniye
    status: 'in_progress',
    answers: {},
    currentQuestionIndex: 0,
    flaggedQuestions: [],
    visitedQuestions: [examQuestions[0]?.questionId || ''],
    autoSaveInterval: 30,
    lastSaveTime: new Date().toISOString(),
  };

  return session;
}

export const demoSession = createDemoSession();

// ==================== SESSION HELPERS ====================

export function getSessionQuestions(sessionId: string): SessionQuestion[] {
  const session = demoSession;
  const exam = demoExams.find((e) => e.id === session.examId);
  if (!exam) return [];

  const examQuestions = getExamQuestions(exam.id);
  
  return examQuestions.map((eq, index) => {
    const questionData = demoQuestions.find((q) => q.id === eq.questionId);
    return {
      id: eq.id,
      order: index + 1,
      questionId: eq.questionId,
      points: eq.points,
      questionData,
    };
  });
}

export function saveAnswer(
  sessionId: string,
  questionId: string,
  answer: Partial<StudentAnswer>
): void {
  const now = new Date().toISOString();
  demoSession.answers[questionId] = {
    questionId,
    ...answer,
    answeredAt: now,
    timeSpent: answer.timeSpent || 0,
  } as StudentAnswer;
  demoSession.lastSaveTime = now;
}

export function toggleFlag(sessionId: string, questionId: string): void {
  const index = demoSession.flaggedQuestions.indexOf(questionId);
  if (index > -1) {
    demoSession.flaggedQuestions.splice(index, 1);
  } else {
    demoSession.flaggedQuestions.push(questionId);
  }
}

export function markVisited(sessionId: string, questionId: string): void {
  if (!demoSession.visitedQuestions.includes(questionId)) {
    demoSession.visitedQuestions.push(questionId);
  }
}

export function submitSession(sessionId: string): void {
  demoSession.status = 'submitted';
  demoSession.endTime = new Date().toISOString();
  demoSession.remainingTime = 0;
}

export function getSessionStats(sessionId: string) {
  const questions = getSessionQuestions(sessionId);
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(demoSession.answers).length;
  const flaggedCount = demoSession.flaggedQuestions.length;
  const visitedCount = demoSession.visitedQuestions.length;
  const unansweredCount = totalQuestions - answeredCount;

  return {
    totalQuestions,
    answeredCount,
    unansweredCount,
    flaggedCount,
    visitedCount,
    progress: Math.round((answeredCount / totalQuestions) * 100),
  };
}

