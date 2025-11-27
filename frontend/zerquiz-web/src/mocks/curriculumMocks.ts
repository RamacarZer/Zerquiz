import { MockApiService } from '../lib/mockApi';
import { generateUUID } from '../lib/mockStorage';

// ==================== TYPES ====================

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningOutcome {
  id: string;
  topicId: string;
  code: string;
  name: string;
  description?: string;
  bloomLevel?: number;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== SEED DATA ====================

const subjectsSeedData: Omit<Subject, 'createdAt' | 'updatedAt'>[] = [
  {
    id: generateUUID(),
    code: 'math',
    name: 'Matematik',
    description: 'Matematik dersi',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    code: 'physics',
    name: 'Fizik',
    description: 'Fizik dersi',
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    code: 'chemistry',
    name: 'Kimya',
    description: 'Kimya dersi',
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    code: 'biology',
    name: 'Biyoloji',
    description: 'Biyoloji dersi',
    displayOrder: 4,
  },
  {
    id: generateUUID(),
    code: 'turkish',
    name: 'Türkçe',
    description: 'Türkçe dersi',
    displayOrder: 5,
  },
  {
    id: generateUUID(),
    code: 'literature',
    name: 'Edebiyat',
    description: 'Edebiyat dersi',
    displayOrder: 6,
  },
  {
    id: generateUUID(),
    code: 'history',
    name: 'Tarih',
    description: 'Tarih dersi',
    displayOrder: 7,
  },
  {
    id: generateUUID(),
    code: 'geography',
    name: 'Coğrafya',
    description: 'Coğrafya dersi',
    displayOrder: 8,
  },
  {
    id: generateUUID(),
    code: 'english',
    name: 'İngilizce',
    description: 'İngilizce dersi',
    displayOrder: 9,
  },
  {
    id: generateUUID(),
    code: 'philosophy',
    name: 'Felsefe',
    description: 'Felsefe dersi',
    displayOrder: 10,
  },
];

const topicsSeedData: Omit<Topic, 'createdAt' | 'updatedAt'>[] = [
  // Matematik konuları
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[0].id, // math
    code: 'algebra',
    name: 'Cebir',
    description: 'Denklemler, eşitsizlikler ve cebirsel işlemler',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[0].id,
    code: 'geometry',
    name: 'Geometri',
    description: 'Şekiller, açılar ve alan hesaplamaları',
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[0].id,
    code: 'trigonometry',
    name: 'Trigonometri',
    description: 'Sinüs, kosinüs ve trigonometrik fonksiyonlar',
    displayOrder: 3,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[0].id,
    code: 'calculus',
    name: 'Analiz',
    description: 'Türev, integral ve limit',
    displayOrder: 4,
  },
  // Fizik konuları
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[1].id, // physics
    code: 'mechanics',
    name: 'Mekanik',
    description: 'Kuvvet, hareket ve enerji',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[1].id,
    code: 'electricity',
    name: 'Elektrik',
    description: 'Akım, gerilim ve devre elemanları',
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[1].id,
    code: 'optics',
    name: 'Optik',
    description: 'Işık, yansıma ve kırılma',
    displayOrder: 3,
  },
  // Kimya konuları
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[2].id, // chemistry
    code: 'organic_chemistry',
    name: 'Organik Kimya',
    description: 'Karbon bileşikleri ve organik reaksiyonlar',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[2].id,
    code: 'inorganic_chemistry',
    name: 'İnorganik Kimya',
    description: 'Elementler ve inorganik bileşikler',
    displayOrder: 2,
  },
  // Biyoloji konuları
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[3].id, // biology
    code: 'cell_biology',
    name: 'Hücre Biyolojisi',
    description: 'Hücre yapısı ve fonksiyonları',
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    subjectId: subjectsSeedData[3].id,
    code: 'genetics',
    name: 'Genetik',
    description: 'Kalıtım ve DNA',
    displayOrder: 2,
  },
];

