import { MockApiService } from '../lib/mockApi';
import { generateUUID } from '../lib/mockStorage';

// ==================== TYPES ====================

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId?: string;
  topicId?: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  examType: 'online' | 'offline' | 'hybrid';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
  scheduledDate?: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  showResults: boolean;
  bookletCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  order: number;
  points: number;
  createdAt?: string;
}

export interface Booklet {
  id: string;
  examId: string;
  code: string; // A, B, C, D
  questionOrder: string[]; // question IDs in order
  createdAt?: string;
}

// ==================== SEED DATA ====================

const demoExamsSeedData: Omit<Exam, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    title: 'Matematik Ara Sınav',
    description: 'Cebir ve geometri konularını kapsayan ara sınav',
    duration: 60,
    totalQuestions: 20,
    totalPoints: 100,
    passingScore: 50,
    examType: 'online',
    status: 'scheduled',
    scheduledDate: '2025-12-15T10:00:00Z',
    shuffleQuestions: true,
    shuffleOptions: true,
    allowReview: true,
    showResults: true,
    bookletCount: 2,
  },
  {
    id: generateUUID(),
    title: 'Fizik Final Sınavı',
    description: 'Tüm dönem konularını içeren final sınavı',
    duration: 90,
    totalQuestions: 30,
    totalPoints: 150,
    passingScore: 75,
    examType: 'hybrid',
    status: 'draft',
    shuffleQuestions: true,
    shuffleOptions: false,
    allowReview: false,
    showResults: false,
    bookletCount: 4,
  },
  {
    id: generateUUID(),
    title: 'İngilizce Seviye Tespit',
    description: 'A1-B2 seviye belirleme testi',
    duration: 45,
    totalQuestions: 40,
    totalPoints: 100,
    passingScore: 60,
    examType: 'online',
    status: 'active',
    shuffleQuestions: false,
    shuffleOptions: true,
    allowReview: true,
    showResults: true,
    bookletCount: 1,
  },
];

// ==================== MOCK SERVICES ====================

class ExamService extends MockApiService<Exam> {
  constructor() {
    super('exams', 500);
    if (this.storage.getAll().length === 0) {
      this.seed(demoExamsSeedData as Exam[]);
    }
  }

  async getQuestions(examId: string): Promise<ExamQuestion[]> {
    // Mock exam questions
    return Array.from({ length: 10 }, (_, i) => ({
      id: generateUUID(),
      examId,
      questionId: generateUUID(),
      order: i,
      points: 10,
    }));
  }

  async getBooklets(examId: string): Promise<Booklet[]> {
    // Mock booklets
    return [
      {
        id: generateUUID(),
        examId,
        code: 'A',
        questionOrder: [],
      },
      {
        id: generateUUID(),
        examId,
        code: 'B',
        questionOrder: [],
      },
    ];
  }

  async generateBooklets(examId: string, count: number): Promise<Booklet[]> {
    // Mock booklet generation
    const letters = 'ABCDEFGH';
    return Array.from({ length: count }, (_, i) => ({
      id: generateUUID(),
      examId,
      code: letters[i],
      questionOrder: [],
      createdAt: new Date().toISOString(),
    }));
  }
}

export const examService = new ExamService();

