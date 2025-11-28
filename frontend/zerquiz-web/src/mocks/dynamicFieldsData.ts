/**
 * Dynamic Fields & Groups System
 * Dinamik Alan ve Grup Yönetim Sistemi
 * Kullanıcılar kendi alanlarını ve gruplarını tanımlayabilir
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'datetime'
  | 'select' 
  | 'multiselect' 
  | 'radio' 
  | 'checkbox'
  | 'textarea' 
  | 'file' 
  | 'image'
  | 'url'
  | 'color'
  | 'rating'
  | 'slider'
  | 'location'
  | 'json';

export type EntityType = 
  | 'student' 
  | 'teacher' 
  | 'institution' 
  | 'exam' 
  | 'question'
  | 'course'
  | 'user'
  | 'contract'
  | 'invoice'
  | 'payment';

export interface FieldOption {
  id: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
  order: number;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message?: string;
  customValidator?: string; // JavaScript function as string
}

export interface DynamicField {
  id: string;
  groupId: string;
  code: string;
  name: string;
  description?: string;
  fieldType: FieldType;
  entityType: EntityType;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[]; // For select, radio, checkbox
  validation?: ValidationRule[];
  isRequired: boolean;
  isUnique: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  isVisible: boolean;
  isEditable: boolean;
  showInList: boolean;
  showInDetail: boolean;
  order: number;
  width?: 'full' | 'half' | 'third' | 'quarter'; // Layout width
  conditionalDisplay?: {
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  };
  calculation?: {
    formula: string; // e.g., "field1 + field2 * 0.18"
    dependencies: string[]; // field IDs
  };
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  entityType: EntityType;
  icon?: string;
  color?: string;
  order: number;
  isCollapsible: boolean;
  isCollapsedByDefault: boolean;
  isVisible: boolean;
  permissions?: {
    view: string[]; // role IDs
    edit: string[]; // role IDs
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DynamicFieldValue {
  id: string;
  entityId: string;
  entityType: EntityType;
  fieldId: string;
  value: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldTemplate {
  id: string;
  name: string;
  description: string;
  entityType: EntityType;
  groups: FieldGroup[];
  fields: DynamicField[];
  isSystemTemplate: boolean;
  usageCount: number;
}

// ============================================
// DEMO FIELD GROUPS
// ============================================

export const demoFieldGroups: FieldGroup[] = [
  {
    id: 'group-001',
    code: 'STUDENT_HEALTH',
    name: 'Sağlık Bilgileri',
    description: 'Öğrenci sağlık ve özel durumlar',
    entityType: 'student',
    icon: '🏥',
    color: '#EF4444',
    order: 1,
    isCollapsible: true,
    isCollapsedByDefault: false,
    isVisible: true,
    permissions: {
      view: ['admin', 'teacher', 'health_staff'],
      edit: ['admin', 'health_staff'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'group-002',
    code: 'STUDENT_CONTACT',
    name: 'Acil Durum İletişim',
    description: 'Acil durum için iletişim bilgileri',
    entityType: 'student',
    icon: '📞',
    color: '#F59E0B',
    order: 2,
    isCollapsible: true,
    isCollapsedByDefault: true,
    isVisible: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'group-003',
    code: 'INSTITUTION_TECH',
    name: 'Teknik Altyapı',
    description: 'Kurum teknik donanım ve altyapı bilgileri',
    entityType: 'institution',
    icon: '💻',
    color: '#3B82F6',
    order: 1,
    isCollapsible: true,
    isCollapsedByDefault: false,
    isVisible: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'group-004',
    code: 'EXAM_SCORING',
    name: 'Puanlama Ayarları',
    description: 'Sınava özel puanlama kuralları',
    entityType: 'exam',
    icon: '📊',
    color: '#8B5CF6',
    order: 1,
    isCollapsible: true,
    isCollapsedByDefault: false,
    isVisible: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'group-005',
    code: 'TEACHER_QUALIFICATIONS',
    name: 'Öğretmen Yetkinlikler',
    description: 'Öğretmen sertifika ve yetkinlik bilgileri',
    entityType: 'teacher',
    icon: '🎓',
    color: '#10B981',
    order: 1,
    isCollapsible: true,
    isCollapsedByDefault: false,
    isVisible: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
];

// ============================================
// DEMO DYNAMIC FIELDS
// ============================================

export const demoDynamicFields: DynamicField[] = [
  // STUDENT HEALTH FIELDS
  {
    id: 'field-001',
    groupId: 'group-001',
    code: 'BLOOD_TYPE',
    name: 'Kan Grubu',
    description: 'Öğrenci kan grubu',
    fieldType: 'select',
    entityType: 'student',
    options: [
      { id: 'opt-1', value: 'A+', label: 'A Rh+', order: 1 },
      { id: 'opt-2', value: 'A-', label: 'A Rh-', order: 2 },
      { id: 'opt-3', value: 'B+', label: 'B Rh+', order: 3 },
      { id: 'opt-4', value: 'B-', label: 'B Rh-', order: 4 },
      { id: 'opt-5', value: 'AB+', label: 'AB Rh+', order: 5 },
      { id: 'opt-6', value: 'AB-', label: 'AB Rh-', order: 6 },
      { id: 'opt-7', value: '0+', label: '0 Rh+', order: 7 },
      { id: 'opt-8', value: '0-', label: '0 Rh-', order: 8 },
    ],
    validation: [],
    isRequired: false,
    isUnique: false,
    isSearchable: true,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 1,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-002',
    groupId: 'group-001',
    code: 'ALLERGIES',
    name: 'Alerjiler',
    description: 'Bilinen alerjiler',
    fieldType: 'textarea',
    entityType: 'student',
    placeholder: 'Varsa alerjileri yazınız...',
    helpText: 'Besin, ilaç veya diğer alerjiler',
    validation: [
      { type: 'maxLength', value: 500, message: 'Maksimum 500 karakter' },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: true,
    isFilterable: false,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 2,
    width: 'full',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-003',
    groupId: 'group-001',
    code: 'CHRONIC_ILLNESS',
    name: 'Kronik Hastalık',
    description: 'Kronik hastalık durumu',
    fieldType: 'radio',
    entityType: 'student',
    options: [
      { id: 'opt-9', value: 'none', label: 'Yok', color: '#10B981', order: 1 },
      { id: 'opt-10', value: 'mild', label: 'Hafif', color: '#F59E0B', order: 2 },
      { id: 'opt-11', value: 'moderate', label: 'Orta', color: '#EF4444', order: 3 },
      { id: 'opt-12', value: 'severe', label: 'Ciddi', color: '#DC2626', order: 4 },
    ],
    defaultValue: 'none',
    isRequired: true,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 3,
    width: 'half',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-004',
    groupId: 'group-001',
    code: 'SPECIAL_NEEDS',
    name: 'Özel İhtiyaçlar',
    fieldType: 'checkbox',
    entityType: 'student',
    options: [
      { id: 'opt-13', value: 'wheelchair', label: 'Tekerlekli Sandalye', icon: '♿', order: 1 },
      { id: 'opt-14', value: 'hearing', label: 'İşitme Desteği', icon: '👂', order: 2 },
      { id: 'opt-15', value: 'vision', label: 'Görme Desteği', icon: '👁️', order: 3 },
      { id: 'opt-16', value: 'learning', label: 'Öğrenme Desteği', icon: '📚', order: 4 },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 4,
    width: 'full',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },

  // EMERGENCY CONTACT FIELDS
  {
    id: 'field-005',
    groupId: 'group-002',
    code: 'EMERGENCY_CONTACT_1',
    name: 'Acil Durum Kişisi 1',
    fieldType: 'text',
    entityType: 'student',
    placeholder: 'Ad Soyad',
    validation: [
      { type: 'required', message: 'Zorunlu alan' },
      { type: 'minLength', value: 3, message: 'En az 3 karakter' },
    ],
    isRequired: true,
    isUnique: false,
    isSearchable: true,
    isFilterable: false,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 1,
    width: 'half',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-006',
    groupId: 'group-002',
    code: 'EMERGENCY_PHONE_1',
    name: 'Acil Durum Telefon 1',
    fieldType: 'phone',
    entityType: 'student',
    placeholder: '+90 5XX XXX XX XX',
    validation: [
      { type: 'required', message: 'Zorunlu alan' },
      { type: 'pattern', value: '^\\+?[0-9]{10,15}$', message: 'Geçerli telefon numarası giriniz' },
    ],
    isRequired: true,
    isUnique: false,
    isSearchable: true,
    isFilterable: false,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 2,
    width: 'half',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },

  // INSTITUTION TECH FIELDS
  {
    id: 'field-007',
    groupId: 'group-003',
    code: 'COMPUTER_COUNT',
    name: 'Bilgisayar Sayısı',
    fieldType: 'number',
    entityType: 'institution',
    placeholder: '0',
    validation: [
      { type: 'min', value: 0, message: 'Negatif olamaz' },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: true,
    showInDetail: true,
    order: 1,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-008',
    groupId: 'group-003',
    code: 'INTERNET_SPEED',
    name: 'İnternet Hızı (Mbps)',
    fieldType: 'slider',
    entityType: 'institution',
    defaultValue: 50,
    validation: [
      { type: 'min', value: 0 },
      { type: 'max', value: 1000 },
    ],
    metadata: {
      min: 0,
      max: 1000,
      step: 10,
    },
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 2,
    width: 'half',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-009',
    groupId: 'group-003',
    code: 'SMART_BOARD',
    name: 'Akıllı Tahta',
    fieldType: 'checkbox',
    entityType: 'institution',
    options: [
      { id: 'opt-17', value: 'has_smart_board', label: 'Akıllı Tahta Var', order: 1 },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: true,
    showInDetail: true,
    order: 3,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },

  // EXAM SCORING FIELDS
  {
    id: 'field-010',
    groupId: 'group-004',
    code: 'BONUS_POINTS',
    name: 'Bonus Puan',
    fieldType: 'number',
    entityType: 'exam',
    placeholder: '0',
    helpText: 'Sınava eklenecek bonus puan',
    defaultValue: 0,
    validation: [
      { type: 'min', value: 0 },
      { type: 'max', value: 100 },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: false,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 1,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-011',
    groupId: 'group-004',
    code: 'DIFFICULTY_MULTIPLIER',
    name: 'Zorluk Çarpanı',
    fieldType: 'select',
    entityType: 'exam',
    options: [
      { id: 'opt-18', value: '0.8', label: '0.8x (Kolay)', color: '#10B981', order: 1 },
      { id: 'opt-19', value: '1.0', label: '1.0x (Normal)', color: '#3B82F6', order: 2 },
      { id: 'opt-20', value: '1.2', label: '1.2x (Zor)', color: '#F59E0B', order: 3 },
      { id: 'opt-21', value: '1.5', label: '1.5x (Çok Zor)', color: '#EF4444', order: 4 },
    ],
    defaultValue: '1.0',
    helpText: 'Soru zorluğuna göre puan çarpanı',
    isRequired: true,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: false,
    showInDetail: true,
    order: 2,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },

  // TEACHER QUALIFICATIONS
  {
    id: 'field-012',
    groupId: 'group-005',
    code: 'CERTIFICATIONS',
    name: 'Sertifikalar',
    fieldType: 'multiselect',
    entityType: 'teacher',
    options: [
      { id: 'opt-22', value: 'ped', label: 'Pedagojik Formasyon', icon: '🎓', order: 1 },
      { id: 'opt-23', value: 'tech', label: 'Teknoloji Sertifikası', icon: '💻', order: 2 },
      { id: 'opt-24', value: 'lang', label: 'Dil Yeterliliği', icon: '🌍', order: 3 },
      { id: 'opt-25', value: 'special', label: 'Özel Eğitim', icon: '♿', order: 4 },
      { id: 'opt-26', value: 'leadership', label: 'Liderlik', icon: '👔', order: 5 },
    ],
    isRequired: false,
    isUnique: false,
    isSearchable: true,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: true,
    showInDetail: true,
    order: 1,
    width: 'full',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-013',
    groupId: 'group-005',
    code: 'EXPERIENCE_YEARS',
    name: 'Deneyim Yılı',
    fieldType: 'number',
    entityType: 'teacher',
    placeholder: '0',
    validation: [
      { type: 'required', message: 'Zorunlu alan' },
      { type: 'min', value: 0 },
      { type: 'max', value: 50 },
    ],
    isRequired: true,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: true,
    showInDetail: true,
    order: 2,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'field-014',
    groupId: 'group-005',
    code: 'RATING',
    name: 'Değerlendirme',
    description: 'Öğretmen performans değerlendirmesi',
    fieldType: 'rating',
    entityType: 'teacher',
    defaultValue: 0,
    metadata: {
      maxRating: 5,
      icon: '⭐',
    },
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isFilterable: true,
    isVisible: true,
    isEditable: true,
    showInList: true,
    showInDetail: true,
    order: 3,
    width: 'quarter',
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
];

// ============================================
// FIELD TEMPLATES
// ============================================

export const fieldTemplates: FieldTemplate[] = [
  {
    id: 'template-001',
    name: 'Standart Öğrenci Formu',
    description: 'Tüm öğrenciler için gerekli temel ve ek bilgiler',
    entityType: 'student',
    groups: demoFieldGroups.filter(g => g.entityType === 'student'),
    fields: demoDynamicFields.filter(f => f.entityType === 'student'),
    isSystemTemplate: true,
    usageCount: 120,
  },
  {
    id: 'template-002',
    name: 'Kurum Teknik Altyapı',
    description: 'Kurumların teknik donanım ve altyapı bilgileri',
    entityType: 'institution',
    groups: demoFieldGroups.filter(g => g.entityType === 'institution'),
    fields: demoDynamicFields.filter(f => f.entityType === 'institution'),
    isSystemTemplate: true,
    usageCount: 45,
  },
  {
    id: 'template-003',
    name: 'Gelişmiş Sınav Ayarları',
    description: 'Sınavlar için özel puanlama ve ayarlar',
    entityType: 'exam',
    groups: demoFieldGroups.filter(g => g.entityType === 'exam'),
    fields: demoDynamicFields.filter(f => f.entityType === 'exam'),
    isSystemTemplate: true,
    usageCount: 89,
  },
];

// ============================================
// DEMO FIELD VALUES
// ============================================

export const demoFieldValues: DynamicFieldValue[] = [
  {
    id: 'value-001',
    entityId: 'student-001',
    entityType: 'student',
    fieldId: 'field-001',
    value: 'A+',
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'value-002',
    entityId: 'student-001',
    entityType: 'student',
    fieldId: 'field-002',
    value: 'Polen alerjisi',
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'value-003',
    entityId: 'student-001',
    entityType: 'student',
    fieldId: 'field-003',
    value: 'none',
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFieldsByGroup(groupId: string): DynamicField[] {
  return demoDynamicFields
    .filter(f => f.groupId === groupId)
    .sort((a, b) => a.order - b.order);
}

export function getGroupsByEntity(entityType: EntityType): FieldGroup[] {
  return demoFieldGroups
    .filter(g => g.entityType === entityType)
    .sort((a, b) => a.order - b.order);
}

export function getFieldsByEntity(entityType: EntityType): DynamicField[] {
  return demoDynamicFields
    .filter(f => f.entityType === entityType)
    .sort((a, b) => a.order - b.order);
}

export function getFieldValue(entityId: string, fieldId: string): any {
  const value = demoFieldValues.find(v => v.entityId === entityId && v.fieldId === fieldId);
  return value?.value;
}

export function setFieldValue(entityId: string, entityType: EntityType, fieldId: string, value: any): DynamicFieldValue {
  const existing = demoFieldValues.find(v => v.entityId === entityId && v.fieldId === fieldId);
  
  if (existing) {
    existing.value = value;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const newValue: DynamicFieldValue = {
    id: `value-${Date.now()}`,
    entityId,
    entityType,
    fieldId,
    value,
    createdBy: 'current-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  demoFieldValues.push(newValue);
  return newValue;
}

export function validateField(field: DynamicField, value: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!field.validation) {
    return { isValid: true, errors: [] };
  }

  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message || 'Bu alan zorunludur');
        }
        break;

      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          errors.push(rule.message || `Minimum değer: ${rule.value}`);
        }
        break;

      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          errors.push(rule.message || `Maksimum değer: ${rule.value}`);
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          errors.push(rule.message || `En az ${rule.value} karakter olmalı`);
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          errors.push(rule.message || `En fazla ${rule.value} karakter olmalı`);
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && rule.value) {
          const regex = new RegExp(rule.value);
          if (!regex.test(value)) {
            errors.push(rule.message || 'Geçersiz format');
          }
        }
        break;

      case 'email':
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message || 'Geçerli bir email adresi giriniz');
          }
        }
        break;

      case 'url':
        if (typeof value === 'string') {
          try {
            new URL(value);
          } catch {
            errors.push(rule.message || 'Geçerli bir URL giriniz');
          }
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getFieldStatistics() {
  return {
    totalGroups: demoFieldGroups.length,
    totalFields: demoDynamicFields.length,
    totalValues: demoFieldValues.length,
    fieldsByType: demoDynamicFields.reduce((acc, field) => {
      acc[field.fieldType] = (acc[field.fieldType] || 0) + 1;
      return acc;
    }, {} as Record<FieldType, number>),
    fieldsByEntity: demoDynamicFields.reduce((acc, field) => {
      acc[field.entityType] = (acc[field.entityType] || 0) + 1;
      return acc;
    }, {} as Record<EntityType, number>),
  };
}

export function createFieldFromTemplate(template: FieldTemplate, entityId: string) {
  // Şablondan yeni alan oluştur
  return {
    groups: template.groups,
    fields: template.fields,
    entityId,
  };
}

export function exportFieldDefinitions(entityType?: EntityType) {
  const groups = entityType ? getGroupsByEntity(entityType) : demoFieldGroups;
  const fields = entityType ? getFieldsByEntity(entityType) : demoDynamicFields;

  return {
    groups,
    fields,
    exportedAt: new Date().toISOString(),
  };
}

