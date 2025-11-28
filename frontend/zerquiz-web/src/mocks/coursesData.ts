/**
 * Comprehensive Courses & Presentations Management System Mock Data
 * Ders + Sunum + Deneme Paketleri - TYT, AYT, LGS, KPSS vb.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ExamType = 'TYT' | 'AYT' | 'LGS' | 'KPSS' | 'DGS' | 'ALES' | 'YDS' | 'YÖKDİL' | 'MSÜ' | 'GENEL';
export type CourseType = 'video' | 'live' | 'hybrid' | 'recorded';
export type PricingType = 'free' | 'paid' | 'subscription' | 'one_time';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface CoursePackage {
  id: string;
  name: string;
  description: string;
  examType: ExamType;
  subject: string;
  packageType: 'course_only' | 'course_presentation' | 'course_presentation_exam' | 'full_package';
  pricingType: PricingType;
  price: number;
  discountPrice?: number;
  currency: string;
  duration: number; // Total hours
  lessonCount: number;
  presentationCount: number;
  examCount: number;
  questionCount: number;
  difficulty: DifficultyLevel;
  instructor: string;
  instructorId: string;
  thumbnailUrl?: string;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  status: ContentStatus;
  features: string[];
  prerequisites?: string[];
  learningOutcomes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  certificateIncluded: boolean;
}

export interface Lesson {
  id: string;
  packageId: string;
  title: string;
  description: string;
  type: CourseType;
  order: number;
  duration: number; // Minutes
  videoUrl?: string;
  liveSchedule?: string;
  resources: LessonResource[];
  quizCount: number;
  isCompleted?: boolean;
  isFree: boolean;
  viewCount: number;
  likeCount: number;
}

export interface LessonResource {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'video' | 'audio' | 'link';
  url: string;
  size?: string;
}

export interface Presentation {
  id: string;
  packageId: string;
  title: string;
  description: string;
  slideCount: number;
  duration: number; // Minutes
  type: 'interactive' | 'static' | 'video_presentation';
  thumbnailUrl?: string;
  downloadUrl?: string;
  viewCount: number;
  downloadCount: number;
  isFree: boolean;
  createdAt: string;
}

export interface PracticeExam {
  id: string;
  packageId: string;
  title: string;
  description: string;
  examType: ExamType;
  questionCount: number;
  duration: number; // Minutes
  totalPoints: number;
  passingScore: number;
  difficulty: DifficultyLevel;
  attemptCount: number;
  avgScore?: number;
  isFree: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  packageId: string;
  packageName: string;
  userId: string;
  userName: string;
  enrolledAt: string;
  expiresAt?: string;
  progress: number; // Percentage
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
  certificateEarned: boolean;
  certificateId?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  experience: string;
  rating: number;
  studentCount: number;
  courseCount: number;
  certifications: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// ============================================
// MOCK DATA - INSTRUCTORS
// ============================================

export const demoInstructors: Instructor[] = [
  {
    id: 'inst-001',
    name: 'Prof. Dr. Ahmet Yılmaz',
    title: 'Matematik Uzmanı',
    bio: '15 yıllık öğretmenlik deneyimi, 50.000+ öğrenci yetiştirdi',
    expertise: ['TYT Matematik', 'AYT Matematik', 'Geometri', 'Analiz'],
    experience: '15 yıl',
    rating: 4.9,
    studentCount: 52340,
    courseCount: 45,
    certifications: ['Eğitim Yönetimi Sertifikası', 'Online Eğitim Uzmanı'],
  },
  {
    id: 'inst-002',
    name: 'Dr. Ayşe Demir',
    title: 'Fizik ve Kimya Öğretmeni',
    bio: 'Üniversite mezunları ile 10 yıllık deneyim',
    expertise: ['TYT Fizik', 'AYT Fizik', 'Kimya'],
    experience: '10 yıl',
    rating: 4.8,
    studentCount: 38900,
    courseCount: 32,
    certifications: ['Bilim Eğitimi Uzmanı'],
  },
  {
    id: 'inst-003',
    name: 'Mehmet Kaya',
    title: 'Türkçe ve Edebiyat Uzmanı',
    bio: 'LGS ve TYT Türkçe konusunda uzman eğitmen',
    expertise: ['LGS Türkçe', 'TYT Türkçe', 'Edebiyat'],
    experience: '12 yıl',
    rating: 4.7,
    studentCount: 45200,
    courseCount: 28,
    certifications: ['Dil Eğitimi Sertifikası'],
  },
];

// ============================================
// MOCK DATA - COURSE PACKAGES
// ============================================

export const demoCoursePackages: CoursePackage[] = [
  // TYT PACKAGES
  {
    id: 'pkg-tyt-001',
    name: 'TYT Matematik Tam Paket',
    description: 'Ders + Sunum + 20 Deneme ile TYT Matematik\'te zirveye çıkın',
    examType: 'TYT',
    subject: 'Matematik',
    packageType: 'full_package',
    pricingType: 'paid',
    price: 1299,
    discountPrice: 999,
    currency: 'TRY',
    duration: 80,
    lessonCount: 40,
    presentationCount: 40,
    examCount: 20,
    questionCount: 800,
    difficulty: 'intermediate',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.9,
    reviewCount: 2341,
    enrolledCount: 8920,
    status: 'published',
    features: [
      '40 saat canlı ders',
      '40 interaktif sunum',
      '20 tam deneme sınavı',
      '800 özgün soru',
      'Sınırsız tekrar izleme',
      'Sertifika',
      'WhatsApp destek grubu',
      'Ders notları PDF'
    ],
    prerequisites: ['Temel matematik bilgisi'],
    learningOutcomes: [
      'TYT Matematik müfredatını eksiksiz öğrenme',
      'Hızlı problem çözme teknikleri',
      'Sınav stratejileri',
      'Net artırma teknikleri'
    ],
    tags: ['TYT', 'Matematik', 'Tam Paket', 'Canlı Ders', 'Deneme'],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-20',
    publishedAt: '2024-02-01',
    expiresAt: '2025-06-30',
    certificateIncluded: true,
  },
  {
    id: 'pkg-tyt-002',
    name: 'TYT Matematik Ders + Sunum',
    description: 'Video dersler ve interaktif sunumlarla TYT Matematik',
    examType: 'TYT',
    subject: 'Matematik',
    packageType: 'course_presentation',
    pricingType: 'paid',
    price: 799,
    discountPrice: 599,
    currency: 'TRY',
    duration: 60,
    lessonCount: 30,
    presentationCount: 30,
    examCount: 0,
    questionCount: 0,
    difficulty: 'beginner',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.7,
    reviewCount: 1892,
    enrolledCount: 6543,
    status: 'published',
    features: [
      '30 saat video ders',
      '30 interaktif sunum',
      'Ders notları',
      '6 ay erişim'
    ],
    learningOutcomes: [
      'TYT Matematik temel konuları',
      'Konu anlatımı ve örnekler'
    ],
    tags: ['TYT', 'Matematik', 'Video Ders'],
    createdAt: '2024-02-10',
    updatedAt: '2024-11-18',
    publishedAt: '2024-02-20',
    expiresAt: '2025-06-30',
    certificateIncluded: false,
  },
  {
    id: 'pkg-tyt-003',
    name: 'TYT Matematik Sadece Ders',
    description: 'Video derslerle TYT Matematik konu anlatımı',
    examType: 'TYT',
    subject: 'Matematik',
    packageType: 'course_only',
    pricingType: 'paid',
    price: 499,
    currency: 'TRY',
    duration: 40,
    lessonCount: 25,
    presentationCount: 0,
    examCount: 0,
    questionCount: 0,
    difficulty: 'beginner',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.6,
    reviewCount: 987,
    enrolledCount: 4321,
    status: 'published',
    features: [
      '25 saat video ders',
      'Ders notları PDF',
      '3 ay erişim'
    ],
    learningOutcomes: ['TYT Matematik konu anlatımı'],
    tags: ['TYT', 'Matematik', 'Video Ders'],
    createdAt: '2024-03-01',
    updatedAt: '2024-11-15',
    publishedAt: '2024-03-10',
    expiresAt: '2025-06-30',
    certificateIncluded: false,
  },
  {
    id: 'pkg-tyt-004',
    name: 'TYT Türkçe Tam Paket - ÜCRETSİZ',
    description: 'Ücretsiz TYT Türkçe hazırlık paketi',
    examType: 'TYT',
    subject: 'Türkçe',
    packageType: 'full_package',
    pricingType: 'free',
    price: 0,
    currency: 'TRY',
    duration: 30,
    lessonCount: 15,
    presentationCount: 15,
    examCount: 5,
    questionCount: 200,
    difficulty: 'beginner',
    instructor: 'Mehmet Kaya',
    instructorId: 'inst-003',
    rating: 4.5,
    reviewCount: 5432,
    enrolledCount: 23456,
    status: 'published',
    features: [
      '15 saat video ders',
      '15 sunum',
      '5 deneme sınavı',
      'Tamamen ücretsiz'
    ],
    learningOutcomes: ['TYT Türkçe temel konular'],
    tags: ['TYT', 'Türkçe', 'Ücretsiz'],
    createdAt: '2024-01-01',
    updatedAt: '2024-11-25',
    publishedAt: '2024-01-05',
    certificateIncluded: false,
  },

  // AYT PACKAGES
  {
    id: 'pkg-ayt-001',
    name: 'AYT Matematik Tam Paket',
    description: 'Ders + Sunum + 30 Deneme ile AYT Matematik\'te başarı',
    examType: 'AYT',
    subject: 'Matematik',
    packageType: 'full_package',
    pricingType: 'paid',
    price: 1599,
    discountPrice: 1299,
    currency: 'TRY',
    duration: 100,
    lessonCount: 50,
    presentationCount: 50,
    examCount: 30,
    questionCount: 1200,
    difficulty: 'advanced',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.9,
    reviewCount: 1876,
    enrolledCount: 6789,
    status: 'published',
    features: [
      '50 saat canlı ders',
      '50 interaktif sunum',
      '30 tam deneme',
      '1200 özgün soru',
      'Sınırsız erişim',
      'Sertifika',
      'Özel WhatsApp grubu'
    ],
    learningOutcomes: [
      'AYT Matematik ileri seviye konular',
      'Zor soru çözüm teknikleri',
      'Sınav stratejileri'
    ],
    tags: ['AYT', 'Matematik', 'Tam Paket', 'İleri Seviye'],
    createdAt: '2024-02-01',
    updatedAt: '2024-11-22',
    publishedAt: '2024-02-15',
    expiresAt: '2025-07-31',
    certificateIncluded: true,
  },
  {
    id: 'pkg-ayt-002',
    name: 'AYT Fizik Ders + Deneme',
    description: 'Video dersler ve 15 deneme sınavı',
    examType: 'AYT',
    subject: 'Fizik',
    packageType: 'course_presentation_exam',
    pricingType: 'paid',
    price: 899,
    discountPrice: 699,
    currency: 'TRY',
    duration: 60,
    lessonCount: 30,
    presentationCount: 30,
    examCount: 15,
    questionCount: 600,
    difficulty: 'intermediate',
    instructor: 'Dr. Ayşe Demir',
    instructorId: 'inst-002',
    rating: 4.8,
    reviewCount: 1234,
    enrolledCount: 5432,
    status: 'published',
    features: [
      '30 saat video ders',
      '30 sunum',
      '15 deneme sınavı',
      'Detaylı çözümler'
    ],
    learningOutcomes: ['AYT Fizik konu anlatımı', 'Deneme çözümleri'],
    tags: ['AYT', 'Fizik', 'Video Ders', 'Deneme'],
    createdAt: '2024-03-15',
    updatedAt: '2024-11-20',
    publishedAt: '2024-03-25',
    expiresAt: '2025-07-31',
    certificateIncluded: false,
  },

  // LGS PACKAGES
  {
    id: 'pkg-lgs-001',
    name: 'LGS Matematik Mega Paket',
    description: 'Ders + Sunum + 25 Deneme ile LGS\'de zirvede olun',
    examType: 'LGS',
    subject: 'Matematik',
    packageType: 'full_package',
    pricingType: 'paid',
    price: 999,
    discountPrice: 799,
    currency: 'TRY',
    duration: 70,
    lessonCount: 35,
    presentationCount: 35,
    examCount: 25,
    questionCount: 750,
    difficulty: 'intermediate',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.8,
    reviewCount: 3456,
    enrolledCount: 12345,
    status: 'published',
    features: [
      '35 saat canlı ders',
      '35 animasyonlu sunum',
      '25 deneme sınavı',
      '750 soru',
      'Veli bilgilendirme',
      'Sertifika'
    ],
    learningOutcomes: [
      'LGS Matematik tam müfredat',
      'Hızlı çözüm teknikleri',
      'Deneme stratejileri'
    ],
    tags: ['LGS', 'Matematik', 'Tam Paket', '8. Sınıf'],
    createdAt: '2024-01-20',
    updatedAt: '2024-11-23',
    publishedAt: '2024-02-01',
    expiresAt: '2025-06-15',
    certificateIncluded: true,
  },
  {
    id: 'pkg-lgs-002',
    name: 'LGS Türkçe Temel Paket - ÜCRETSİZ',
    description: 'Ücretsiz LGS Türkçe hazırlık',
    examType: 'LGS',
    subject: 'Türkçe',
    packageType: 'course_presentation',
    pricingType: 'free',
    price: 0,
    currency: 'TRY',
    duration: 25,
    lessonCount: 12,
    presentationCount: 12,
    examCount: 0,
    questionCount: 0,
    difficulty: 'beginner',
    instructor: 'Mehmet Kaya',
    instructorId: 'inst-003',
    rating: 4.6,
    reviewCount: 4567,
    enrolledCount: 18900,
    status: 'published',
    features: [
      '12 saat video ders',
      '12 sunum',
      'Ders notları',
      'Ücretsiz erişim'
    ],
    learningOutcomes: ['LGS Türkçe temel konular'],
    tags: ['LGS', 'Türkçe', 'Ücretsiz', '8. Sınıf'],
    createdAt: '2024-02-01',
    updatedAt: '2024-11-24',
    publishedAt: '2024-02-10',
    certificateIncluded: false,
  },

  // KPSS PACKAGES
  {
    id: 'pkg-kpss-001',
    name: 'KPSS Genel Yetenek Tam Paket',
    description: 'KPSS GY için kapsamlı hazırlık paketi',
    examType: 'KPSS',
    subject: 'Genel Yetenek',
    packageType: 'full_package',
    pricingType: 'paid',
    price: 1499,
    discountPrice: 1199,
    currency: 'TRY',
    duration: 90,
    lessonCount: 45,
    presentationCount: 45,
    examCount: 20,
    questionCount: 1000,
    difficulty: 'advanced',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.9,
    reviewCount: 2876,
    enrolledCount: 9876,
    status: 'published',
    features: [
      '45 saat canlı ders',
      '45 sunum',
      '20 deneme sınavı',
      '1000 soru',
      'Sınırsız erişim',
      'Sertifika'
    ],
    learningOutcomes: [
      'KPSS GY tam müfredat',
      'Soru çözüm teknikleri',
      'Sınav stratejileri'
    ],
    tags: ['KPSS', 'Genel Yetenek', 'Tam Paket'],
    createdAt: '2024-03-01',
    updatedAt: '2024-11-25',
    publishedAt: '2024-03-15',
    expiresAt: '2025-08-31',
    certificateIncluded: true,
  },

  // DGS PACKAGES
  {
    id: 'pkg-dgs-001',
    name: 'DGS Matematik Hızlandırılmış',
    description: 'Yoğun tempo ile DGS Matematik hazırlığı',
    examType: 'DGS',
    subject: 'Matematik',
    packageType: 'course_presentation_exam',
    pricingType: 'paid',
    price: 799,
    discountPrice: 599,
    currency: 'TRY',
    duration: 50,
    lessonCount: 25,
    presentationCount: 25,
    examCount: 15,
    questionCount: 600,
    difficulty: 'intermediate',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    instructorId: 'inst-001',
    rating: 4.7,
    reviewCount: 1543,
    enrolledCount: 4567,
    status: 'published',
    features: [
      '25 saat yoğun ders',
      '25 sunum',
      '15 deneme',
      'Hızlı çözüm teknikleri'
    ],
    learningOutcomes: ['DGS Matematik konu anlatımı', 'Hız kazanma'],
    tags: ['DGS', 'Matematik', 'Hızlandırılmış'],
    createdAt: '2024-04-01',
    updatedAt: '2024-11-20',
    publishedAt: '2024-04-15',
    expiresAt: '2025-09-30',
    certificateIncluded: false,
  },

  // SUBSCRIPTION PACKAGES
  {
    id: 'pkg-sub-001',
    name: 'Premium Abonelik - Tüm İçeriklere Erişim',
    description: 'Tüm ders, sunum ve denemelere sınırsız erişim',
    examType: 'GENEL',
    subject: 'Tüm Konular',
    packageType: 'full_package',
    pricingType: 'subscription',
    price: 199,
    currency: 'TRY/Ay',
    duration: 0,
    lessonCount: 500,
    presentationCount: 500,
    examCount: 200,
    questionCount: 10000,
    difficulty: 'beginner',
    instructor: 'Tüm Eğitmenler',
    instructorId: 'inst-001',
    rating: 4.9,
    reviewCount: 8765,
    enrolledCount: 25000,
    status: 'published',
    features: [
      'Tüm derslere erişim',
      'Yeni içerikler dahil',
      'Özel destek hattı',
      'Öncelikli soru yanıtlama',
      'İndirimli sertifika'
    ],
    learningOutcomes: ['Tüm sınav tiplerinde başarı'],
    tags: ['Abonelik', 'Premium', 'Sınırsız'],
    createdAt: '2024-01-01',
    updatedAt: '2024-11-28',
    publishedAt: '2024-01-01',
    certificateIncluded: false,
  },
];

// ============================================
// MOCK DATA - LESSONS
// ============================================

export const demoLessons: Lesson[] = [
  {
    id: 'lesson-001',
    packageId: 'pkg-tyt-001',
    title: 'Temel Kavramlar ve Sayılar',
    description: 'TYT Matematik temel kavramlar ve sayı sistemleri',
    type: 'video',
    order: 1,
    duration: 90,
    videoUrl: 'https://example.com/lesson-001.mp4',
    resources: [
      { id: 'res-001', name: 'Ders Notları.pdf', type: 'pdf', url: '#', size: '2.5 MB' },
      { id: 'res-002', name: 'Örnek Sorular.pdf', type: 'pdf', url: '#', size: '1.8 MB' },
    ],
    quizCount: 15,
    isCompleted: false,
    isFree: true,
    viewCount: 8920,
    likeCount: 834,
  },
  {
    id: 'lesson-002',
    packageId: 'pkg-tyt-001',
    title: 'Rasyonel Sayılar ve İşlemler',
    description: 'Rasyonel sayılar konusunda detaylı anlatım',
    type: 'live',
    order: 2,
    duration: 120,
    liveSchedule: '2024-12-05T19:00:00',
    resources: [
      { id: 'res-003', name: 'Konu Özeti.pdf', type: 'pdf', url: '#', size: '1.2 MB' },
    ],
    quizCount: 20,
    isCompleted: false,
    isFree: false,
    viewCount: 7234,
    likeCount: 712,
  },
  {
    id: 'lesson-003',
    packageId: 'pkg-tyt-001',
    title: 'Cebirsel İfadeler',
    description: 'Cebirsel ifadeler ve denklemler',
    type: 'video',
    order: 3,
    duration: 100,
    videoUrl: 'https://example.com/lesson-003.mp4',
    resources: [],
    quizCount: 18,
    isCompleted: false,
    isFree: false,
    viewCount: 6543,
    likeCount: 623,
  },
];

// ============================================
// MOCK DATA - PRESENTATIONS
// ============================================

export const demoPresentations: Presentation[] = [
  {
    id: 'pres-001',
    packageId: 'pkg-tyt-001',
    title: 'TYT Matematik - Sayılar Görsel Sunum',
    description: 'İnteraktif animasyonlarla sayılar konusu',
    slideCount: 45,
    duration: 30,
    type: 'interactive',
    viewCount: 5432,
    downloadCount: 1234,
    isFree: true,
    createdAt: '2024-01-20',
  },
  {
    id: 'pres-002',
    packageId: 'pkg-tyt-001',
    title: 'Rasyonel Sayılar İnfografik',
    description: 'Rasyonel sayılar konu özeti infografik',
    slideCount: 30,
    duration: 20,
    type: 'static',
    viewCount: 4321,
    downloadCount: 987,
    isFree: false,
    createdAt: '2024-02-01',
  },
  {
    id: 'pres-003',
    packageId: 'pkg-lgs-001',
    title: 'LGS Matematik Animasyonlu Sunum',
    description: 'Çocuklar için özel tasarlanmış animasyonlu sunum',
    slideCount: 50,
    duration: 35,
    type: 'video_presentation',
    viewCount: 9876,
    downloadCount: 2345,
    isFree: false,
    createdAt: '2024-02-15',
  },
];

// ============================================
// MOCK DATA - PRACTICE EXAMS
// ============================================

export const demoPracticeExams: PracticeExam[] = [
  {
    id: 'exam-001',
    packageId: 'pkg-tyt-001',
    title: 'TYT Matematik Deneme 1',
    description: 'İlk deneme sınavı - temel konular',
    examType: 'TYT',
    questionCount: 40,
    duration: 40,
    totalPoints: 100,
    passingScore: 60,
    difficulty: 'beginner',
    attemptCount: 5432,
    avgScore: 67.5,
    isFree: true,
    createdAt: '2024-02-01',
  },
  {
    id: 'exam-002',
    packageId: 'pkg-tyt-001',
    title: 'TYT Matematik Deneme 2',
    description: 'İkinci deneme - orta seviye sorular',
    examType: 'TYT',
    questionCount: 40,
    duration: 40,
    totalPoints: 100,
    passingScore: 65,
    difficulty: 'intermediate',
    attemptCount: 4321,
    avgScore: 63.2,
    isFree: false,
    createdAt: '2024-02-15',
  },
  {
    id: 'exam-003',
    packageId: 'pkg-lgs-001',
    title: 'LGS Matematik Mega Deneme 1',
    description: 'LGS tarzı ilk deneme sınavı',
    examType: 'LGS',
    questionCount: 20,
    duration: 30,
    totalPoints: 100,
    passingScore: 70,
    difficulty: 'intermediate',
    attemptCount: 8765,
    avgScore: 71.8,
    isFree: false,
    createdAt: '2024-02-20',
  },
  {
    id: 'exam-004',
    packageId: 'pkg-ayt-001',
    title: 'AYT Matematik İleri Seviye Deneme 1',
    description: 'Zor seviye AYT matematik denemesi',
    examType: 'AYT',
    questionCount: 40,
    duration: 60,
    totalPoints: 100,
    passingScore: 50,
    difficulty: 'advanced',
    attemptCount: 3456,
    avgScore: 54.3,
    isFree: false,
    createdAt: '2024-03-01',
  },
];

// ============================================
// MOCK DATA - ENROLLMENTS
// ============================================

export const demoEnrollments: Enrollment[] = [
  {
    id: 'enr-001',
    packageId: 'pkg-tyt-001',
    packageName: 'TYT Matematik Tam Paket',
    userId: 'user-001',
    userName: 'Ali Yılmaz',
    enrolledAt: '2024-09-01',
    expiresAt: '2025-06-30',
    progress: 65,
    completedLessons: 26,
    totalLessons: 40,
    lastAccessedAt: '2024-11-27',
    certificateEarned: false,
  },
  {
    id: 'enr-002',
    packageId: 'pkg-lgs-001',
    packageName: 'LGS Matematik Mega Paket',
    userId: 'user-002',
    userName: 'Zeynep Kaya',
    enrolledAt: '2024-08-15',
    expiresAt: '2025-06-15',
    progress: 85,
    completedLessons: 30,
    totalLessons: 35,
    lastAccessedAt: '2024-11-28',
    certificateEarned: false,
  },
  {
    id: 'enr-003',
    packageId: 'pkg-tyt-004',
    packageName: 'TYT Türkçe Tam Paket - ÜCRETSİZ',
    userId: 'user-003',
    userName: 'Mehmet Demir',
    enrolledAt: '2024-10-01',
    progress: 100,
    completedLessons: 15,
    totalLessons: 15,
    lastAccessedAt: '2024-11-25',
    certificateEarned: true,
    certificateId: 'cert-001',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPackagesByExamType(examType: ExamType): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.examType === examType);
}

export function getPackagesByPricing(pricingType: PricingType): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.pricingType === pricingType);
}

export function getFreePackages(): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.pricingType === 'free');
}

export function getPaidPackages(): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.pricingType === 'paid');
}

export function getPackagesBySubject(subject: string): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.subject.toLowerCase().includes(subject.toLowerCase()));
}

export function getPackagesByInstructor(instructorId: string): CoursePackage[] {
  return demoCoursePackages.filter(pkg => pkg.instructorId === instructorId);
}

export function getLessonsByPackage(packageId: string): Lesson[] {
  return demoLessons.filter(lesson => lesson.packageId === packageId);
}

export function getPresentationsByPackage(packageId: string): Presentation[] {
  return demoPresentations.filter(pres => pres.packageId === packageId);
}

export function getExamsByPackage(packageId: string): PracticeExam[] {
  return demoPracticeExams.filter(exam => exam.packageId === packageId);
}

export function getEnrollmentsByUser(userId: string): Enrollment[] {
  return demoEnrollments.filter(enr => enr.userId === userId);
}

export function getPopularPackages(limit: number = 10): CoursePackage[] {
  return [...demoCoursePackages]
    .sort((a, b) => b.enrolledCount - a.enrolledCount)
    .slice(0, limit);
}

export function getTopRatedPackages(limit: number = 10): CoursePackage[] {
  return [...demoCoursePackages]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getNewPackages(limit: number = 10): CoursePackage[] {
  return [...demoCoursePackages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getCourseStatistics() {
  const totalPackages = demoCoursePackages.length;
  const totalEnrollments = demoCoursePackages.reduce((sum, pkg) => sum + pkg.enrolledCount, 0);
  const totalRevenue = demoCoursePackages
    .filter(pkg => pkg.pricingType === 'paid')
    .reduce((sum, pkg) => sum + (pkg.discountPrice || pkg.price) * pkg.enrolledCount, 0);
  const avgRating = demoCoursePackages.reduce((sum, pkg) => sum + pkg.rating, 0) / totalPackages;

  return {
    totalPackages,
    totalEnrollments,
    totalRevenue,
    avgRating: avgRating.toFixed(2),
    freePackages: demoCoursePackages.filter(pkg => pkg.pricingType === 'free').length,
    paidPackages: demoCoursePackages.filter(pkg => pkg.pricingType === 'paid').length,
    subscriptionPackages: demoCoursePackages.filter(pkg => pkg.pricingType === 'subscription').length,
  };
}

export function getExamTypeStats() {
  const examTypes: ExamType[] = ['TYT', 'AYT', 'LGS', 'KPSS', 'DGS', 'ALES', 'YDS', 'YÖKDİL', 'MSÜ', 'GENEL'];
  
  return examTypes.map(type => {
    const packages = getPackagesByExamType(type);
    const enrollments = packages.reduce((sum, pkg) => sum + pkg.enrolledCount, 0);
    
    return {
      examType: type,
      packageCount: packages.length,
      totalEnrollments: enrollments,
    };
  });
}

