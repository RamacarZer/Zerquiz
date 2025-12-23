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
      // Silent fail - return empty array
      return [];
    }
  }

  // Get all pedagogical types
  async getPedagogicalTypes(): Promise<QuestionPedagogicalType[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/pedagogical-types`);
      return response.data;
    } catch (error) {
      // Silent fail - return empty array
      return [];
    }
  }

  // Get all difficulty levels
  async getDifficultyLevels(): Promise<QuestionDifficultyLevel[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/difficulty-levels`);
      return response.data;
    } catch (error) {
      // Silent fail - return empty array
      return [];
    }
  }

  // Get all presentation types
  async getPresentationTypes(): Promise<QuestionPresentationType[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/presentation-types`);
      return response.data;
    } catch (error) {
      // Silent fail - return empty array
      return [];
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

