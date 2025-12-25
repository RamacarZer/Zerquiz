import { MockApiService } from '../lib/mockApi';
import { generateUUID } from '../lib/mockStorage';

// ==================== TYPES ====================

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  theme: 'default' | 'dark' | 'minimal' | 'modern' | 'elegant';
  mode: 'slides' | 'scroll' | 'auto' | 'interactive';
  subjectId?: string;
  topicId?: string;
  status: 'draft' | 'published' | 'archived';
  thumbnailUrl?: string;
  slideCount: number;
  isLive: boolean;
  liveCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Slide {
  id: string;
  presentationId: string;
  order: number;
  type: SlideType;
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  questionId?: string;
  transition?: 'fade' | 'slide' | 'zoom' | 'flip';
  duration?: number;
  speakerNotes?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SlideType =
  | 'title'
  | 'content'
  | 'image'
  | 'video'
  | 'two_column'
  | 'quote'
  | 'code'
  | 'quiz'
  | 'blank';

export interface SlideTemplate {
  id: string;
  name: string;
  type: SlideType;
  thumbnailUrl: string;
  description: string;
  defaultContent: Partial<Slide>;
}

// ==================== SEED DATA ====================

const slideTemplatesSeedData: SlideTemplate[] = [
  {
    id: generateUUID(),
    name: 'Başlık Slaytı',
    type: 'title',
    thumbnailUrl: '/templates/title.png',
    description: 'Sunumunuzu başlatın',
    defaultContent: {
      type: 'title',
      title: 'Sunum Başlığı',
      content: '<p class="text-lg text-gray-600">Alt başlık veya açıklama</p>',
      backgroundColor: '#1E40AF',
      textColor: '#FFFFFF',
    },
  },
  {
    id: generateUUID(),
    name: 'İçerik Slaytı',
    type: 'content',
    thumbnailUrl: '/templates/content.png',
    description: 'Standart içerik slaytı',
    defaultContent: {
      type: 'content',
      title: 'Başlık',
      content: '<ul><li>Madde 1</li><li>Madde 2</li><li>Madde 3</li></ul>',
    },
  },
  {
    id: generateUUID(),
    name: 'Görsel + Metin',
    type: 'two_column',
    thumbnailUrl: '/templates/two-column.png',
    description: 'İki sütunlu düzen',
    defaultContent: {
      type: 'two_column',
      title: 'Görsel ve İçerik',
      content: '<p>Sol taraf içerik...</p>',
      imageUrl: 'https://https://https://via.placeholder.com/600x400',
    },
  },
  {
    id: generateUUID(),
    name: 'Alıntı',
    type: 'quote',
    thumbnailUrl: '/templates/quote.png',
    description: 'Alıntı veya vurgu',
    defaultContent: {
      type: 'quote',
      content: '<blockquote class="text-2xl italic">"Harika bir alıntı buraya..."</blockquote>',
      backgroundColor: '#F3F4F6',
    },
  },
  {
    id: generateUUID(),
    name: 'Kod Bloğu',
    type: 'code',
    thumbnailUrl: '/templates/code.png',
    description: 'Kod gösterimi',
    defaultContent: {
      type: 'code',
      title: 'Kod Örneği',
      content: '<pre><code>function hello() {\n  console.log("Hello!");\n}</code></pre>',
    },
  },
  {
    id: generateUUID(),
    name: 'Video',
    type: 'video',
    thumbnailUrl: '/templates/video.png',
    description: 'Video gösterimi',
    defaultContent: {
      type: 'video',
      title: 'Video Başlığı',
      videoUrl: '',
    },
  },
  {
    id: generateUUID(),
    name: 'Quiz',
    type: 'quiz',
    thumbnailUrl: '/templates/quiz.png',
    description: 'Etkileşimli soru',
    defaultContent: {
      type: 'quiz',
      title: 'Soru',
      content: '<p>Bu bir quiz slaytıdır...</p>',
    },
  },
  {
    id: generateUUID(),
    name: 'Boş Slayt',
    type: 'blank',
    thumbnailUrl: '/templates/blank.png',
    description: 'Sıfırdan başlayın',
    defaultContent: {
      type: 'blank',
      content: '',
    },
  },
];

const demoPresentationsSeedData: Omit<Presentation, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    title: 'Matematik: Cebir Temelleri',
    description: 'Temel cebir konularına giriş',
    theme: 'modern',
    mode: 'slides',
    status: 'published',
    slideCount: 12,
    isLive: false,
  },
  {
    id: generateUUID(),
    title: 'Fizik: Newton Yasaları',
    description: 'Hareket yasaları ve uygulamaları',
    theme: 'dark',
    mode: 'slides',
    status: 'published',
    slideCount: 15,
    isLive: false,
  },
  {
    id: generateUUID(),
    title: 'Programlama: React Hooks',
    description: 'Modern React geliştirme',
    theme: 'minimal',
    mode: 'interactive',
    status: 'draft',
    slideCount: 8,
    isLive: false,
  },
];

// ==================== MOCK SERVICES ====================

class PresentationService extends MockApiService<Presentation> {
  constructor() {
    super('presentations', 500);
    if (this.storage.getAll().length === 0) {
      this.seed(demoPresentationsSeedData as Presentation[]);
    }
  }

  async getSlides(presentationId: string): Promise<Slide[]> {
    // Mock slides for a presentation
    return [
      {
        id: generateUUID(),
        presentationId,
        order: 0,
        type: 'title',
        title: 'Sunum Başlığı',
        content: '<p class="text-xl">Hoş geldiniz!</p>',
        transition: 'fade',
        backgroundColor: '#1E40AF',
        textColor: '#FFFFFF',
      },
      {
        id: generateUUID(),
        presentationId,
        order: 1,
        type: 'content',
        title: 'Giriş',
        content: '<ul><li>Konu 1</li><li>Konu 2</li><li>Konu 3</li></ul>',
        transition: 'slide',
      },
      {
        id: generateUUID(),
        presentationId,
        order: 2,
        type: 'two_column',
        title: 'Detaylar',
        content: '<p>Sol taraf içerik...</p>',
        imageUrl: 'https://https://https://via.placeholder.com/600x400',
        transition: 'zoom',
      },
    ];
  }
}

class SlideTemplateService extends MockApiService<SlideTemplate> {
  constructor() {
    super('slide_templates', 200);
    if (this.storage.getAll().length === 0) {
      this.seed(slideTemplatesSeedData);
    }
  }
}

// ==================== EXPORT ====================

export const presentationService = new PresentationService();
export const slideTemplateService = new SlideTemplateService();

