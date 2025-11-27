import { generateUUID } from '../lib/mockStorage';

// ==================== DEMO SORU VERİLERİ ====================

export interface DemoQuestion {
  id: string;
  tenantId: string;
  code: string;
  formatTypeId: string;
  formatTypeName: string;
  difficultyLevelId: string;
  difficultyLevelName: string;
  pedagogicalTypeId: string;
  pedagogicalTypeName: string;
  presentationStyleId?: string;
  presentationStyleName?: string;
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  learningOutcomeId?: string;
  learningOutcomeName?: string;
  headerText?: string;
  questionText: string;
  options?: Array<{
    key: string;
    text: string;
    isCorrect: boolean;
    feedback?: string;
  }>;
  explanation?: string;
  correctAnswer?: string;
  bloomTaxonomyLevel?: number;
  estimatedTimeInSeconds?: number;
  weight: number;
  tags?: string[];
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  reviewStatus?: 'pending' | 'in_review' | 'approved' | 'rejected';
  viewCount: number;
  usageCount: number;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

// Demo kullanıcılar
const AUTHORS = [
  { id: 'user-001', name: 'Ahmet Yılmaz' },
  { id: 'user-002', name: 'Ayşe Demir' },
  { id: 'user-003', name: 'Mehmet Kaya' },
  { id: 'user-004', name: 'Fatma Çelik' },
  { id: 'user-005', name: 'Ali Şahin' },
];

// Demo branşlar
const SUBJECTS = [
  { id: 'math', name: 'Matematik' },
  { id: 'physics', name: 'Fizik' },
  { id: 'chemistry', name: 'Kimya' },
  { id: 'biology', name: 'Biyoloji' },
  { id: 'turkish', name: 'Türkçe' },
  { id: 'english', name: 'İngilizce' },
  { id: 'history', name: 'Tarih' },
  { id: 'geography', name: 'Coğrafya' },
];

// Demo konular
const TOPICS: Record<string, { id: string; name: string }[]> = {
  math: [
    { id: 'algebra', name: 'Cebir' },
    { id: 'geometry', name: 'Geometri' },
    { id: 'trigonometry', name: 'Trigonometri' },
    { id: 'calculus', name: 'Kalkülüs' },
  ],
  physics: [
    { id: 'mechanics', name: 'Mekanik' },
    { id: 'electricity', name: 'Elektrik' },
    { id: 'optics', name: 'Optik' },
  ],
  chemistry: [
    { id: 'organic', name: 'Organik Kimya' },
    { id: 'inorganic', name: 'İnorganik Kimya' },
  ],
  biology: [
    { id: 'genetics', name: 'Genetik' },
    { id: 'ecology', name: 'Ekoloji' },
  ],
  turkish: [
    { id: 'grammar', name: 'Dil Bilgisi' },
    { id: 'literature', name: 'Edebiyat' },
  ],
  english: [
    { id: 'grammar', name: 'Grammar' },
    { id: 'vocabulary', name: 'Vocabulary' },
  ],
};

// Demo soru tipleri
const QUESTION_TYPES = [
  { id: 'single_choice', name: 'Çoktan Seçmeli (Tek Doğru)' },
  { id: 'multiple_choice', name: 'Çoktan Seçmeli (Çoklu Doğru)' },
  { id: 'true_false', name: 'Doğru/Yanlış' },
  { id: 'short_answer', name: 'Kısa Cevap' },
  { id: 'essay', name: 'Uzun Cevap (Essay)' },
  { id: 'fill_blank', name: 'Boşluk Doldurma' },
];

// Demo zorluk seviyeleri
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Kolay' },
  { id: 'medium', name: 'Orta' },
  { id: 'hard', name: 'Zor' },
  { id: 'very_hard', name: 'Çok Zor' },
];

// Demo pedagojik tipler
const PEDAGOGICAL_TYPES = [
  { id: 'general', name: 'Genel Sorular' },
  { id: 'learning', name: 'Öğrenme Soruları' },
  { id: 'practice', name: 'Alıştırma Soruları' },
  { id: 'reinforcement', name: 'Pekiştirme Soruları' },
  { id: 'comprehension', name: 'Kavrama Soruları' },
];

// Demo statüler
const STATUSES: Array<'draft' | 'review' | 'approved' | 'published' | 'archived'> = [
  'draft',
  'review',
  'approved',
  'published',
  'published',
  'published', // Published çok olsun
];

// ==================== DEMO SORU ÜRETİCİ ====================

