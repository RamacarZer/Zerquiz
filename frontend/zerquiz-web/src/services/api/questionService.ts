import apiClient from "./apiClient";

export interface QuestionDto {
  id: string;
  code: string;
  formatType: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

export interface QuestionFormatDto {
  id: string;
  code: string;
  name: string;
}

export interface CreateQuestionRequest {
  code: string;
  formatTypeId: string;
  subjectId: string;
  topicId?: string;
  difficulty: string;
  weight: number;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const questionService = {
  // Question Formats
  getQuestionFormats: async () => {
    const response = await apiClient.get<ApiResponse<QuestionFormatDto[]>>(
      "/questions/questionformats"
    );
    return response.data;
  },

  // Questions
  getQuestions: async (
    pageNumber: number = 1,
    pageSize: number = 20,
    status?: string,
    subjectId?: string
  ) => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    if (status) params.append("status", status);
    if (subjectId) params.append("subjectId", subjectId);

    const response = await apiClient.get<ApiResponse<PagedResult<QuestionDto>>>(
      `/questions?${params}`
    );
    return response.data;
  },

  getQuestion: async (id: string) => {
    const response = await apiClient.get<ApiResponse<QuestionDto>>(
      `/questions/${id}`
    );
    return response.data;
  },

  createQuestion: async (data: CreateQuestionRequest) => {
    const response = await apiClient.post<ApiResponse<QuestionDto>>(
      "/questions",
      data
    );
    return response.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/questions/${id}`
    );
    return response.data;
  },
};

