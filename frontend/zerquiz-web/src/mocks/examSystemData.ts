/**
 * Comprehensive Exam System Mock Data
 * Tam Gelişmiş Sınav Yönetim Sistemi
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ExamType = 'practice' | 'mock' | 'official' | 'quiz' | 'assessment';
export type ExamStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'ordering';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type GradingType = 'auto' | 'manual' | 'hybrid';
export type ExamMode = 'classic' | 'adaptive' | 'timed' | 'practice';

export interface ExamDefinition {
  id: string;
  title: string;
  description: string;
  examType: ExamType;
  examMode: ExamMode;
  subject: string;
  grade: string;
  duration: number; // minutes
  totalPoints: number;
  passingScore: number;
  questionCount: number;
  questions: ExamQuestion[];
  settings: ExamSettings;
  instructions: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status: ExamStatus;
  tags: string[];
  allowedAttempts: number;
  showResults: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  proctoring: ProctoringSettings;
}

export interface ExamQuestion {
  id: string;
  order: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  points: number;
  question: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  tags: string[];
  timeLimit?: number; // seconds
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface ExamSettings {
  allowBackNavigation: boolean;
  showQuestionNumbers: boolean;
  showProgressBar: boolean;
  autoSubmit: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  allowCalculator: boolean;
  allowNotes: boolean;
  allowPause: boolean;
  maxPauseDuration?: number; // minutes
  warningTime: number; // minutes before end
  grading: GradingType;
  negativeMarking: boolean;
  negativeMarkingValue?: number;
  partialCredit: boolean;
}

export interface ProctoringSettings {
  enabled: boolean;
  webcamRequired: boolean;
  screenRecording: boolean;
  tabSwitchDetection: boolean;
  fullscreenRequired: boolean;
  idVerification: boolean;
  browserLock: boolean;
}

export interface ExamSession {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  status: 'in_progress' | 'paused' | 'submitted' | 'timed_out' | 'cancelled';
  answers: StudentAnswer[];
  timeSpent: number; // seconds
  remainingTime: number; // seconds
  currentQuestion: number;
  score?: number;
  percentage?: number;
  flaggedQuestions: string[];
  violations: ProctoringViolation[];
  ipAddress: string;
  userAgent: string;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
  timeSpent: number; // seconds
  attempts: number;
  flagged: boolean;
  answeredAt: string;
}

export interface ProctoringViolation {
  id: string;
  type: 'tab_switch' | 'exit_fullscreen' | 'multiple_faces' | 'no_face' | 'suspicious_behavior';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  screenshot?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  grade: string;
  passed: boolean;
  submittedAt: string;
  timeSpent: number; // seconds
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  questionResults: QuestionResult[];
  feedback?: string;
  certificates?: string[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation?: string;
  timeSpent: number;
}

export interface ExamAnalytics {
  examId: string;
  totalAttempts: number;
  averageScore: number;
  averageTime: number;
  passRate: number;
  completionRate: number;
  questionStatistics: QuestionStatistics[];
  difficultyDistribution: Record<DifficultyLevel, number>;
  scoreDistribution: { range: string; count: number }[];
  topPerformers: { studentId: string; name: string; score: number }[];
  improvements: string[];
}

export interface QuestionStatistics {
  questionId: string;
  question: string;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  averageTime: number;
  difficulty: DifficultyLevel;
  discrimination: number; // 0-1
  reliability: number; // 0-1
}

// ============================================
// DEMO EXAMS
// ============================================

export const demoExams: ExamDefinition[] = [
  {
    id: 'exam-001',
    title: 'TYT Matematik Deneme Sınavı - 1',
    description: 'TYT Matematik konularını kapsayan kapsamlı deneme sınavı',
    examType: 'mock',
    examMode: 'timed',
    subject: 'Matematik',
    grade: '12',
    duration: 40,
    totalPoints: 100,
    passingScore: 60,
    questionCount: 40,
    questions: [
      {
        id: 'q-001',
        order: 1,
        type: 'multiple_choice',
        difficulty: 'easy',
        points: 2.5,
        question: '5 + 3 × 2 işleminin sonucu kaçtır?',
        options: [
          { id: 'opt-001-a', text: '16', isCorrect: false },
          { id: 'opt-001-b', text: '11', isCorrect: true },
          { id: 'opt-001-c', text: '13', isCorrect: false },
          { id: 'opt-001-d', text: '10', isCorrect: false },
        ],
        correctAnswer: 'opt-001-b',
        explanation: 'Önce çarpma işlemi yapılır: 3 × 2 = 6, sonra toplama: 5 + 6 = 11',
        tags: ['temel işlemler', 'işlem önceliği'],
      },
      {
        id: 'q-002',
        order: 2,
        type: 'multiple_choice',
        difficulty: 'medium',
        points: 2.5,
        question: 'x² - 5x + 6 = 0 denkleminin kökleri toplamı kaçtır?',
        options: [
          { id: 'opt-002-a', text: '5', isCorrect: true },
          { id: 'opt-002-b', text: '-5', isCorrect: false },
          { id: 'opt-002-c', text: '6', isCorrect: false },
          { id: 'opt-002-d', text: '-6', isCorrect: false },
        ],
        correctAnswer: 'opt-002-a',
        explanation: 'İkinci dereceden denklemde kökler toplamı: -b/a = -(-5)/1 = 5',
        tags: ['denklem', 'ikinci derece'],
        timeLimit: 90,
      },
      {
        id: 'q-003',
        order: 3,
        type: 'true_false',
        difficulty: 'easy',
        points: 2.5,
        question: 'Bir dikdörtgenin karşılıklı kenarları eşittir.',
        correctAnswer: 'true',
        explanation: 'Dikdörtgenin tanımı gereği karşılıklı kenarları eşittir.',
        tags: ['geometri', 'dikdörtgen'],
      },
      {
        id: 'q-004',
        order: 4,
        type: 'multiple_choice',
        difficulty: 'medium',
        points: 2.5,
        question: 'Bir üçgenin iç açıları toplamı kaç derecedir?',
        options: [
          { id: 'opt-004-a', text: '90°', isCorrect: false },
          { id: 'opt-004-b', text: '180°', isCorrect: true },
          { id: 'opt-004-c', text: '270°', isCorrect: false },
          { id: 'opt-004-d', text: '360°', isCorrect: false },
        ],
        correctAnswer: 'opt-004-b',
        explanation: 'Tüm üçgenlerde iç açılar toplamı 180 derecedir.',
        tags: ['geometri', 'üçgen'],
      },
      {
        id: 'q-005',
        order: 5,
        type: 'multiple_choice',
        difficulty: 'hard',
        points: 2.5,
        question: '(2x + 3)(x - 4) işleminin sonucu nedir?',
        options: [
          { id: 'opt-005-a', text: '2x² - 5x - 12', isCorrect: true },
          { id: 'opt-005-b', text: '2x² + 5x - 12', isCorrect: false },
          { id: 'opt-005-c', text: '2x² - 5x + 12', isCorrect: false },
          { id: 'opt-005-d', text: '2x² + 11x - 12', isCorrect: false },
        ],
        correctAnswer: 'opt-005-a',
        explanation: '(2x + 3)(x - 4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12',
        tags: ['cebir', 'çarpanlara ayırma'],
      },
    ],
    settings: {
      allowBackNavigation: true,
      showQuestionNumbers: true,
      showProgressBar: true,
      autoSubmit: true,
      randomizeQuestions: false,
      randomizeOptions: true,
      allowCalculator: true,
      allowNotes: false,
      allowPause: true,
      maxPauseDuration: 5,
      warningTime: 5,
      grading: 'auto',
      negativeMarking: false,
      partialCredit: false,
    },
    instructions: [
      'Sınav 40 dakika sürmektedir',
      'Toplam 40 soru bulunmaktadır',
      'Her soru 2.5 puandır',
      'Hesap makinesi kullanabilirsiniz',
      'Geri dönüş yapabilirsiniz',
      'Süre bitiminde otomatik olarak teslim edilecektir',
    ],
    createdBy: 'Prof. Dr. Ahmet Yılmaz',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-20T15:30:00Z',
    scheduledStart: '2024-12-01T09:00:00Z',
    scheduledEnd: '2024-12-01T18:00:00Z',
    status: 'scheduled',
    tags: ['TYT', 'Matematik', 'Deneme'],
    allowedAttempts: 3,
    showResults: true,
    shuffleQuestions: false,
    shuffleOptions: true,
    proctoring: {
      enabled: false,
      webcamRequired: false,
      screenRecording: false,
      tabSwitchDetection: false,
      fullscreenRequired: false,
      idVerification: false,
      browserLock: false,
    },
  },
  {
    id: 'exam-002',
    title: 'LGS Türkçe Quiz',
    description: '8. Sınıf Türkçe konuları hızlı değerlendirme',
    examType: 'quiz',
    examMode: 'practice',
    subject: 'Türkçe',
    grade: '8',
    duration: 15,
    totalPoints: 50,
    passingScore: 30,
    questionCount: 10,
    questions: [],
    settings: {
      allowBackNavigation: true,
      showQuestionNumbers: true,
      showProgressBar: true,
      autoSubmit: false,
      randomizeQuestions: true,
      randomizeOptions: true,
      allowCalculator: false,
      allowNotes: false,
      allowPause: false,
      warningTime: 2,
      grading: 'auto',
      negativeMarking: false,
      partialCredit: true,
    },
    instructions: [
      'Quiz 15 dakika sürmektedir',
      'Toplam 10 soru bulunmaktadır',
      'Sorular rastgele sıralanmıştır',
    ],
    createdBy: 'Mehmet Kaya',
    createdAt: '2024-11-15T14:00:00Z',
    updatedAt: '2024-11-25T10:00:00Z',
    status: 'active',
    tags: ['LGS', 'Türkçe', 'Quiz'],
    allowedAttempts: -1, // unlimited
    showResults: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    proctoring: {
      enabled: false,
      webcamRequired: false,
      screenRecording: false,
      tabSwitchDetection: false,
      fullscreenRequired: false,
      idVerification: false,
      browserLock: false,
    },
  },
  {
    id: 'exam-003',
    title: 'AYT Fizik Yerçekimi ve Hareket',
    description: 'Yerçekimi ve hareket konularında kapsamlı değerlendirme',
    examType: 'official',
    examMode: 'classic',
    subject: 'Fizik',
    grade: '12',
    duration: 60,
    totalPoints: 120,
    passingScore: 70,
    questionCount: 30,
    questions: [],
    settings: {
      allowBackNavigation: false,
      showQuestionNumbers: true,
      showProgressBar: true,
      autoSubmit: true,
      randomizeQuestions: false,
      randomizeOptions: false,
      allowCalculator: true,
      allowNotes: true,
      allowPause: false,
      warningTime: 10,
      grading: 'hybrid',
      negativeMarking: true,
      negativeMarkingValue: 0.25,
      partialCredit: true,
    },
    instructions: [
      'Sınav 60 dakika sürmektedir',
      'Geri dönüş YAPILAMAZ',
      'Yanlış cevaplar için 0.25 puan düşülecektir',
      'Hesap makinesi ve not defteri kullanabilirsiniz',
      'Tam ekran modunda çıkmak yasaktır',
    ],
    createdBy: 'Dr. Ayşe Demir',
    createdAt: '2024-10-20T09:00:00Z',
    updatedAt: '2024-11-28T16:00:00Z',
    scheduledStart: '2024-12-10T10:00:00Z',
    scheduledEnd: '2024-12-10T11:30:00Z',
    status: 'scheduled',
    tags: ['AYT', 'Fizik', 'Resmi Sınav'],
    allowedAttempts: 1,
    showResults: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    proctoring: {
      enabled: true,
      webcamRequired: true,
      screenRecording: true,
      tabSwitchDetection: true,
      fullscreenRequired: true,
      idVerification: true,
      browserLock: true,
    },
  },
];

// ============================================
// DEMO SESSIONS
// ============================================

export const demoSessions: ExamSession[] = [
  {
    id: 'session-001',
    examId: 'exam-001',
    examTitle: 'TYT Matematik Deneme Sınavı - 1',
    studentId: 'student-001',
    studentName: 'Ali Yılmaz',
    startedAt: '2024-11-28T10:00:00Z',
    status: 'in_progress',
    answers: [
      {
        questionId: 'q-001',
        answer: 'opt-001-b',
        isCorrect: true,
        pointsEarned: 2.5,
        timeSpent: 45,
        attempts: 1,
        flagged: false,
        answeredAt: '2024-11-28T10:01:30Z',
      },
    ],
    timeSpent: 300,
    remainingTime: 2100,
    currentQuestion: 2,
    flaggedQuestions: [],
    violations: [],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome',
  },
];

// ============================================
// DEMO RESULTS
// ============================================

export const demoResults: ExamResult[] = [
  {
    id: 'result-001',
    examId: 'exam-001',
    examTitle: 'TYT Matematik Deneme Sınavı - 1',
    sessionId: 'session-001',
    studentId: 'student-001',
    studentName: 'Ali Yılmaz',
    score: 75,
    totalPoints: 100,
    percentage: 75,
    grade: 'B',
    passed: true,
    submittedAt: '2024-11-28T10:40:00Z',
    timeSpent: 2100,
    correctAnswers: 30,
    incorrectAnswers: 8,
    unanswered: 2,
    questionResults: [],
    feedback: 'İyi bir performans sergiledini. Özellikle geometri sorularında başarılısın.',
  },
];

// ============================================
// DEMO ANALYTICS
// ============================================

export const demoAnalytics: ExamAnalytics = {
  examId: 'exam-001',
  totalAttempts: 150,
  averageScore: 68.5,
  averageTime: 2250,
  passRate: 72.5,
  completionRate: 95.3,
  questionStatistics: [],
  difficultyDistribution: {
    easy: 10,
    medium: 20,
    hard: 8,
    expert: 2,
  },
  scoreDistribution: [
    { range: '0-20', count: 5 },
    { range: '21-40', count: 15 },
    { range: '41-60', count: 35 },
    { range: '61-80', count: 60 },
    { range: '81-100', count: 35 },
  ],
  topPerformers: [
    { studentId: 'st-001', name: 'Zeynep Kaya', score: 98 },
    { studentId: 'st-002', name: 'Mehmet Demir', score: 95 },
    { studentId: 'st-003', name: 'Ayşe Şahin', score: 92 },
  ],
  improvements: [
    'Soru 15 ve 23 çok zor bulundu, gözden geçirilmeli',
    'Ortalama süre hedeflenenin üzerinde, süre ayarı yapılabilir',
    'Geometri sorularında başarı oranı yüksek',
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getExamById(id: string): ExamDefinition | undefined {
  return demoExams.find(e => e.id === id);
}

export function getExamsByStatus(status: ExamStatus): ExamDefinition[] {
  return demoExams.filter(e => e.status === status);
}

export function getExamsByType(type: ExamType): ExamDefinition[] {
  return demoExams.filter(e => e.examType === type);
}

export function getActiveExams(): ExamDefinition[] {
  return demoExams.filter(e => e.status === 'active' || e.status === 'scheduled');
}

export function getSessionById(id: string): ExamSession | undefined {
  return demoSessions.find(s => s.id === id);
}

export function getSessionsByStudent(studentId: string): ExamSession[] {
  return demoSessions.filter(s => s.studentId === studentId);
}

export function getResultsByExam(examId: string): ExamResult[] {
  return demoResults.filter(r => r.examId === examId);
}

export function getResultsByStudent(studentId: string): ExamResult[] {
  return demoResults.filter(r => r.studentId === studentId);
}

export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function getExamStatistics() {
  return {
    totalExams: demoExams.length,
    activeExams: getExamsByStatus('active').length,
    scheduledExams: getExamsByStatus('scheduled').length,
    completedExams: getExamsByStatus('completed').length,
    totalSessions: demoSessions.length,
    activeSessions: demoSessions.filter(s => s.status === 'in_progress').length,
    totalResults: demoResults.length,
    averagePassRate: demoResults.length > 0 
      ? (demoResults.filter(r => r.passed).length / demoResults.length) * 100 
      : 0,
  };
}

export function createExamSession(exam: ExamDefinition, studentId: string, studentName: string): ExamSession {
  return {
    id: `session-${Date.now()}`,
    examId: exam.id,
    examTitle: exam.title,
    studentId,
    studentName,
    startedAt: new Date().toISOString(),
    status: 'in_progress',
    answers: [],
    timeSpent: 0,
    remainingTime: exam.duration * 60,
    currentQuestion: 0,
    flaggedQuestions: [],
    violations: [],
    ipAddress: '127.0.0.1',
    userAgent: navigator.userAgent,
  };
}

