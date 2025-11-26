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

const API_BASE = "/api/questions";

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
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await axios.post(`${API_BASE}`, data);
    return response.data;
  },

  async updateQuestion(
    id: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  },

  // Question Format Types
  async getFormatTypes(): Promise<QuestionFormatType[]> {
    const response = await axios.get(`${API_BASE}/formats`);
    return response.data;
  },

  async getFormatType(id: string): Promise<QuestionFormatType> {
    const response = await axios.get(`${API_BASE}/formats/${id}`);
    return response.data;
  },

  // Pedagogical Types
  async getPedagogicalTypes(): Promise<QuestionPedagogicalType[]> {
    const response = await axios.get(`${API_BASE}/pedagogical-types`);
    return response.data;
  },

  // Presentation Types
  async getPresentationTypes(): Promise<any[]> {
    const response = await axios.get(`${API_BASE}/presentation-types`);
    return response.data;
  },

  // Difficulty Levels
  async getDifficultyLevels(): Promise<any[]> {
    const response = await axios.get(`${API_BASE}/difficulty-levels`);
    return response.data;
  },

  // Question Versions
  async getQuestionVersions(questionId: string): Promise<QuestionVersion[]> {
    const response = await axios.get(`${API_BASE}/${questionId}/versions`);
    return response.data;
  },

  async getQuestionVersion(
    questionId: string,
    versionId: string
  ): Promise<QuestionVersion> {
    const response = await axios.get(
      `${API_BASE}/${questionId}/versions/${versionId}`
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

    const response = await axios.post(`/api/assets/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getAssetsByVersion(
    questionVersionId: string
  ): Promise<QuestionAsset[]> {
    const response = await axios.get(
      `/api/assets/by-version/${questionVersionId}`
    );
    return response.data;
  },

  async deleteAsset(assetId: string): Promise<void> {
    await axios.delete(`/api/assets/${assetId}`);
  },
};
