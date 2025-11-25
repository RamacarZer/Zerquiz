import apiClient from "./apiClient";

// ==================== TYPES ====================

export interface QuestionDto {
  id: string;
  code: string;
  formatType: string;
  pedagogicalType?: string;
  subjectName: string;
  topicName?: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

export interface QuestionDetailDto {
  id: string;
  code: string;
  formatTypeId: string;
  pedagogicalTypeId?: string;
  subjectId: string;
  topicId?: string;
  difficulty: string;
  weight: number;
  status: string;
  currentVersion?: QuestionVersionDto;
  solutions?: QuestionSolutionDto[];
}

export interface QuestionVersionDto {
  id: string;
  versionNumber: number;
  content: string; // JSON string
  createdAt: string;
}

export interface QuestionSolutionDto {
  id: string;
  type: string;
  content: string;
  language?: string;
}

export interface QuestionFormatTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  isSystem: boolean;
  displayOrder: number;
}

export interface QuestionPedagogicalTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  isSystem: boolean;
  displayOrder: number;
}

export interface CreateQuestionRequest {
  formatTypeId: string;
  pedagogicalTypeId?: string;
  subjectId: string;
  topicId?: string;
  difficulty: string;
  weight: number;
  content: string; // JSON
}

export interface UpdateQuestionRequest {
  difficulty?: string;
  weight?: number;
  content?: string;
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

// ==================== API FUNCTIONS ====================

// Question Format Types
export const getQuestionFormatTypes = async (): Promise<QuestionFormatTypeDto[]> => {
  const response = await apiClient.get<ApiResponse<QuestionFormatTypeDto[]>>(
    "/questions/questionformats"
  );
  return response.data.data || [];
};

// Question Pedagogical Types
export const getQuestionPedagogicalTypes = async (): Promise<QuestionPedagogicalTypeDto[]> => {
  const response = await apiClient.get<ApiResponse<QuestionPedagogicalTypeDto[]>>(
    "/questions/pedagogicaltypes"
  );
  return response.data.data || [];
};

// Questions CRUD
export const getQuestions = async (params: {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  subjectId?: string;
  difficulty?: string;
}): Promise<PagedResult<QuestionDto>> => {
  const queryParams = new URLSearchParams();
  if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.status) queryParams.append("status", params.status);
  if (params.subjectId) queryParams.append("subjectId", params.subjectId);
  if (params.difficulty) queryParams.append("difficulty", params.difficulty);

  const response = await apiClient.get<ApiResponse<PagedResult<QuestionDto>>>(
    `/questions?${queryParams}`
  );
  return response.data.data;
};

export const getQuestionById = async (id: string): Promise<QuestionDetailDto> => {
  const response = await apiClient.get<ApiResponse<QuestionDetailDto>>(
    `/questions/${id}`
  );
  return response.data.data;
};

export const createQuestion = async (data: CreateQuestionRequest): Promise<QuestionDto> => {
  const response = await apiClient.post<ApiResponse<QuestionDto>>(
    "/questions",
    data
  );
  return response.data.data;
};

export const updateQuestion = async (id: string, data: UpdateQuestionRequest): Promise<QuestionDto> => {
  const response = await apiClient.put<ApiResponse<QuestionDto>>(
    `/questions/${id}`,
    data
  );
  return response.data.data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await apiClient.delete(`/questions/${id}`);
};

// Legacy export for compatibility
export const questionService = {
  getQuestionFormats: getQuestionFormatTypes,
  getQuestions: (pageNumber = 1, pageSize = 20, status?: string, subjectId?: string) =>
    getQuestions({ pageNumber, pageSize, status, subjectId }),
  getQuestion: getQuestionById,
  createQuestion,
  deleteQuestion,
};

