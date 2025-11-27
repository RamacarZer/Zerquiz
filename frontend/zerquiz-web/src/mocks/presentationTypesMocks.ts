import { MockApiService } from '../lib/mockApi';
import { generateUUID } from '../lib/mockStorage';

// ==================== SORU SUNUM ŞEKİLLERİ (Presentation Styles) ====================

export interface QuestionPresentationStyle {
  id: string;
  code: string;
  name: string;
  description?: string;
  hideOptionLabelsInPreview?: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const presentationStylesSeedData: Omit<QuestionPresentationStyle, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    code: 'standard',
    name: 'Standart Sunum',
    description: 'Klasik soru ve şık gösterimi',
    hideOptionLabelsInPreview: false,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    code: 'slide_based',
    name: 'Slayt Tabanlı',
    description: 'Tam ekran slayt formatında',
    hideOptionLabelsInPreview: false,
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    code: 'card_flip',
    name: 'Kart Çevirme',
    description: 'Kartları çevirerek cevaplama',
    hideOptionLabelsInPreview: true,
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    code: 'game_show',
    name: 'Oyun Şovu Tarzı',
    description: 'Yarışma programı stili',
    hideOptionLabelsInPreview: false,
    displayOrder: 4,
  },
  {
    id: generateUUID(),
    code: 'timeline',
    name: 'Zaman Çizelgesi',
    description: 'Kronolojik görünüm',
    hideOptionLabelsInPreview: false,
    displayOrder: 5,
  },
];

class QuestionPresentationStyleService extends MockApiService<QuestionPresentationStyle> {
  constructor() {
    super('question_presentation_styles', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(presentationStylesSeedData as QuestionPresentationStyle[]);
    }
  }
}

export const questionPresentationStyleService = new QuestionPresentationStyleService();