function generateRandomDate(startDate: Date, endDate: Date): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateQuestionCode(index: number): string {
  const year = new Date().getFullYear();
  return `Q-${year}-${String(index).padStart(5, '0')}`;
}

// ==================== SORU ŞABLONLARı ====================

const QUESTION_TEMPLATES = [
  // MATEMATİK SORULARI
  {
    subjectId: 'math',
    topicId: 'algebra',
    questions: [
      {
        questionText: '<p>2x + 5 = 13 denkleminde x kaçtır?</p>',
        options: [
          { key: 'A', text: '3', isCorrect: false },
          { key: 'B', text: '4', isCorrect: true },
          { key: 'C', text: '5', isCorrect: false },
          { key: 'D', text: '6', isCorrect: false },
        ],
        explanation: '<p>2x + 5 = 13<br>2x = 13 - 5<br>2x = 8<br>x = 4</p>',
        tags: ['cebir', 'denklem', 'temel'],
      },
      {
        questionText: '<p>x² - 5x + 6 = 0 denkleminin kökleri toplamı kaçtır?</p>',
        options: [
          { key: 'A', text: '2', isCorrect: false },
          { key: 'B', text: '3', isCorrect: false },
          { key: 'C', text: '5', isCorrect: true },
          { key: 'D', text: '6', isCorrect: false },
        ],
        explanation: '<p>İkinci dereceden denklemde köklerin toplamı: -b/a = -(-5)/1 = 5</p>',
        tags: ['cebir', 'ikinci derece denklem'],
      },
    ],
  },
  {
    subjectId: 'math',
    topicId: 'geometry',
    questions: [
      {
        questionText: '<p>Bir üçgenin iç açıları toplamı kaç derecedir?</p>',
        options: [
          { key: 'A', text: '90°', isCorrect: false },
          { key: 'B', text: '180°', isCorrect: true },
          { key: 'C', text: '270°', isCorrect: false },
          { key: 'D', text: '360°', isCorrect: false },
        ],
        explanation: '<p>Tüm üçgenlerde iç açılar toplamı her zaman 180 derecedir.</p>',
        tags: ['geometri', 'üçgen', 'temel'],
      },
      {
        questionText: '<p>Yarıçapı 5 cm olan bir dairenin çevresi kaç cm\'dir? (π = 3 alınız)</p>',
        options: [
          { key: 'A', text: '15 cm', isCorrect: false },
          { key: 'B', text: '30 cm', isCorrect: true },
          { key: 'C', text: '45 cm', isCorrect: false },
          { key: 'D', text: '60 cm', isCorrect: false },
        ],
        explanation: '<p>Daire çevresi: 2πr = 2 × 3 × 5 = 30 cm</p>',
        tags: ['geometri', 'daire', 'çevre'],
      },
    ],
  },
  // FİZİK SORULARI
  {
    subjectId: 'physics',
    topicId: 'mechanics',
    questions: [
      {
        questionText: '<p>Bir cismin hızı 10 m/s\'den 30 m/s\'ye 4 saniyede çıkıyorsa ivmesi kaç m/s² dir?</p>',
        options: [
          { key: 'A', text: '2.5 m/s²', isCorrect: false },
          { key: 'B', text: '5 m/s²', isCorrect: true },
          { key: 'C', text: '7.5 m/s²', isCorrect: false },
          { key: 'D', text: '10 m/s²', isCorrect: false },
        ],
        explanation: '<p>İvme (a) = (v₂ - v₁) / t = (30 - 10) / 4 = 20 / 4 = 5 m/s²</p>',
        tags: ['fizik', 'mekanik', 'ivme'],
      },
    ],
  },
  {
    subjectId: 'physics',
    topicId: 'electricity',
    questions: [
      {
        questionText: '<p>Ohm yasasına göre, direnç sabitken akım arttığında gerilim nasıl değişir?</p>',
        options: [
          { key: 'A', text: 'Azalır', isCorrect: false },
          { key: 'B', text: 'Artar', isCorrect: true },
          { key: 'C', text: 'Değişmez', isCorrect: false },
          { key: 'D', text: 'Önce artar sonra azalır', isCorrect: false },
        ],
        explanation: '<p>Ohm Yasası: V = I × R. Direnç (R) sabitken, akım (I) arttığında gerilim (V) de artar.</p>',
        tags: ['fizik', 'elektrik', 'ohm yasası'],
      },
    ],
  },
  // TÜRKÇE SORULARI
  {
    subjectId: 'turkish',
    topicId: 'grammar',
    questions: [
      {
        questionText: '<p>"Kitap okumak çok faydalıdır." cümlesinde özne nedir?</p>',
        options: [
          { key: 'A', text: 'Kitap', isCorrect: false },
          { key: 'B', text: 'Okumak', isCorrect: false },
          { key: 'C', text: 'Kitap okumak', isCorrect: true },
          { key: 'D', text: 'Çok faydalıdır', isCorrect: false },
        ],
        explanation: '<p>"Ne faydalıdır?" sorusunun cevabı olan "kitap okumak" özne görevindedir.</p>',
        tags: ['türkçe', 'dil bilgisi', 'özne'],
      },
      {
        questionText: '<p>Aşağıdakilerden hangisi birleşik fiildir?</p>',
        options: [
          { key: 'A', text: 'Koşmak', isCorrect: false },
          { key: 'B', text: 'Yemek yemek', isCorrect: true },
          { key: 'C', text: 'Gitmek', isCorrect: false },
          { key: 'D', text: 'Okumak', isCorrect: false },
        ],
        explanation: '<p>Birleşik fiil, iki veya daha fazla sözcükten oluşur. "Yemek yemek" birleşik fiildir.</p>',
        tags: ['türkçe', 'dil bilgisi', 'fiil'],
      },
    ],
  },
  // İNGİLİZCE SORULARI
  {
    subjectId: 'english',
    topicId: 'grammar',
    questions: [
      {
        questionText: '<p>Choose the correct form: "She _____ to school every day."</p>',
        options: [
          { key: 'A', text: 'go', isCorrect: false },
          { key: 'B', text: 'goes', isCorrect: true },
          { key: 'C', text: 'going', isCorrect: false },
          { key: 'D', text: 'went', isCorrect: false },
        ],
        explanation: '<p>Simple Present Tense, üçüncü tekil şahıs (she) ile kullanıldığında fiil sonuna "-s/-es" eklenir.</p>',
        tags: ['english', 'grammar', 'simple present'],
      },
    ],
  },
  // KİMYA SORULARI
  {
    subjectId: 'chemistry',
    topicId: 'organic',
    questions: [
      {
        questionText: '<p>Suyun kimyasal formülü nedir?</p>',
        options: [
          { key: 'A', text: 'H₂O', isCorrect: true },
          { key: 'B', text: 'CO₂', isCorrect: false },
          { key: 'C', text: 'O₂', isCorrect: false },
          { key: 'D', text: 'H₂O₂', isCorrect: false },
        ],
        explanation: '<p>Su molekülü 2 hidrojen (H) ve 1 oksijen (O) atomundan oluşur: H₂O</p>',
        tags: ['kimya', 'formül', 'temel'],
      },
    ],
  },
  // BİYOLOJİ SORULARI
  {
    subjectId: 'biology',
    topicId: 'genetics',
    questions: [
      {
        questionText: '<p>DNA\'nın tam adı nedir?</p>',
        options: [
          { key: 'A', text: 'Deoksiribonükleik Asit', isCorrect: true },
          { key: 'B', text: 'Ribonükleik Asit', isCorrect: false },
          { key: 'C', text: 'Amino Asit', isCorrect: false },
          { key: 'D', text: 'Nükleik Asit', isCorrect: false },
        ],
        explanation: '<p>DNA, Deoksiribonükleik Asit\'in (Deoxyribonucleic Acid) kısaltmasıdır.</p>',
        tags: ['biyoloji', 'genetik', 'DNA'],
      },
    ],
  },
];