const learningOutcomesSeedData: Omit<LearningOutcome, 'createdAt' | 'updatedAt'>[] = [
  // Cebir kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[0].id, // algebra
    code: 'ALG001',
    name: 'Birinci dereceden bir bilinmeyenli denklemleri çözebilir',
    description: 'Ax + B = 0 şeklindeki denklemleri çözme',
    bloomLevel: 3,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[0].id,
    code: 'ALG002',
    name: 'İkinci dereceden denklemleri çözebilir',
    description: 'Ax² + Bx + C = 0 şeklindeki denklemleri çözme',
    bloomLevel: 3,
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[0].id,
    code: 'ALG003',
    name: 'Eşitsizlikleri çözebilir ve grafik üzerinde gösterebilir',
    description: 'Birinci dereceden eşitsizlikleri çözme',
    bloomLevel: 4,
    displayOrder: 3,
  },
  // Geometri kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[1].id, // geometry
    code: 'GEO001',
    name: 'Üçgenlerin alanını hesaplayabilir',
    description: 'Farklı yöntemlerle üçgen alanı hesaplama',
    bloomLevel: 3,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[1].id,
    code: 'GEO002',
    name: 'Dairenin çevre ve alan formüllerini uygulayabilir',
    description: 'Daire ile ilgili hesaplamalar',
    bloomLevel: 3,
    displayOrder: 2,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[1].id,
    code: 'GEO003',
    name: 'Açı-kenar bağıntılarını kullanarak geometrik problemler çözebilir',
    description: 'Geometrik problemlerde açı-kenar ilişkileri',
    bloomLevel: 4,
    displayOrder: 3,
  },
  // Trigonometri kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[2].id, // trigonometry
    code: 'TRG001',
    name: 'Temel trigonometrik oranları hesaplayabilir',
    description: 'Sinüs, kosinüs, tanjant hesaplama',
    bloomLevel: 3,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[2].id,
    code: 'TRG002',
    name: 'Trigonometrik denklemleri çözebilir',
    description: 'Trigonometrik denklem çözümü',
    bloomLevel: 4,
    displayOrder: 2,
  },
  // Mekanik kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[4].id, // mechanics
    code: 'MEC001',
    name: 'Newton\'un hareket yasalarını uygulayabilir',
    description: 'F = ma ve diğer hareket yasaları',
    bloomLevel: 3,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[4].id,
    code: 'MEC002',
    name: 'İş, güç ve enerji kavramlarını ilişkilendirebilir',
    description: 'Enerji dönüşümleri ve korunumu',
    bloomLevel: 4,
    displayOrder: 2,
  },
  // Elektrik kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[5].id, // electricity
    code: 'ELC001',
    name: 'Ohm yasasını kullanarak devre hesaplamaları yapabilir',
    description: 'V = IR ilişkisi',
    bloomLevel: 3,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[5].id,
    code: 'ELC002',
    name: 'Seri ve paralel bağlı devreleri analiz edebilir',
    description: 'Devre analizi ve hesaplama',
    bloomLevel: 4,
    displayOrder: 2,
  },
  // Hücre Biyolojisi kazanımları
  {
    id: generateUUID(),
    topicId: topicsSeedData[9].id, // cell_biology
    code: 'CEL001',
    name: 'Hücre organellerinin yapı ve görevlerini açıklayabilir',
    description: 'Mitokondri, ribozom, golgi vb.',
    bloomLevel: 2,
    displayOrder: 1,
  },
  {
    id: generateUUID(),
    topicId: topicsSeedData[9].id,
    code: 'CEL002',
    name: 'Hücre zarı geçişlerini karşılaştırabilir',
    description: 'Difüzyon, osmoz, aktif taşıma',
    bloomLevel: 4,
    displayOrder: 2,
  },
];

// ==================== MOCK SERVICES ====================

class SubjectService extends MockApiService<Subject> {
  constructor() {
    super('subjects', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(subjectsSeedData as Subject[]);
    }
  }

  getByCode(code: string): Subject | null {
    const all = this.storage.getAll();
    return all.find((s: Subject) => s.code === code) || null;
  }
}

class TopicService extends MockApiService<Topic> {
  constructor() {
    super('topics', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(topicsSeedData as Topic[]);
    }
  }

  getBySubjectId(subjectId: string): Topic[] {
    const all = this.storage.getAll();
    return all.filter((t: Topic) => t.subjectId === subjectId);
  }
}

class LearningOutcomeService extends MockApiService<LearningOutcome> {
  constructor() {
    super('learning_outcomes', 300);
    if (this.storage.getAll().length === 0) {
      this.seed(learningOutcomesSeedData as LearningOutcome[]);
    }
  }

  getByTopicId(topicId: string): LearningOutcome[] {
    const all = this.storage.getAll();
    return all.filter((lo: LearningOutcome) => lo.topicId === topicId);
  }
}

// ==================== EXPORT ====================

export const subjectService = new SubjectService();
export const topicService = new TopicService();
export const learningOutcomeService = new LearningOutcomeService();

