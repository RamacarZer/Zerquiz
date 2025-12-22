// Content API Service
import { apiClient } from '../../lib/api-client';
import axios from 'axios';

// Content Service URL (Port 5008)
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || 'http://localhost:5008';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ContentFile {
  id: string;
  title: string;
  contentType: 'pdf' | 'docx' | 'pptx' | 'txt';
  fileSize: number;
  processingStatus: 'pending' | 'processing' | 'ready' | 'failed';
  uploadedAt: string;
  processedAt?: string;
  tags?: string[];
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    estimatedReadingTimeMinutes?: number;
    languageDetected?: string;
    textPreview?: string;
  };
}

export interface GenerationJobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
}

export interface GenerationJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  completedItems: number;
  totalItems: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface GeneratedContentItem {
  id: string;
  generationType: 'quiz' | 'flashcard' | 'summary' | 'worksheet';
  questionTypeCode?: string;
  status: 'draft' | 'reviewed' | 'published' | 'rejected';
  itemCount: number;
  difficulty?: string;
  language?: string;
  createdAt: string;
  publishedAt?: string;
  preview: string;
}

export interface QuizGenerationRequest {
  contentItemId: string;
  questionTypes: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
  language: string;
}

export interface FlashcardGenerationRequest {
  contentItemId: string;
  count: number;
  language: string;
}

export interface SummaryGenerationRequest {
  contentItemId: string;
  length: 'short' | 'medium' | 'long';
  language: string;
}

export interface WorksheetGenerationRequest {
  contentItemId: string;
  questionTypes: string[];
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  includeAnswerKey: boolean;
}

export const contentService = {
  // Get all content files
  async getAll(tenantId: string, contentType?: string, page = 1, pageSize = 20): Promise<{ total: number; items: ContentFile[] }> {
    const params = new URLSearchParams({ 
      tenantId,
      page: page.toString(), 
      pageSize: pageSize.toString() 
    });
    if (contentType) params.append('contentType', contentType);
    
    const response = await axios.get(`${CONTENT_API_URL}/api/Content/list?${params}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get single content file with metadata
  async getById(id: string): Promise<ContentFile> {
    const response = await axios.get(`${CONTENT_API_URL}/api/Content/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Upload new file
  async upload(file: File, title?: string, tenantId?: string, userId?: string): Promise<ContentFile> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (tenantId) formData.append('tenantId', tenantId);
    if (userId) formData.append('userId', userId);
    
    const response = await axios.post(`${CONTENT_API_URL}/api/Content/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete content file
  async delete(id: string): Promise<void> {
    await axios.delete(`${CONTENT_API_URL}/api/Content/${id}`, {
      headers: getAuthHeaders()
    });
  },

  // Get extracted text
  async getExtractedText(id: string): Promise<{ extractedText: string }> {
    const response = await axios.get(`${CONTENT_API_URL}/api/Content/${id}/extract`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // === AI GENERATION ENDPOINTS ===

  // Generate Quiz
  async generateQuiz(request: QuizGenerationRequest): Promise<GenerationJobResponse> {
    const response = await axios.post(`${CONTENT_API_URL}/api/AIGeneration/generate/quiz`, request, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Generate Flashcards
  async generateFlashcards(request: FlashcardGenerationRequest): Promise<GenerationJobResponse> {
    const response = await axios.post(`${CONTENT_API_URL}/api/AIGeneration/generate/flashcards`, request, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Generate Summary
  async generateSummary(request: SummaryGenerationRequest): Promise<GenerationJobResponse> {
    const response = await axios.post(`${CONTENT_API_URL}/api/AIGeneration/generate/summary`, request, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Generate Worksheet
  async generateWorksheet(request: WorksheetGenerationRequest): Promise<GenerationJobResponse> {
    const response = await axios.post(`${CONTENT_API_URL}/api/AIGeneration/generate/worksheet`, request, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get generation job status
  async getJobStatus(jobId: string): Promise<GenerationJobStatus> {
    const response = await axios.get(`${CONTENT_API_URL}/api/AIGeneration/job/${jobId}/status`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get generated content for a content item
  async getGeneratedContent(contentId: string, type?: string): Promise<GeneratedContentItem[]> {
    const params = type ? `?type=${type}` : '';
    const response = await axios.get(`${CONTENT_API_URL}/api/AIGeneration/content/${contentId}/generated${params}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Approve generated content
  async approveGenerated(id: string): Promise<{ message: string }> {
    const response = await axios.post(`${CONTENT_API_URL}/api/AIGeneration/${id}/approve`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
};