// ==================== DEMO SORULARI OLUŞTUR ====================

export function generateDemoQuestions(count: number = 50): DemoQuestion[] {
  const questions: DemoQuestion[] = [];
  let questionIndex = 1;

  // Önce template'lerden sorular oluştur
  QUESTION_TEMPLATES.forEach((template) => {
    const subject = SUBJECTS.find((s) => s.id === template.subjectId);
    const topics = TOPICS[template.subjectId] || [];
    const topic = topics.find((t) => t.id === template.topicId);

    template.questions.forEach((q) => {
      const author = getRandomItem(AUTHORS);
      const questionType = getRandomItem(QUESTION_TYPES);
      const difficulty = getRandomItem(DIFFICULTY_LEVELS);
      const pedagogical = getRandomItem(PEDAGOGICAL_TYPES);
      const status = getRandomItem(STATUSES);

      const createdAt = generateRandomDate(
        new Date('2024-01-01'),
        new Date('2024-11-27')
      );
      const updatedAt = generateRandomDate(new Date(createdAt), new Date());

      questions.push({
        id: generateUUID(),
        tenantId: DEFAULT_TENANT_ID,
        code: generateQuestionCode(questionIndex++),
        formatTypeId: questionType.id,
        formatTypeName: questionType.name,
        difficultyLevelId: difficulty.id,
        difficultyLevelName: difficulty.name,
        pedagogicalTypeId: pedagogical.id,
        pedagogicalTypeName: pedagogical.name,
        subjectId: subject?.id,
        subjectName: subject?.name,
        topicId: topic?.id,
        topicName: topic?.name,
        questionText: q.questionText,
        options: q.options,
        explanation: q.explanation,
        bloomTaxonomyLevel: Math.floor(Math.random() * 6) + 1,
        estimatedTimeInSeconds: Math.floor(Math.random() * 240) + 60, // 60-300 saniye
        weight: 1.0,
        tags: q.tags,
        status: status,
        reviewStatus: status === 'review' ? 'pending' : status === 'approved' ? 'approved' : undefined,
        viewCount: Math.floor(Math.random() * 500),
        usageCount: Math.floor(Math.random() * 100),
        createdBy: author.id,
        createdByName: author.name,
        createdAt,
        updatedAt,
        publishedAt: status === 'published' ? updatedAt : undefined,
      });
    });
  });

  // Kalan soruları rastgele oluştur
  while (questions.length < count) {
    const author = getRandomItem(AUTHORS);
    const subject = getRandomItem(SUBJECTS);
    const topics = TOPICS[subject.id] || [];
    const topic = topics.length > 0 ? getRandomItem(topics) : undefined;
    const questionType = getRandomItem(QUESTION_TYPES);
    const difficulty = getRandomItem(DIFFICULTY_LEVELS);
    const pedagogical = getRandomItem(PEDAGOGICAL_TYPES);
    const status = getRandomItem(STATUSES);

    const createdAt = generateRandomDate(
      new Date('2024-01-01'),
      new Date('2024-11-27')
    );
    const updatedAt = generateRandomDate(new Date(createdAt), new Date());

    questions.push({
      id: generateUUID(),
      tenantId: DEFAULT_TENANT_ID,
      code: generateQuestionCode(questionIndex++),
      formatTypeId: questionType.id,
      formatTypeName: questionType.name,
      difficultyLevelId: difficulty.id,
      difficultyLevelName: difficulty.name,
      pedagogicalTypeId: pedagogical.id,
      pedagogicalTypeName: pedagogical.name,
      subjectId: subject.id,
      subjectName: subject.name,
      topicId: topic?.id,
      topicName: topic?.name,
      questionText: `<p>Bu ${subject.name} sorusudur. ${topic ? topic.name + ' konusundan' : ''}</p>`,
      options: [
        { key: 'A', text: 'Seçenek A', isCorrect: true },
        { key: 'B', text: 'Seçenek B', isCorrect: false },
        { key: 'C', text: 'Seçenek C', isCorrect: false },
        { key: 'D', text: 'Seçenek D', isCorrect: false },
      ],
      explanation: '<p>Bu sorunun açıklaması burada yer alır.</p>',
      bloomTaxonomyLevel: Math.floor(Math.random() * 6) + 1,
      estimatedTimeInSeconds: Math.floor(Math.random() * 240) + 60,
      weight: 1.0,
      tags: [subject.name.toLowerCase(), topic?.name.toLowerCase() || ''].filter(Boolean),
      status: status,
      reviewStatus: status === 'review' ? 'pending' : status === 'approved' ? 'approved' : undefined,
      viewCount: Math.floor(Math.random() * 500),
      usageCount: Math.floor(Math.random() * 100),
      createdBy: author.id,
      createdByName: author.name,
      createdAt,
      updatedAt,
      publishedAt: status === 'published' ? updatedAt : undefined,
    });
  }

  return questions;
}

// ==================== EXPORT ====================

export const demoQuestions = generateDemoQuestions(50);

// Filtreleme için yardımcı fonksiyonlar
export const getDemoSubjects = () => SUBJECTS;
export const getDemoTopics = (subjectId?: string) => {
  if (!subjectId) return Object.values(TOPICS).flat();
  return TOPICS[subjectId] || [];
};
export const getDemoQuestionTypes = () => QUESTION_TYPES;
export const getDemoDifficultyLevels = () => DIFFICULTY_LEVELS;
export const getDemoPedagogicalTypes = () => PEDAGOGICAL_TYPES;
export const getDemoAuthors = () => AUTHORS;

