/**
 * Question Pool & Randomization Mock Data
 * Soru havuzu ve rastgele soru seçme sistemi
 */

import { Question } from './questionMocks';

export interface QuestionPool {
  id: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  totalQuestions: number;
  questions: Question[];
  selectionStrategy: 'random' | 'weighted' | 'sequential' | 'adaptive';
  weightConfig?: {
    easy: number;
    medium: number;
    hard: number;
  };
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  usageCount: number;
}

export interface RandomizationSettings {
  enableRandomization: boolean;
  questionOrderRandomization: boolean; // Soru sırası karıştırma
  optionOrderRandomization: boolean; // Şık sırası karıştırma
  generateVariants: boolean; // A, B, C, D kitapçıkları
  variantCount: number; // Kaç varyant oluşturulacak
  poolBasedSelection: boolean; // Havuzdan rastgele çekme
  minQuestions: number; // Minimum soru sayısı
  maxQuestions: number; // Maksimum soru sayısı
}

export interface ExamVariant {
  id: string;
  examId: string;
  variantCode: string; // A, B, C, D, etc.
  questions: Question[];
  answerKey: AnswerKey[];
  createdAt: Date;
}

export interface AnswerKey {
  questionId: string;
  questionOrder: number;
  correctAnswer: string | string[]; // Multiple choice veya multiple select
}

// Demo Soru Havuzları
export const mockQuestionPools: QuestionPool[] = [
  {
    id: 'pool-001',
    name: 'TYT Matematik - Temel Düzey',
    description: 'TYT matematik konuları için temel seviye soru havuzu',
    category: 'Matematik',
    subject: 'TYT Matematik',
    difficulty: 'easy',
    totalQuestions: 50,
    questions: [], // Gerçekte Question[] dizisi olacak
    selectionStrategy: 'random',
    tags: ['tyt', 'matematik', 'temel'],
    createdBy: 'Admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-20'),
    isPublic: true,
    usageCount: 156,
  },
  {
    id: 'pool-002',
    name: 'AYT Fizik - Elektrik ve Manyetizma',
    description: 'AYT fizik elektrik ve manyetizma konuları',
    category: 'Fizik',
    subject: 'AYT Fizik',
    difficulty: 'hard',
    totalQuestions: 40,
    questions: [],
    selectionStrategy: 'weighted',
    weightConfig: {
      easy: 20,
      medium: 50,
      hard: 30,
    },
    tags: ['ayt', 'fizik', 'elektrik', 'manyetizma'],
    createdBy: 'Admin',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-11-21'),
    isPublic: true,
    usageCount: 89,
  },
  {
    id: 'pool-003',
    name: 'LGS Türkçe - Okuma Anlama',
    description: 'LGS türkçe okuma anlama soruları',
    category: 'Türkçe',
    subject: 'LGS Türkçe',
    difficulty: 'medium',
    totalQuestions: 60,
    questions: [],
    selectionStrategy: 'random',
    tags: ['lgs', 'türkçe', 'okuma'],
    createdBy: 'Admin',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-11-22'),
    isPublic: true,
    usageCount: 134,
  },
  {
    id: 'pool-004',
    name: 'TYT Fen - Karma Konular',
    description: 'TYT fen bilimleri tüm konular',
    category: 'Fen Bilimleri',
    subject: 'TYT Fen',
    difficulty: 'mixed',
    totalQuestions: 80,
    questions: [],
    selectionStrategy: 'adaptive',
    tags: ['tyt', 'fen', 'karma'],
    createdBy: 'Admin',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-11-23'),
    isPublic: true,
    usageCount: 201,
  },
];

