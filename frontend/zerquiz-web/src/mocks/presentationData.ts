import { generateUUID } from '../lib/mockStorage';

// ==================== SUNUM VERİLERİ ====================

export interface Presentation {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  slides: Slide[];
  settings: PresentationSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

export interface Slide {
  id: string;
  order: number;
  type: 'title' | 'content' | 'image' | 'video' | 'quiz' | 'blank';
  content: SlideContent;
  transitions?: {
    in: string;
    out: string;
  };
  duration?: number; // seconds
}

export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: 'center' | 'left' | 'right' | 'split';
}

export interface PresentationSettings {
  autoPlay: boolean;
  loop: boolean;
  showControls: boolean;
  slideTransition: 'fade' | 'slide' | 'zoom' | 'none';
  defaultDuration: number; // seconds per slide
}

export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: Slide[];
  category: 'education' | 'business' | 'creative' | 'minimal';
}

// ==================== ŞABLONLAR ====================

export const presentationTemplates: PresentationTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Eğitim Sunumu',
    description: 'Ders anlatımı için ideal şablon',
    thumbnail: 'https://https://https://via.placeholder.com/400x300/3B82F6/ffffff?text=Eğitim',
    category: 'education',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Ders Başlığı',
          subtitle: 'Alt başlık buraya',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
      {
        id: generateUUID(),
        order: 2,
        type: 'content',
        content: {
          title: 'Konular',
          body: '• Konu 1\n• Konu 2\n• Konu 3',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          layout: 'left',
        },
      },
    ],
  },
  {
    id: 'tpl-002',
    name: 'Minimal Sunum',
    description: 'Sade ve şık tasarım',
    thumbnail: 'https://https://https://via.placeholder.com/400x300/1F2937/ffffff?text=Minimal',
    category: 'minimal',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Başlık',
          backgroundColor: '#1F2937',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
    ],
  },
  {
    id: 'tpl-003',
    name: 'İş Sunumu',
    description: 'Profesyonel iş sunumları için',
    thumbnail: 'https://https://https://via.placeholder.com/400x300/7C3AED/ffffff?text=İş',
    category: 'business',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Proje Sunumu',
          subtitle: 'Şirket Adı',
          backgroundColor: '#7C3AED',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
    ],
  },
];

// ==================== DEMO SUNUMLAR ====================

export const demoPresentations: Presentation[] = [
  {
    id: 'pres-001',
    title: 'Matematik - Cebir Dersi',
    description: 'Cebirin temel kavramları',
    thumbnailUrl: 'https://https://https://via.placeholder.com/400x300/3B82F6/ffffff?text=Matematik',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Cebir',
          subtitle: 'Temel Kavramlar',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
      {
        id: generateUUID(),
        order: 2,
        type: 'content',
        content: {
          title: 'Değişkenler',
          body: 'Değişkenler matematiksel ifadelerde bilinmeyen değerleri temsil eder.\n\nÖrnekler:\n• x + 5 = 10\n• 2y = 8\n• a² + b² = c²',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          layout: 'left',
        },
      },
      {
        id: generateUUID(),
        order: 3,
        type: 'content',
        content: {
          title: 'Denklemler',
          body: 'Denklem, iki ifadenin eşit olduğunu gösteren matematiksel cümledir.',
          backgroundColor: '#EFF6FF',
          textColor: '#1F2937',
          layout: 'center',
        },
      },
    ],
    settings: {
      autoPlay: false,
      loop: false,
      showControls: true,
      slideTransition: 'slide',
      defaultDuration: 30,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Ahmet Yılmaz',
    tags: ['matematik', 'cebir', 'ders'],
    status: 'published',
  },
  {
    id: 'pres-002',
    title: 'Türkçe - Noktalama İşaretleri',
    description: 'Noktalama işaretlerinin kullanımı',
    thumbnailUrl: 'https://https://https://via.placeholder.com/400x300/10B981/ffffff?text=Türkçe',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Noktalama İşaretleri',
          subtitle: 'Türkçe Dersi',
          backgroundColor: '#10B981',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
      {
        id: generateUUID(),
        order: 2,
        type: 'content',
        content: {
          title: 'Nokta (.)',
          body: 'Cümlelerin sonuna konur.\n\nÖrnek: Okula gittim.',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          layout: 'left',
        },
      },
    ],
    settings: {
      autoPlay: false,
      loop: false,
      showControls: true,
      slideTransition: 'fade',
      defaultDuration: 30,
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Ayşe Demir',
    tags: ['türkçe', 'noktalama', 'dil bilgisi'],
    status: 'published',
  },
  {
    id: 'pres-003',
    title: 'Fen Bilgisi - Güneş Sistemi',
    description: 'Gezegenler ve özellikleri',
    thumbnailUrl: 'https://https://https://via.placeholder.com/400x300/F59E0B/ffffff?text=Fen',
    slides: [
      {
        id: generateUUID(),
        order: 1,
        type: 'title',
        content: {
          title: 'Güneş Sistemi',
          subtitle: 'Gezegenler',
          backgroundColor: '#F59E0B',
          textColor: '#FFFFFF',
          layout: 'center',
        },
      },
    ],
    settings: {
      autoPlay: false,
      loop: false,
      showControls: true,
      slideTransition: 'zoom',
      defaultDuration: 30,
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Mehmet Kaya',
    tags: ['fen', 'uzay', 'gezegenler'],
    status: 'draft',
  },
];

// ==================== HELPER FONKSİYONLAR ====================

export function getPresentationById(id: string): Presentation | undefined {
  return demoPresentations.find(p => p.id === id);
}

export function getPresentationsByStatus(status: Presentation['status']): Presentation[] {
  return demoPresentations.filter(p => p.status === status);
}

export function createPresentationFromTemplate(templateId: string, title: string): Presentation {
  const template = presentationTemplates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');

  return {
    id: generateUUID(),
    title,
    description: '',
    thumbnailUrl: template.thumbnail,
    slides: template.slides.map((slide, index) => ({
      ...slide,
      id: generateUUID(),
      order: index + 1,
    })),
    settings: {
      autoPlay: false,
      loop: false,
      showControls: true,
      slideTransition: 'slide',
      defaultDuration: 30,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Current User',
    tags: [],
    status: 'draft',
  };
}

export function getPresentationStats() {
  return {
    total: demoPresentations.length,
    published: getPresentationsByStatus('published').length,
    draft: getPresentationsByStatus('draft').length,
    archived: getPresentationsByStatus('archived').length,
  };
}

