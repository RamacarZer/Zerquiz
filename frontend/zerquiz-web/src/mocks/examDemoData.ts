import { generateUUID } from '../lib/mockStorage';
import { demoQuestions } from './questionDemoData';

// ==================== SINAV DEMO VERİLERİ ====================

export interface DemoExam {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description?: string;
  subjectId?: string;
  subjectName?: string;
  gradeLevel?: number;
  examType: 'quiz' | 'midterm' | 'final' | 'mock' | 'practice';
  duration: number; // dakika
  totalPoints: number;
  passingScore: number;
  instructions?: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
  questionCount: number;
  bookletCount: number;
  participantCount: number;
  completedCount: number;
  averageScore?: number;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  order: number;
  points: number;
  bookletVariant?: string; // A, B, C, D
}

export interface ExamBooklet {
  id: string;
  examId: string;
  variant: string; // A, B, C, D
  title: string;
  questions: ExamQuestion[];
  createdAt: string;
}

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

// Demo kullanıcılar
const EXAM_CREATORS = [
  { id: 'teacher-001', name: 'Mehmet Öğretmen' },
  { id: 'teacher-002', name: 'Ayşe Hoca' },
  { id: 'teacher-003', name: 'Ali Öğretmen' },
];

// Sınav tipleri
const EXAM_TYPES = [
  { value: 'quiz', label: '📝 Quiz (Kısa Sınav)', duration: 30 },
  { value: 'midterm', label: '📋 Ara Sınav', duration: 60 },
  { value: 'final', label: '📄 Final Sınavı', duration: 120 },
  { value: 'mock', label: '🎯 Deneme Sınavı', duration: 90 },
  { value: 'practice', label: '💪 Alıştırma', duration: 45 },
];

// Branşlar (questionDemoData'dan)
const EXAM_SUBJECTS = [
  { id: 'math', name: 'Matematik' },
  { id: 'physics', name: 'Fizik' },
  { id: 'chemistry', name: 'Kimya' },
  { id: 'turkish', name: 'Türkçe' },
  { id: 'english', name: 'İngilizce' },
];

// Sınıf seviyeleri
const GRADE_LEVELS = [5, 6, 7, 8, 9, 10, 11, 12];

// ==================== YARDIMCI FONKSİYONLAR ====================

function generateRandomDate(startDate: Date, endDate: Date): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateExamCode(index: number): string {
  const year = new Date().getFullYear();
  return `E-${year}-${String(index).padStart(4, '0')}`;
}

// ==================== DEMO SINAVLAR ====================

function generateDemoExams(count: number = 20): DemoExam[] {
  const exams: DemoExam[] = [];

  for (let i = 1; i <= count; i++) {
    const creator = getRandomItem(EXAM_CREATORS);
    const subject = getRandomItem(EXAM_SUBJECTS);
    const examType = getRandomItem(EXAM_TYPES);
    const gradeLevel = getRandomItem(GRADE_LEVELS);
    const questionCount = Math.floor(Math.random() * 30) + 10; // 10-40 soru
    const duration = examType.duration;
    const totalPoints = questionCount * 5; // Her soru 5 puan
    const passingScore = Math.floor(totalPoints * 0.6); // %60 geçme
    const bookletCount = Math.random() > 0.5 ? 4 : 1; // %50 şans 4 kitapçık

    const statuses: Array<'draft' | 'scheduled' | 'active' | 'completed' | 'archived'> = [
      'draft',
      'scheduled',
      'active',
      'completed',
      'completed',
      'completed', // Completed çok olsun
    ];
    const status = getRandomItem(statuses);

    const participantCount =
      status === 'completed' ? Math.floor(Math.random() * 100) + 20 : 0;
    const completedCount =
      status === 'completed' ? Math.floor(participantCount * 0.9) : 0;
    const averageScore =
      status === 'completed' ? Math.floor(Math.random() * 40) + 50 : undefined; // 50-90

    const createdAt = generateRandomDate(
      new Date('2024-09-01'),
      new Date('2024-11-27')
    );
    const updatedAt = generateRandomDate(new Date(createdAt), new Date());

    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (status === 'scheduled') {
      startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 gün sonra
      endDate = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(); // 14 gün sonra
    } else if (status === 'active') {
      startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(); // 1 gün önce
      endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 gün sonra
    } else if (status === 'completed') {
      startDate = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(); // 30 gün önce
      endDate = new Date(
        now.getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(); // 20 gün önce
    }

    exams.push({
      id: generateUUID(),
      tenantId: DEFAULT_TENANT_ID,
      code: generateExamCode(i),
      title: `${subject.name} ${examType.label.split(' ')[1]} - ${gradeLevel}. Sınıf`,
      description: `${gradeLevel}. sınıf ${subject.name} dersi için hazırlanmış ${examType.label.split(' ')[1].toLowerCase()} sınavı.`,
      subjectId: subject.id,
      subjectName: subject.name,
      gradeLevel,
      examType: examType.value as 'quiz' | 'midterm' | 'final' | 'mock' | 'practice',
      duration,
      totalPoints,
      passingScore,
      instructions: `Bu sınav ${questionCount} sorudan oluşmaktadır. Süreniz ${duration} dakikadır. Başarılar!`,
      shuffleQuestions: Math.random() > 0.3, // %70 karıştırma
      shuffleOptions: Math.random() > 0.2, // %80 karıştırma
      showResults: Math.random() > 0.5,
      showCorrectAnswers: Math.random() > 0.5,
      allowReview: Math.random() > 0.4,
      startDate,
      endDate,
      status,
      questionCount,
      bookletCount,
      participantCount,
      completedCount,
      averageScore,
      createdBy: creator.id,
      createdByName: creator.name,
      createdAt,
      updatedAt,
      publishedAt: status !== 'draft' ? updatedAt : undefined,
    });
  }

  return exams;
}

// ==================== SINAV SORULARI ====================

function generateExamQuestions(examId: string, count: number): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  const availableQuestions = demoQuestions.filter((q) => q.status === 'published');

  // Rastgele sorular seç
  const selectedQuestions = [];
  for (let i = 0; i < Math.min(count, availableQuestions.length); i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    selectedQuestions.push(availableQuestions[randomIndex]);
  }

  selectedQuestions.forEach((question, index) => {
    questions.push({
      id: generateUUID(),
      examId,
      questionId: question.id,
      order: index + 1,
      points: 5,
    });
  });

  return questions;
}

