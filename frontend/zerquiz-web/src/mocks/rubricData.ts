/**
 * Rubric Evaluation Mock Data
 * Ölçüt bazlı değerlendirme için demo verileri
 */

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // % olarak (toplam 100)
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  color: string;
}

export interface Rubric {
  id: string;
  name: string;
  description: string;
  category: 'essay' | 'project' | 'presentation' | 'portfolio' | 'lab_report' | 'assignment';
  totalPoints: number;
  criteria: RubricCriterion[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  usageCount: number;
}

export interface StudentRubricEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  rubricId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatedAt: Date;
  criteriaScores: CriterionScore[];
  totalScore: number;
  totalPoints: number;
  percentage: number;
  grade: string;
  feedback: string;
  status: 'draft' | 'published';
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  selectedLevelId: string;
  selectedLevelName: string;
  points: number;
  maxPoints: number;
  feedback?: string;
}

// Hazır Rubric Şablonları
export const mockRubricTemplates: Rubric[] = [
  {
    id: 'rubric-001',
    name: 'Kompozisyon Değerlendirme',
    description: 'Türkçe kompozisyon ve yazılı anlatım için detaylı rubric',
    category: 'essay',
    totalPoints: 100,
    criteria: [
      {
        id: 'crit-001',
        name: 'İçerik ve Fikir',
        description: 'Yazının ana fikri, destekleyici detaylar ve konu derinliği',
        weight: 40,
        levels: [
          {
            id: 'level-001-4',
            name: 'Mükemmel',
            description: 'Ana fikir net, destekleyici detaylar çok güçlü, konu derinliğine işlenmiş',
            minPoints: 36,
            maxPoints: 40,
            color: 'bg-green-500',
          },
          {
            id: 'level-001-3',
            name: 'İyi',
            description: 'Ana fikir açık, destekleyici detaylar yeterli, konu iyi işlenmiş',
            minPoints: 30,
            maxPoints: 35,
            color: 'bg-blue-500',
          },
          {
            id: 'level-001-2',
            name: 'Orta',
            description: 'Ana fikir var ama net değil, detaylar eksik, konu yüzeysel',
            minPoints: 20,
            maxPoints: 29,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-001-1',
            name: 'Zayıf',
            description: 'Ana fikir belirsiz, detaylar yetersiz, konu işlenmemiş',
            minPoints: 0,
            maxPoints: 19,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-002',
        name: 'Organizasyon ve Yapı',
        description: 'Paragraf düzeni, akıcılık ve mantıksal sıralama',
        weight: 25,
        levels: [
          {
            id: 'level-002-4',
            name: 'Mükemmel',
            description: 'Mükemmel organizasyon, paragraflar arası geçişler akıcı',
            minPoints: 23,
            maxPoints: 25,
            color: 'bg-green-500',
          },
          {
            id: 'level-002-3',
            name: 'İyi',
            description: 'İyi organizasyon, geçişler çoğunlukla akıcı',
            minPoints: 19,
            maxPoints: 22,
            color: 'bg-blue-500',
          },
          {
            id: 'level-002-2',
            name: 'Orta',
            description: 'Bazı organizasyon sorunları, geçişler bazen kopuk',
            minPoints: 13,
            maxPoints: 18,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-002-1',
            name: 'Zayıf',
            description: 'Zayıf organizasyon, paragraflar dağınık',
            minPoints: 0,
            maxPoints: 12,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-003',
        name: 'Dil ve Üslup',
        description: 'Kelime seçimi, cümle yapısı ve üslup uygunluğu',
        weight: 20,
        levels: [
          {
            id: 'level-003-4',
            name: 'Mükemmel',
            description: 'Zengin kelime dağarcığı, çeşitli cümle yapıları, etkili üslup',
            minPoints: 18,
            maxPoints: 20,
            color: 'bg-green-500',
          },
          {
            id: 'level-003-3',
            name: 'İyi',
            description: 'İyi kelime seçimi, cümleler çoğunlukla doğru, uygun üslup',
            minPoints: 15,
            maxPoints: 17,
            color: 'bg-blue-500',
          },
          {
            id: 'level-003-2',
            name: 'Orta',
            description: 'Sınırlı kelime, bazı cümle hataları, üslup tutarsız',
            minPoints: 10,
            maxPoints: 14,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-003-1',
            name: 'Zayıf',
            description: 'Zayıf kelime seçimi, çok sayıda cümle hatası',
            minPoints: 0,
            maxPoints: 9,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-004',
        name: 'Dilbilgisi ve Yazım',
        description: 'Yazım kuralları, noktalama ve dilbilgisi',
        weight: 15,
        levels: [
          {
            id: 'level-004-4',
            name: 'Mükemmel',
            description: 'Hatasız veya çok az hata',
            minPoints: 14,
            maxPoints: 15,
            color: 'bg-green-500',
          },
          {
            id: 'level-004-3',
            name: 'İyi',
            description: 'Birkaç küçük hata',
            minPoints: 11,
            maxPoints: 13,
            color: 'bg-blue-500',
          },
          {
            id: 'level-004-2',
            name: 'Orta',
            description: 'Orta sayıda hata, anlamayı zorlaştırmıyor',
            minPoints: 8,
            maxPoints: 10,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-004-1',
            name: 'Zayıf',
            description: 'Çok sayıda hata, anlamayı zorlaştırıyor',
            minPoints: 0,
            maxPoints: 7,
            color: 'bg-red-500',
          },
        ],
      },
    ],
    createdBy: 'Admin',
    createdAt: new Date('2024-01-15'),
    isPublic: true,
    usageCount: 156,
  },
  {
    id: 'rubric-002',
    name: 'Proje Değerlendirme',
    description: 'Fen/Sosyal bilimler proje ödevi değerlendirme',
    category: 'project',
    totalPoints: 100,
    criteria: [
      {
        id: 'crit-005',
        name: 'Araştırma ve İçerik',
        description: 'Konunun araştırılması, kaynaklar ve bilgi derinliği',
        weight: 35,
        levels: [
          {
            id: 'level-005-4',
            name: 'Mükemmel',
            description: 'Kapsamlı araştırma, güvenilir kaynaklar, derin bilgi',
            minPoints: 32,
            maxPoints: 35,
            color: 'bg-green-500',
          },
          {
            id: 'level-005-3',
            name: 'İyi',
            description: 'Yeterli araştırma, çoğunlukla güvenilir kaynaklar',
            minPoints: 26,
            maxPoints: 31,
            color: 'bg-blue-500',
          },
          {
            id: 'level-005-2',
            name: 'Orta',
            description: 'Sınırlı araştırma, bazı kaynaklar zayıf',
            minPoints: 18,
            maxPoints: 25,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-005-1',
            name: 'Zayıf',
            description: 'Yetersiz araştırma, güvenilir kaynak yok',
            minPoints: 0,
            maxPoints: 17,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-006',
        name: 'Yöntem ve Süreç',
        description: 'Proje yöntemi, çalışma süreci ve problem çözme',
        weight: 30,
        levels: [
          {
            id: 'level-006-4',
            name: 'Mükemmel',
            description: 'Net yöntem, detaylı süreç açıklaması, yaratıcı çözümler',
            minPoints: 27,
            maxPoints: 30,
            color: 'bg-green-500',
          },
          {
            id: 'level-006-3',
            name: 'İyi',
            description: 'Uygun yöntem, açık süreç, mantıklı çözümler',
            minPoints: 22,
            maxPoints: 26,
            color: 'bg-blue-500',
          },
          {
            id: 'level-006-2',
            name: 'Orta',
            description: 'Belirsiz yöntem, eksik süreç, basit çözümler',
            minPoints: 15,
            maxPoints: 21,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-006-1',
            name: 'Zayıf',
            description: 'Yöntem yok, süreç anlaşılmıyor',
            minPoints: 0,
            maxPoints: 14,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-007',
        name: 'Sunum ve Format',
        description: 'Görseller, formatanlamı, profesyonellik',
        weight: 20,
        levels: [
          {
            id: 'level-007-4',
            name: 'Mükemmel',
            description: 'Profesyonel görünüm, etkili görseller, düzgün format',
            minPoints: 18,
            maxPoints: 20,
            color: 'bg-green-500',
          },
          {
            id: 'level-007-3',
            name: 'İyi',
            description: 'İyi görünüm, uygun görseller, çoğunlukla düzgün',
            minPoints: 15,
            maxPoints: 17,
            color: 'bg-blue-500',
          },
          {
            id: 'level-007-2',
            name: 'Orta',
            description: 'Basit görünüm, bazı görseller eksik, format hataları',
            minPoints: 10,
            maxPoints: 14,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-007-1',
            name: 'Zayıf',
            description: 'Dağınık görünüm, görsel yok, format sorunları',
            minPoints: 0,
            maxPoints: 9,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-008',
        name: 'Sonuç ve Öneriler',
        description: 'Bulgular, sonuçlar ve gelecek önerileri',
        weight: 15,
        levels: [
          {
            id: 'level-008-4',
            name: 'Mükemmel',
            description: 'Net sonuçlar, güçlü öneriler, eleştirel düşünme',
            minPoints: 14,
            maxPoints: 15,
            color: 'bg-green-500',
          },
          {
            id: 'level-008-3',
            name: 'İyi',
            description: 'Açık sonuçlar, uygun öneriler',
            minPoints: 11,
            maxPoints: 13,
            color: 'bg-blue-500',
          },
          {
            id: 'level-008-2',
            name: 'Orta',
            description: 'Belirsiz sonuçlar, sınırlı öneriler',
            minPoints: 8,
            maxPoints: 10,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-008-1',
            name: 'Zayıf',
            description: 'Sonuç yok, öneri yok',
            minPoints: 0,
            maxPoints: 7,
            color: 'bg-red-500',
          },
        ],
      },
    ],
    createdBy: 'Admin',
    createdAt: new Date('2024-02-10'),
    isPublic: true,
    usageCount: 89,
  },
  {
    id: 'rubric-003',
    name: 'Sunum Değerlendirme',
    description: 'Sözlü sunum ve konuşma becerileri',
    category: 'presentation',
    totalPoints: 100,
    criteria: [
      {
        id: 'crit-009',
        name: 'İçerik Bilgisi',
        description: 'Konuya hakim olma ve bilgi aktarımı',
        weight: 30,
        levels: [
          {
            id: 'level-009-4',
            name: 'Uzman',
            description: 'Konuya tam hakim, sorulara mükemmel cevap',
            minPoints: 27,
            maxPoints: 30,
            color: 'bg-green-500',
          },
          {
            id: 'level-009-3',
            name: 'Yeterli',
            description: 'Konuyu iyi biliyor, çoğu soruya cevap veriyor',
            minPoints: 22,
            maxPoints: 26,
            color: 'bg-blue-500',
          },
          {
            id: 'level-009-2',
            name: 'Orta',
            description: 'Temel bilgi var ama derinlik yok',
            minPoints: 15,
            maxPoints: 21,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-009-1',
            name: 'Yetersiz',
            description: 'Konuyu bilmiyor, hazırlıksız',
            minPoints: 0,
            maxPoints: 14,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-010',
        name: 'Sunum Becerileri',
        description: 'Ses tonu, göz teması, beden dili',
        weight: 25,
        levels: [
          {
            id: 'level-010-4',
            name: 'Mükemmel',
            description: 'Net konuşma, sürekli göz teması, güçlü beden dili',
            minPoints: 23,
            maxPoints: 25,
            color: 'bg-green-500',
          },
          {
            id: 'level-010-3',
            name: 'İyi',
            description: 'Anlaşılır konuşma, iyi göz teması, uygun beden dili',
            minPoints: 19,
            maxPoints: 22,
            color: 'bg-blue-500',
          },
          {
            id: 'level-010-2',
            name: 'Orta',
            description: 'Bazen net değil, az göz teması, beden dili eksik',
            minPoints: 13,
            maxPoints: 18,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-010-1',
            name: 'Zayıf',
            description: 'Monoton, göz teması yok, beden dili uygunsuz',
            minPoints: 0,
            maxPoints: 12,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-011',
        name: 'Görsel Malzemeler',
        description: 'Slayt, video ve diğer görsel destekler',
        weight: 20,
        levels: [
          {
            id: 'level-011-4',
            name: 'Profesyonel',
            description: 'Etkileyici görseller, profesyonel tasarım',
            minPoints: 18,
            maxPoints: 20,
            color: 'bg-green-500',
          },
          {
            id: 'level-011-3',
            name: 'İyi',
            description: 'Uygun görseller, temiz tasarım',
            minPoints: 15,
            maxPoints: 17,
            color: 'bg-blue-500',
          },
          {
            id: 'level-011-2',
            name: 'Orta',
            description: 'Basit görseller, bazı tasarım sorunları',
            minPoints: 10,
            maxPoints: 14,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-011-1',
            name: 'Zayıf',
            description: 'Görsel yok veya çok zayıf',
            minPoints: 0,
            maxPoints: 9,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-012',
        name: 'Zaman Yönetimi',
        description: 'Süre kullanımı ve tempo',
        weight: 15,
        levels: [
          {
            id: 'level-012-4',
            name: 'Mükemmel',
            description: 'Tam zamanında, dengeli tempo',
            minPoints: 14,
            maxPoints: 15,
            color: 'bg-green-500',
          },
          {
            id: 'level-012-3',
            name: 'İyi',
            description: 'Süreye yakın, genelde uygun tempo',
            minPoints: 11,
            maxPoints: 13,
            color: 'bg-blue-500',
          },
          {
            id: 'level-012-2',
            name: 'Orta',
            description: 'Biraz kısa/uzun, tempo sorunları',
            minPoints: 8,
            maxPoints: 10,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-012-1',
            name: 'Zayıf',
            description: 'Çok kısa veya çok uzun',
            minPoints: 0,
            maxPoints: 7,
            color: 'bg-red-500',
          },
        ],
      },
      {
        id: 'crit-013',
        name: 'Soru-Cevap',
        description: 'Sorulara cevap verme yeteneği',
        weight: 10,
        levels: [
          {
            id: 'level-013-4',
            name: 'Mükemmel',
            description: 'Tüm sorulara detaylı ve net cevap',
            minPoints: 9,
            maxPoints: 10,
            color: 'bg-green-500',
          },
          {
            id: 'level-013-3',
            name: 'İyi',
            description: 'Çoğu soruya uygun cevap',
            minPoints: 7,
            maxPoints: 8,
            color: 'bg-blue-500',
          },
          {
            id: 'level-013-2',
            name: 'Orta',
            description: 'Bazı sorulara cevap veriyor',
            minPoints: 5,
            maxPoints: 6,
            color: 'bg-yellow-500',
          },
          {
            id: 'level-013-1',
            name: 'Zayıf',
            description: 'Sorulara cevap veremiyor',
            minPoints: 0,
            maxPoints: 4,
            color: 'bg-red-500',
          },
        ],
      },
    ],
    createdBy: 'Admin',
    createdAt: new Date('2024-03-05'),
    isPublic: true,
    usageCount: 67,
  },
];

// Demo Öğrenci Değerlendirmeleri
export const mockStudentEvaluations: StudentRubricEvaluation[] = [
  {
    id: 'eval-001',
    studentId: 'student-001',
    studentName: 'Ali Yılmaz',
    assignmentId: 'assignment-001',
    assignmentTitle: 'Küresel Isınma Kompozisyonu',
    rubricId: 'rubric-001',
    evaluatorId: 'teacher-001',
    evaluatorName: 'Ayşe Öztürk',
    evaluatedAt: new Date('2024-11-20'),
    criteriaScores: [
      {
        criterionId: 'crit-001',
        criterionName: 'İçerik ve Fikir',
        selectedLevelId: 'level-001-4',
        selectedLevelName: 'Mükemmel',
        points: 38,
        maxPoints: 40,
        feedback: 'Ana fikir çok net ve destekleyici örnekler güçlü.',
      },
      {
        criterionId: 'crit-002',
        criterionName: 'Organizasyon ve Yapı',
        selectedLevelId: 'level-002-3',
        selectedLevelName: 'İyi',
        points: 20,
        maxPoints: 25,
        feedback: 'Paragraflar arası geçişler iyi ama bir paragrafta bağlantı zayıf.',
      },
      {
        criterionId: 'crit-003',
        criterionName: 'Dil ve Üslup',
        selectedLevelId: 'level-003-4',
        selectedLevelName: 'Mükemmel',
        points: 19,
        maxPoints: 20,
        feedback: 'Kelime seçimi ve cümle yapıları çok başarılı.',
      },
      {
        criterionId: 'crit-004',
        criterionName: 'Dilbilgisi ve Yazım',
        selectedLevelId: 'level-004-3',
        selectedLevelName: 'İyi',
        points: 12,
        maxPoints: 15,
        feedback: '2-3 küçük yazım hatası var.',
      },
    ],
    totalScore: 89,
    totalPoints: 100,
    percentage: 89,
    grade: 'A',
    feedback: 'Çok başarılı bir kompozisyon. Özellikle içerik ve dil kullanımı mükemmel. Organizasyonda küçük iyileştirmeler yapabilirsin.',
    status: 'published',
  },
];

export const getGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getRubricById = (id: string): Rubric | undefined => {
  return mockRubricTemplates.find(r => r.id === id);
};

export const getRubricsByCategory = (category: Rubric['category']): Rubric[] => {
  return mockRubricTemplates.filter(r => r.category === category);
};

