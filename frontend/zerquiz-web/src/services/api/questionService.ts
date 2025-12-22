import axios from "axios";
import type {
  Question,
  QuestionFormatType,
  QuestionPedagogicalType,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionVersion,
  QuestionAsset,
  AssetUploadResponse,
} from "../../types/question.types";

// Questions Service URL (Port 5004)
const QUESTIONS_API_URL = import.meta.env.VITE_QUESTIONS_API_URL || 'http://localhost:5004';
const API_BASE = `${QUESTIONS_API_URL}/api/Questions`;

// Configure axios instance with auth
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const questionService = {
  // Questions
  async getQuestions(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    difficulty?: string;
    subjectId?: string;
    topicId?: string;
    search?: string;
  }): Promise<{ items: Question[]; total: number; totalCount?: number }> {
    const { page, pageSize, ...otherParams } = params || {};
    const response = await axios.get(`${API_BASE}`, {
      params: {
        pageNumber: page,
        pageSize,
        ...otherParams,
      },
      headers: getAuthHeaders()
    });
    // Handle ApiResponse wrapper
    const data = response.data.data || response.data;
    return {
      items: data.items || [],
      total: data.totalCount || data.total || 0,
      totalCount: data.totalCount || data.total || 0,
    };
  },

  async getQuestion(id: string): Promise<Question> {
    const response = await axios.get(`${API_BASE}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await axios.post(`${API_BASE}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async updateQuestion(
    id: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await axios.put(`${API_BASE}/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`, {
      headers: getAuthHeaders()
    });
  },

  // Question Types (NEW - from backend QuestionTypesController)
  async getQuestionTypes(): Promise<any[]> {
    const response = await axios.get(`${QUESTIONS_API_URL}/api/QuestionTypes`, {
      headers: getAuthHeaders()
    });
    return response.data.data || response.data;
  },

  async getQuestionType(code: string): Promise<any> {
    const response = await axios.get(`${QUESTIONS_API_URL}/api/QuestionTypes/${code}`, {
      headers: getAuthHeaders()
    });
    return response.data.data || response.data;
  },

  async getQuestionTypeSchema(code: string): Promise<any> {
    const response = await axios.get(`${QUESTIONS_API_URL}/api/QuestionTypes/${code}/schema`, {
      headers: getAuthHeaders()
    });
    return response.data.data || response.data;
  },

  // Question Format Types
  async getFormatTypes(): Promise<QuestionFormatType[]> {
    const response = await axios.get(`${API_BASE}/formats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async getFormatType(id: string): Promise<QuestionFormatType> {
    const response = await axios.get(`${API_BASE}/formats/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Pedagogical Types
  async getPedagogicalTypes(): Promise<QuestionPedagogicalType[]> {
    const response = await axios.get(`${API_BASE}/pedagogical-types`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Presentation Types
  async getPresentationTypes(): Promise<any[]> {
    const response = await axios.get(`${API_BASE}/presentation-types`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Difficulty Levels
  async getDifficultyLevels(): Promise<any[]> {
    const response = await axios.get(`${API_BASE}/difficulty-levels`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // AI Generation (NEW)
  async generateWithAI(request: {
    prompt: string;
    questionType: string;
    difficulty?: string;
    count?: number;
  }): Promise<any> {
    const response = await axios.post(`${API_BASE}/generate-from-ai`, request, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Bulk Import (NEW)
  async bulkImport(questions: any[]): Promise<any> {
    const response = await axios.post(`${API_BASE}/bulk-import`, questions, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Question Versions
  async getQuestionVersions(questionId: string): Promise<QuestionVersion[]> {
    const response = await axios.get(`${API_BASE}/${questionId}/versions`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  async getQuestionVersion(
    questionId: string,
    versionId: string
  ): Promise<QuestionVersion> {
    const response = await axios.get(
      `${API_BASE}/${questionId}/versions/${versionId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Assets
  async uploadAsset(
    file: File,
    questionVersionId?: string,
    assetType?: string
  ): Promise<AssetUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (questionVersionId) {
      formData.append("questionVersionId", questionVersionId);
    }
    if (assetType) {
      formData.append("assetType", assetType);
    }

    const response = await axios.post(`${QUESTIONS_API_URL}/api/assets/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getAssetsByVersion(
    questionVersionId: string
  ): Promise<QuestionAsset[]> {
    const response = await axios.get(
      `${QUESTIONS_API_URL}/api/assets/by-version/${questionVersionId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  async deleteAsset(assetId: string): Promise<void> {
    await axios.delete(`${QUESTIONS_API_URL}/api/assets/${assetId}`, {
      headers: getAuthHeaders()
    });
  },
};
