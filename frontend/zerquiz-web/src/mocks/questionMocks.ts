import { MockApiService } from '../lib/mockApi';
import { generateUUID } from '../lib/mockStorage';

// ==================== TYPES ====================

export interface QuestionFormatType {
  id: string;
  code: string;
  name: string;
  description?: string;
  answerType: string;
  minOptions?: number;
  maxOptions?: number;
  requiresOptions: boolean;
  supportsMultipleAnswers: boolean;
  configSchema?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionPresentationType {
  id: string;
  code: string;
  name: string;
  description?: string;
  answerType: string;
  minOptions?: number;
  maxOptions?: number;
  hideOptionLabelsInPreview: boolean;
  requiresAnswer: boolean;
  configSchema?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionDifficultyLevel {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  formatTypeId: string;
  presentationTypeId?: string;
  difficultyLevelId?: string;
  subjectId?: string;
  topicId?: string;
  learningOutcomeId?: string;
  
  content: {
    stem: { text: string; latex?: string; html?: string };
    options?: Array<{ key: string; text: string; latex?: string; html?: string; isCorrect?: boolean }>;
    correctAnswers?: string[];
    explanation?: string;
  };
  
  metadata: {
    bloomTaxonomy?: string;
    estimatedTime?: number;
    tags?: string[];
  };
  
  status: 'draft' | 'review' | 'published' | 'archived';
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== SEED DATA ====================

const formatTypesSeedData: Omit<QuestionFormatType, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    code: 'multiple_choice',
    name: 'Çoktan Seçmeli',
    description: 'Birden fazla seçenekten doğru olanı seçme',
    answerType: 'options',
    minOptions: 2,
    maxOptions: 10,
    requiresOptions: true,
    supportsMultipleAnswers: false,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    code: 'true_false',
    name: 'Doğru / Yanlış',
    description: 'İfadenin doğru mu yanlış mı olduğunu belirleme',
    answerType: 'boolean',
    requiresOptions: false,
    supportsMultipleAnswers: false,
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    code: 'multiple_answer',
    name: 'Çoklu Cevap',
    description: 'Birden fazla doğru cevap seçme',
    answerType: 'options',
    minOptions: 2,
    maxOptions: 10,
    requiresOptions: true,
    supportsMultipleAnswers: true,
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    code: 'fill_blank',
    name: 'Boşluk Doldurma',
    description: 'Metindeki boşlukları tamamlama',
    answerType: 'text_input',
    requiresOptions: false,
    supportsMultipleAnswers: false,
    displayOrder: 4,
  },
  {
    id: generateUUID(),
    code: 'short_answer',
    name: 'Kısa Yanıt',
    description: 'Kısa metin cevabı verme',
    answerType: 'text_input',
    requiresOptions: false,
    supportsMultipleAnswers: false,
    displayOrder: 5,
  },
  {
    id: generateUUID(),
    code: 'essay',
    name: 'Uzun Yanıt / Kompozisyon',
    description: 'Detaylı açıklama gerektiren sorular',
    answerType: 'text_input',
    requiresOptions: false,
    supportsMultipleAnswers: false,
    displayOrder: 6,
  },
  {
    id: generateUUID(),
    code: 'matching',
    name: 'Eşleştirme',
    description: 'İki liste arasındaki öğeleri eşleştirme',
    answerType: 'matching',
    requiresOptions: true,
    supportsMultipleAnswers: false,
    displayOrder: 7,
  },
  {
    id: generateUUID(),
    code: 'ordering',
    name: 'Sıralama',
    description: 'Öğeleri doğru sıraya dizme',
    answerType: 'ordering',
    requiresOptions: true,
    supportsMultipleAnswers: false,
    displayOrder: 8,
  },
];

const difficultyLevelsSeedData: Omit<QuestionDifficultyLevel, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    code: 'very_easy',
    name: 'Çok Kolay',
    description: 'Temel bilgi düzeyi',
    color: '#10B981',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    code: 'easy',
    name: 'Kolay',
    description: 'Temel kavram ve bilgi',
    color: '#3B82F6',
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    code: 'medium',
    name: 'Orta',
    description: 'Uygulama ve analiz',
    color: '#F59E0B',
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    code: 'hard',
    name: 'Zor',
    description: 'Sentez ve değerlendirme',
    color: '#EF4444',
    displayOrder: 4,
  },
  {
    id: generateUUID(),
    code: 'very_hard',
    name: 'Çok Zor',
    description: 'Üst düzey analitik düşünme',
    color: '#7C3AED',
    displayOrder: 5,
  },
];

const presentationTypesSeedData: Omit<QuestionPresentationType, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    code: 'text_only',
    name: 'Sadece Metin',
    answerType: 'options',
    hideOptionLabelsInPreview: false,
    requiresAnswer: true,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    code: 'text_image',
    name: 'Metin + Görsel',
    answerType: 'options',
    hideOptionLabelsInPreview: false,
    requiresAnswer: true,
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    code: 'image_only',
    name: 'Sadece Görsel',
    answerType: 'options',
    hideOptionLabelsInPreview: false,
    requiresAnswer: true,
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    code: 'video',
    name: 'Video',
    answerType: 'options',
    hideOptionLabelsInPreview: false,
    requiresAnswer: true,
    displayOrder: 4,
  },
  {
    id: generateUUID(),
    code: 'audio',
    name: 'Ses',
    answerType: 'options',
    hideOptionLabelsInPreview: false,
    requiresAnswer: true,
    displayOrder: 5,
  },
];

// ==================== MOCK SERVICES ====================