// ==================== KİTAPÇIKLAR ====================

function generateExamBooklets(examId: string, variantCount: number = 4): ExamBooklet[] {
  const booklets: ExamBooklet[] = [];
  const variants = ['A', 'B', 'C', 'D'];
  const baseQuestions = generateExamQuestions(examId, 20);

  for (let i = 0; i < variantCount; i++) {
    const variant = variants[i];
    
    // Soruları karıştır (her kitapçık farklı sırada)
    const shuffledQuestions = [...baseQuestions]
      .sort(() => Math.random() - 0.5)
      .map((q, index) => ({
        ...q,
        id: generateUUID(),
        order: index + 1,
        bookletVariant: variant,
      }));

    booklets.push({
      id: generateUUID(),
      examId,
      variant,
      title: `Kitapçık ${variant}`,
      questions: shuffledQuestions,
      createdAt: new Date().toISOString(),
    });
  }

  return booklets;
}

// ==================== EXPORT ====================

export const demoExams = generateDemoExams(20);

export function getExamById(id: string): DemoExam | undefined {
  return demoExams.find((exam) => exam.id === id);
}

export function getExamQuestions(examId: string): ExamQuestion[] {
  return generateExamQuestions(examId, 20);
}

export function getExamBooklets(examId: string, variantCount: number = 4): ExamBooklet[] {
  return generateExamBooklets(examId, variantCount);
}

export function getExamsByStatus(status: string): DemoExam[] {
  return demoExams.filter((exam) => exam.status === status);
}

export function getExamsBySubject(subjectId: string): DemoExam[] {
  return demoExams.filter((exam) => exam.subjectId === subjectId);
}

export const getExamTypes = () => EXAM_TYPES;
export const getExamSubjects = () => EXAM_SUBJECTS;
export const getGradeLevels = () => GRADE_LEVELS;
export const getExamCreators = () => EXAM_CREATORS;

// Sınav istatistikleri
export interface ExamStats {
  totalExams: number;
  draftCount: number;
  scheduledCount: number;
  activeCount: number;
  completedCount: number;
  archivedCount: number;
  totalParticipants: number;
  averageCompletionRate: number;
  averageScore: number;
}

export function getExamStats(): ExamStats {
  const totalExams = demoExams.length;
  const draftCount = demoExams.filter((e) => e.status === 'draft').length;
  const scheduledCount = demoExams.filter((e) => e.status === 'scheduled').length;
  const activeCount = demoExams.filter((e) => e.status === 'active').length;
  const completedCount = demoExams.filter((e) => e.status === 'completed').length;
  const archivedCount = demoExams.filter((e) => e.status === 'archived').length;

  const totalParticipants = demoExams.reduce(
    (sum, exam) => sum + exam.participantCount,
    0
  );

  const completedExams = demoExams.filter((e) => e.status === 'completed');
  const avgCompletionRate =
    completedExams.length > 0
      ? completedExams.reduce(
          (sum, exam) =>
            sum +
            (exam.participantCount > 0
              ? exam.completedCount / exam.participantCount
              : 0),
          0
        ) / completedExams.length
      : 0;

  const avgScore =
    completedExams.length > 0
      ? completedExams.reduce(
          (sum, exam) => sum + (exam.averageScore || 0),
          0
        ) / completedExams.length
      : 0;

  return {
    totalExams,
    draftCount,
    scheduledCount,
    activeCount,
    completedCount,
    archivedCount,
    totalParticipants,
    averageCompletionRate: Math.round(avgCompletionRate * 100),
    averageScore: Math.round(avgScore),
  };
}