// Randomization Functions
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const selectRandomQuestions = (
  pool: Question[],
  count: number,
  difficulty?: 'easy' | 'medium' | 'hard'
): Question[] => {
  let filteredPool = pool;
  
  if (difficulty) {
    filteredPool = pool.filter(q => q.difficulty === difficulty);
  }
  
  const shuffled = shuffleArray(filteredPool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const selectWeightedQuestions = (
  pool: Question[],
  totalCount: number,
  weights: { easy: number; medium: number; hard: number }
): Question[] => {
  const easyCount = Math.round((totalCount * weights.easy) / 100);
  const mediumCount = Math.round((totalCount * weights.medium) / 100);
  const hardCount = totalCount - easyCount - mediumCount;
  
  const easyQuestions = selectRandomQuestions(pool, easyCount, 'easy');
  const mediumQuestions = selectRandomQuestions(pool, mediumCount, 'medium');
  const hardQuestions = selectRandomQuestions(pool, hardCount, 'hard');
  
  return shuffleArray([...easyQuestions, ...mediumQuestions, ...hardQuestions]);
};

export const generateExamVariants = (
  questions: Question[],
  settings: RandomizationSettings
): ExamVariant[] => {
  const variants: ExamVariant[] = [];
  
  for (let i = 0; i < settings.variantCount; i++) {
    const variantCode = String.fromCharCode(65 + i); // A, B, C, D...
    
    let variantQuestions = [...questions];
    
    // Soru sırasını karıştır
    if (settings.questionOrderRandomization) {
      variantQuestions = shuffleArray(variantQuestions);
    }
    
    // Şık sırasını karıştır (her soru için)
    if (settings.optionOrderRandomization) {
      variantQuestions = variantQuestions.map(q => {
        if (q.type === 'multiple_choice' && q.options) {
          return {
            ...q,
            options: shuffleArray(q.options),
          };
        }
        return q;
      });
    }
    
    // Cevap anahtarı oluştur
    const answerKey: AnswerKey[] = variantQuestions.map((q, index) => ({
      questionId: q.id,
      questionOrder: index + 1,
      correctAnswer: q.correctAnswer || '',
    }));
    
    variants.push({
      id: `variant-${i + 1}`,
      examId: 'exam-001', // Demo
      variantCode: variantCode,
      questions: variantQuestions,
      answerKey: answerKey,
      createdAt: new Date(),
    });
  }
  
  return variants;
};

export const getPoolStats = (pool: QuestionPool) => {
  // Gerçek implementasyonda questions dizisinden hesaplanacak
  return {
    totalQuestions: pool.totalQuestions,
    easy: Math.floor(pool.totalQuestions * 0.3),
    medium: Math.floor(pool.totalQuestions * 0.5),
    hard: Math.floor(pool.totalQuestions * 0.2),
    categories: ['Teori', 'Problem', 'Analiz'],
    avgDifficulty: pool.difficulty === 'mixed' ? 'Karma' : pool.difficulty,
  };
};

export const validatePoolSelection = (
  pool: QuestionPool,
  requestedCount: number
): { valid: boolean; message: string } => {
  if (requestedCount > pool.totalQuestions) {
    return {
      valid: false,
      message: `Havuzda ${pool.totalQuestions} soru var, ${requestedCount} soru talep edildi.`,
    };
  }
  
  if (requestedCount < 1) {
    return {
      valid: false,
      message: 'En az 1 soru seçilmelidir.',
    };
  }
  
  return {
    valid: true,
    message: 'Havuz seçimi geçerli.',
  };
};

// Mock Functions for Demo
export const createExamFromPool = (
  poolId: string,
  questionCount: number,
  settings: RandomizationSettings
): { success: boolean; examId?: string; variants?: ExamVariant[]; error?: string } => {
  const pool = mockQuestionPools.find(p => p.id === poolId);
  
  if (!pool) {
    return { success: false, error: 'Havuz bulunamadı.' };
  }
  
  const validation = validatePoolSelection(pool, questionCount);
  if (!validation.valid) {
    return { success: false, error: validation.message };
  }
  
  // Demo: Rastgele sorular seç
  // Gerçek implementasyonda pool.questions'dan seçilecek
  const selectedQuestions = Array.from({ length: questionCount }, (_, i) => ({
    id: `q-${i + 1}`,
    text: `Soru ${i + 1} - ${pool.name}`,
    type: 'multiple_choice' as const,
    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
    points: 1,
    options: [
      { id: 'a', text: 'A şıkkı', isCorrect: i % 4 === 0 },
      { id: 'b', text: 'B şıkkı', isCorrect: i % 4 === 1 },
      { id: 'c', text: 'C şıkkı', isCorrect: i % 4 === 2 },
      { id: 'd', text: 'D şıkkı', isCorrect: i % 4 === 3 },
    ],
    correctAnswer: String.fromCharCode(97 + (i % 4)), // a, b, c, d
  }));
  
  let variants: ExamVariant[] = [];
  if (settings.generateVariants) {
    variants = generateExamVariants(selectedQuestions, settings);
  }
  
  return {
    success: true,
    examId: `exam-${Date.now()}`,
    variants: variants.length > 0 ? variants : undefined,
  };
};