class QuestionFormatTypeService extends MockApiService<QuestionFormatType> {
  constructor() {
    super('question_format_types', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(formatTypesSeedData as QuestionFormatType[]);
    }
  }
}

class QuestionDifficultyLevelService extends MockApiService<QuestionDifficultyLevel> {
  constructor() {
    super('question_difficulty_levels', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(difficultyLevelsSeedData as QuestionDifficultyLevel[]);
    }
  }
}

class QuestionPresentationTypeService extends MockApiService<QuestionPresentationType> {
  constructor() {
    super('question_presentation_types', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(presentationTypesSeedData as QuestionPresentationType[]);
    }
  }
}

class QuestionService extends MockApiService<Question> {
  constructor() {
    super('questions', 500);
    if (this.storage.getAll().length === 0) {
      this.seedDemoQuestions();
    }
  }

  private seedDemoQuestions() {
    const formatTypes = formatTypesSeedData;
    const difficultyLevels = difficultyLevelsSeedData;
    
    const demoQuestions: Omit<Question, 'createdAt' | 'updatedAt'>[] = [
      {
        id: generateUUID(),
        formatTypeId: formatTypes[0].id, // multiple_choice
        difficultyLevelId: difficultyLevels[1].id, // easy
        content: {
          stem: {
            text: 'Aşağıdakilerden hangisi bir programlama dilidir?',
          },
          options: [
            { key: 'A', text: 'HTML', isCorrect: false },
            { key: 'B', text: 'CSS', isCorrect: false },
            { key: 'C', text: 'Python', isCorrect: true },
            { key: 'D', text: 'JSON', isCorrect: false },
          ],
          correctAnswers: ['C'],
          explanation: 'Python bir programlama dilidir. HTML ve CSS markup dilleri, JSON ise veri formatıdır.',
        },
        metadata: {
          bloomTaxonomy: 'Knowledge',
          estimatedTime: 60,
          tags: ['programlama', 'temel'],
        },
        status: 'published',
        version: 1,
      },
      {
        id: generateUUID(),
        formatTypeId: formatTypes[0].id, // multiple_choice
        difficultyLevelId: difficultyLevels[2].id, // medium
        content: {
          stem: {
            text: 'Bir dairenin alanı \\(\\pi r^2\\) formülü ile hesaplanır. Yarıçapı 5 cm olan bir dairenin alanı kaç \\(cm^2\\) dir? (\\(\\pi = 3.14\\) alınız)',
            latex: '\\pi r^2',
          },
          options: [
            { key: 'A', text: '15.7', isCorrect: false },
            { key: 'B', text: '31.4', isCorrect: false },
            { key: 'C', text: '78.5', isCorrect: true },
            { key: 'D', text: '157', isCorrect: false },
          ],
          correctAnswers: ['C'],
          explanation: 'Alan = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 cm²',
        },
        metadata: {
          bloomTaxonomy: 'Application',
          estimatedTime: 120,
          tags: ['matematik', 'geometri', 'alan'],
        },
        status: 'published',
        version: 1,
      },
      {
        id: generateUUID(),
        formatTypeId: formatTypes[1].id, // true_false
        difficultyLevelId: difficultyLevels[0].id, // very_easy
        content: {
          stem: {
            text: 'İstanbul, Türkiye\'nin başkentidir.',
          },
          correctAnswers: ['false'],
          explanation: 'Yanlış. Türkiye\'nin başkenti Ankara\'dır.',
        },
        metadata: {
          bloomTaxonomy: 'Knowledge',
          estimatedTime: 30,
          tags: ['coğrafya', 'genel kültür'],
        },
        status: 'published',
        version: 1,
      },
      {
        id: generateUUID(),
        formatTypeId: formatTypes[2].id, // multiple_answer
        difficultyLevelId: difficultyLevels[2].id, // medium
        content: {
          stem: {
            text: 'Aşağıdakilerden hangileri frontend teknolojileridir? (Birden fazla doğru cevap)',
          },
          options: [
            { key: 'A', text: 'React', isCorrect: true },
            { key: 'B', text: 'Node.js', isCorrect: false },
            { key: 'C', text: 'Vue.js', isCorrect: true },
            { key: 'D', text: 'MongoDB', isCorrect: false },
            { key: 'E', text: 'Angular', isCorrect: true },
          ],
          correctAnswers: ['A', 'C', 'E'],
          explanation: 'React, Vue.js ve Angular frontend framework\'leridir. Node.js backend, MongoDB veritabanıdır.',
        },
        metadata: {
          bloomTaxonomy: 'Comprehension',
          estimatedTime: 90,
          tags: ['web geliştirme', 'frontend'],
        },
        status: 'published',
        version: 1,
      },
      {
        id: generateUUID(),
        formatTypeId: formatTypes[5].id, // essay
        difficultyLevelId: difficultyLevels[3].id, // hard
        content: {
          stem: {
            text: 'Clean Architecture\'ın temel prensiplerini ve avantajlarını açıklayınız. En az 3 örnek vererek yazınız.',
          },
          explanation: 'Clean Architecture: Bağımsızlık, test edilebilirlik, framework bağımsızlığı gibi konular açıklanmalıdır.',
        },
        metadata: {
          bloomTaxonomy: 'Analysis',
          estimatedTime: 600,
          tags: ['yazılım mimarisi', 'clean architecture'],
        },
        status: 'draft',
        version: 1,
      },
    ];

    this.seed(demoQuestions as Question[]);
  }
}

// ==================== EXPORT ====================

export const questionFormatTypeService = new QuestionFormatTypeService();
export const questionDifficultyLevelService = new QuestionDifficultyLevelService();
export const questionPresentationTypeService = new QuestionPresentationTypeService();
export const questionService = new QuestionService();

