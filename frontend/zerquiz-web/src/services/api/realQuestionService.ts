import axios from 'axios';

const API_BASE_URL = 'http://localhost:5004/api';

export interface QuestionFormatType {
  id: string;
  code: string;
  name: string;
  description?: string;
  requiresOptions?: boolean;
  minOptions?: number;
  maxOptions?: number;
  allowsMultipleCorrect?: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface QuestionPedagogicalType {
  id: string;
  code: string;
  name: string;
  description?: string;
  bloomLevel: number;
  isActive: boolean;
  displayOrder: number;
}

export interface QuestionDifficultyLevel {
  id: string;
  name: string;
  level: number;
  description?: string;
  isActive: boolean;
}

export interface QuestionPresentationType {
  id: string;
  code: string;
  name: string;
  description?: string;
  requiresMedia?: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface CreateQuestionDto {
  tenantId: string;
  formatTypeId: string;
  pedagogicalTypeId?: string;
  difficultyLevelId: string;
  presentationTypeId?: string;
  subjectId?: string;
  topicId?: string;
  learningOutcomeId?: string;
  code?: string;
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
  bloomTaxonomyLevel?: string;
  estimatedTimeInSeconds?: number;
  weight?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

class RealQuestionService {
  // Get all format types
  async getFormatTypes(): Promise<QuestionFormatType[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/formats`);
      return response.data;
    } catch (error) {
      // Return demo data when backend is not available
      return [
        { id: '1', code: 'MULTIPLE_CHOICE', name: 'Çoktan Seçmeli', description: 'Klasik test sorusu' },
        { id: '2', code: 'TRUE_FALSE', name: 'Doğru/Yanlış', description: 'İki seçenekli soru' },
        { id: '3', code: 'SHORT_ANSWER', name: 'Kısa Cevap', description: 'Açık uçlu kısa cevap' },
        { id: '4', code: 'ESSAY', name: 'Kompozisyon', description: 'Uzun açık uçlu cevap' },
        { id: '5', code: 'FILL_BLANK', name: 'Boşluk Doldurma', description: 'Eksik kelime tamamlama' },
      ];
    }
  }

  // Get all pedagogical types
  async getPedagogicalTypes(): Promise<QuestionPedagogicalType[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/pedagogical-types`);
      return response.data;
    } catch (error) {
      // Return demo data when backend is not available
      return [
        { id: '1', code: 'KNOWLEDGE', name: 'Bilgi', description: 'Bloom: Hatırlama' },
        { id: '2', code: 'COMPREHENSION', name: 'Kavrama', description: 'Bloom: Anlama' },
        { id: '3', code: 'APPLICATION', name: 'Uygulama', description: 'Bloom: Uygulama' },
        { id: '4', code: 'ANALYSIS', name: 'Analiz', description: 'Bloom: Çözümleme' },
        { id: '5', code: 'SYNTHESIS', name: 'Sentez', description: 'Bloom: Değerlendirme' },
        { id: '6', code: 'EVALUATION', name: 'Değerlendirme', description: 'Bloom: Yaratma' },
      ];
    }
  }

  // Get all difficulty levels
  async getDifficultyLevels(): Promise<QuestionDifficultyLevel[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/difficulty-levels`);
      return response.data;
    } catch (error) {
      // Return demo data when backend is not available
      return [
        { id: '1', code: 'VERY_EASY', name: 'Çok Kolay', level: 1, color: '#10B981' },
        { id: '2', code: 'EASY', name: 'Kolay', level: 2, color: '#3B82F6' },
        { id: '3', code: 'MEDIUM', name: 'Orta', level: 3, color: '#F59E0B' },
        { id: '4', code: 'HARD', name: 'Zor', level: 4, color: '#EF4444' },
        { id: '5', code: 'VERY_HARD', name: 'Çok Zor', level: 5, color: '#7C3AED' },
      ];
    }
  }

  // Get all presentation types
  async getPresentationTypes(): Promise<QuestionPresentationType[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/presentation-types`);
      return response.data;
    } catch (error) {
      // Return demo data when backend is not available
      return [
        { id: '1', code: 'TEXT_ONLY', name: 'Sadece Metin', description: 'Sade metin formatı' },
        { id: '2', code: 'WITH_IMAGE', name: 'Görsel ile', description: 'Resim içeren soru' },
        { id: '3', code: 'WITH_VIDEO', name: 'Video ile', description: 'Video içeren soru' },
        { id: '4', code: 'WITH_AUDIO', name: 'Ses ile', description: 'Ses dosyası içeren' },
        { id: '5', code: 'INTERACTIVE', name: 'Etkileşimli', description: 'İnteraktif içerik' },
      ];
    }
  }

  // Create question
  async createQuestion(data: CreateQuestionDto): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create question:', error);
      throw error;
    }
  }

  // Get question by ID
  async getQuestionById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch question:', error);
      throw error;
    }
  }

  // Update question
  async updateQuestion(id: string, data: Partial<CreateQuestionDto>): Promise<any> {
    try {
      const response = await axios.put(`${API_BASE_URL}/questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update question:', error);
      throw error;
    }
  }
}

export const realQuestionService = new RealQuestionService();

