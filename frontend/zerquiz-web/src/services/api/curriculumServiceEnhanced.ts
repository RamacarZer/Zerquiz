import apiClient from "./apiClient";
import { ApiResponse } from "../../types/api";

// ==================== DTOs ====================

export interface EducationModelDto {
  id: string;
  code: string;
  name: string;
  country: string;
  description?: string;
  iconUrl?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  topicsCount?: number; // Computed
  outcomesCount?: number; // Computed
}

export interface TopicDto {
  id: string;
  subjectId: string;
  subjectName?: string;
  parentTopicId?: string;
  parentTopicName?: string;
  code: string;
  name: string;
  description?: string;
  level: number; // 1=Topic, 2=SubTopic, 3=Title
  displayOrder: number;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  subTopics?: TopicDto[]; // For hierarchical display
  outcomesCount?: number;
}

export interface CurriculumDto {
  id: string;
  educationModelId: string;
  educationModelName: string;
  name: string;
  year: number;
  term: string; // Fall, Spring, Summer
  version: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  outcomesCount?: number;
}

export interface LearningOutcomeDto {
  id: string;
  curriculumId?: string;
  curriculumName?: string;
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  code: string;
  description: string;
  details?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
}

// ==================== Translation DTOs ====================

export interface LanguageDto {
  code: string; // ISO 639-1 (tr, en, de, fr, ar, etc.)
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationDto {
  entityType: string; // "Subject", "Topic", "LearningOutcome"
  entityId: string;
  translations: Record<string, Record<string, string>>;
  // Format: { "en": { "Name": "Mathematics", "Description": "..." }, "de": { ... } }
}

// ==================== Request DTOs ====================

export interface CreateEducationModelRequest {
  code: string;
  name: string;
  country: string;
  description?: string;
  iconUrl?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateEducationModelRequest
  extends CreateEducationModelRequest {
  id: string;
}

export interface CreateSubjectRequest {
  code: string;
  name: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateSubjectRequest extends CreateSubjectRequest {
  id: string;
}

export interface CreateTopicRequest {
  subjectId: string;
  parentTopicId?: string;
  code: string;
  name: string;
  description?: string;
  level: number;
  displayOrder: number;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateTopicRequest extends CreateTopicRequest {
  id: string;
}

export interface CreateCurriculumRequest {
  educationModelId: string;
  name: string;
  year: number;
  term: string;
  version: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateCurriculumRequest extends CreateCurriculumRequest {
  id: string;
}

export interface CreateLearningOutcomeRequest {
  curriculumId?: string;
  subjectId?: string;
  topicId?: string;
  code: string;
  description: string;
  details?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateLearningOutcomeRequest
  extends CreateLearningOutcomeRequest {
  id: string;
}

export interface SaveTranslationsRequest {
  entityType: string;
  entityId: string;
  translations: Record<string, Record<string, string>>;
}

// ==================== Service ====================

export const curriculumServiceEnhanced = {
  // ==================== Education Models ====================

  getEducationModels: async (): Promise<EducationModelDto[]> => {
    const response = await apiClient.get<ApiResponse<EducationModelDto[]>>(
      "/curriculum/educationmodels"
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  getEducationModel: async (id: string): Promise<EducationModelDto> => {
    const response = await apiClient.get<ApiResponse<EducationModelDto>>(
      `/curriculum/educationmodels/${id}`
    );
    return response.data.data || response.data;
  },

  createEducationModel: async (
    request: CreateEducationModelRequest
  ): Promise<EducationModelDto> => {
    const response = await apiClient.post<ApiResponse<EducationModelDto>>(
      "/curriculum/educationmodels",
      request
    );
    return response.data.data || response.data;
  },

  updateEducationModel: async (
    id: string,
    request: UpdateEducationModelRequest
  ): Promise<EducationModelDto> => {
    const response = await apiClient.put<ApiResponse<EducationModelDto>>(
      `/curriculum/educationmodels/${id}`,
      request
    );
    return response.data.data || response.data;
  },

  deleteEducationModel: async (id: string): Promise<void> => {
    await apiClient.delete(`/curriculum/educationmodels/${id}`);
  },

  // ==================== Subjects ====================

  getSubjects: async (): Promise<SubjectDto[]> => {
    const response = await apiClient.get<ApiResponse<SubjectDto[]>>(
      "/curriculum/subjects"
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  getSubject: async (id: string): Promise<SubjectDto> => {
    const response = await apiClient.get<ApiResponse<SubjectDto>>(
      `/curriculum/subjects/${id}`
    );
    return response.data.data || response.data;
  },

  createSubject: async (request: CreateSubjectRequest): Promise<SubjectDto> => {
    const response = await apiClient.post<ApiResponse<SubjectDto>>(
      "/curriculum/subjects",
      request
    );
    return response.data.data || response.data;
  },

  updateSubject: async (
    id: string,
    request: UpdateSubjectRequest
  ): Promise<SubjectDto> => {
    const response = await apiClient.put<ApiResponse<SubjectDto>>(
      `/curriculum/subjects/${id}`,
      request
    );
    return response.data.data || response.data;
  },

  deleteSubject: async (id: string): Promise<void> => {
    await apiClient.delete(`/curriculum/subjects/${id}`);
  },

  // ==================== Topics ====================

  getTopics: async (subjectId?: string): Promise<TopicDto[]> => {
    const url = subjectId
      ? `/curriculum/topics?subjectId=${subjectId}`
      : "/curriculum/topics";
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(url);
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  getTopicsHierarchical: async (subjectId?: string): Promise<TopicDto[]> => {
    const allTopics = await curriculumServiceEnhanced.getTopics(subjectId);
    return buildTopicHierarchy(allTopics);
  },

  getTopic: async (id: string): Promise<TopicDto> => {
    const response = await apiClient.get<ApiResponse<TopicDto>>(
      `/curriculum/topics/${id}`
    );
    return response.data.data || response.data;
  },

  createTopic: async (request: CreateTopicRequest): Promise<TopicDto> => {
    const response = await apiClient.post<ApiResponse<TopicDto>>(
      "/curriculum/topics",
      request
    );
    return response.data.data || response.data;
  },

  updateTopic: async (
    id: string,
    request: UpdateTopicRequest
  ): Promise<TopicDto> => {
    const response = await apiClient.put<ApiResponse<TopicDto>>(
      `/curriculum/topics/${id}`,
      request
    );
    return response.data.data || response.data;
  },

  deleteTopic: async (id: string): Promise<void> => {
    await apiClient.delete(`/curriculum/topics/${id}`);
  },

  // ==================== Curricula ====================

  getCurricula: async (): Promise<CurriculumDto[]> => {
    const response = await apiClient.get<ApiResponse<CurriculumDto[]>>(
      "/curriculum/curricula"
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  getCurriculum: async (id: string): Promise<CurriculumDto> => {
    const response = await apiClient.get<ApiResponse<CurriculumDto>>(
      `/curriculum/curricula/${id}`
    );
    return response.data.data || response.data;
  },

  createCurriculum: async (
    request: CreateCurriculumRequest
  ): Promise<CurriculumDto> => {
    const response = await apiClient.post<ApiResponse<CurriculumDto>>(
      "/curriculum/curricula",
      request
    );
    return response.data.data || response.data;
  },

  updateCurriculum: async (
    id: string,
    request: UpdateCurriculumRequest
  ): Promise<CurriculumDto> => {
    const response = await apiClient.put<ApiResponse<CurriculumDto>>(
      `/curriculum/curricula/${id}`,
      request
    );
    return response.data.data || response.data;
  },

  deleteCurriculum: async (id: string): Promise<void> => {
    await apiClient.delete(`/curriculum/curricula/${id}`);
  },

  // ==================== Learning Outcomes ====================

  getLearningOutcomes: async (filters?: {
    curriculumId?: string;
    subjectId?: string;
    topicId?: string;
  }): Promise<LearningOutcomeDto[]> => {
    const params = new URLSearchParams();
    if (filters?.curriculumId)
      params.append("curriculumId", filters.curriculumId);
    if (filters?.subjectId) params.append("subjectId", filters.subjectId);
    if (filters?.topicId) params.append("topicId", filters.topicId);

    const url = params.toString()
      ? `/curriculum/learningoutcomes?${params}`
      : "/curriculum/learningoutcomes";

    const response = await apiClient.get<ApiResponse<LearningOutcomeDto[]>>(
      url
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  getLearningOutcome: async (id: string): Promise<LearningOutcomeDto> => {
    const response = await apiClient.get<ApiResponse<LearningOutcomeDto>>(
      `/curriculum/learningoutcomes/${id}`
    );
    return response.data.data || response.data;
  },

  createLearningOutcome: async (
    request: CreateLearningOutcomeRequest
  ): Promise<LearningOutcomeDto> => {
    const response = await apiClient.post<ApiResponse<LearningOutcomeDto>>(
      "/curriculum/learningoutcomes",
      request
    );
    return response.data.data || response.data;
  },

  updateLearningOutcome: async (
    id: string,
    request: UpdateLearningOutcomeRequest
  ): Promise<LearningOutcomeDto> => {
    const response = await apiClient.put<ApiResponse<LearningOutcomeDto>>(
      `/curriculum/learningoutcomes/${id}`,
      request
    );
    return response.data.data || response.data;
  },

  deleteLearningOutcome: async (id: string): Promise<void> => {
    await apiClient.delete(`/curriculum/learningoutcomes/${id}`);
  },

  // ==================== Translations ====================

  getTranslations: async (
    entityType: string,
    entityId: string
  ): Promise<Record<string, Record<string, string>>> => {
    const response = await apiClient.get<
      ApiResponse<Record<string, Record<string, string>>>
    >(`/curriculum/translations/${entityType}/${entityId}`);
    return response.data.data || response.data || {};
  },

  saveTranslations: async (request: SaveTranslationsRequest): Promise<void> => {
    await apiClient.post("/curriculum/translations", request);
  },

  getSupportedLanguages: async (): Promise<LanguageDto[]> => {
    const response = await apiClient.get<ApiResponse<LanguageDto[]>>(
      "/curriculum/translations/languages"
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },
};

// ==================== Helper Functions ====================

function buildTopicHierarchy(topics: TopicDto[]): TopicDto[] {
  const topicMap = new Map<string, TopicDto>();
  const rootTopics: TopicDto[] = [];

  // First pass: Create map and initialize subTopics
  topics.forEach((topic) => {
    topicMap.set(topic.id, { ...topic, subTopics: [] });
  });

  // Second pass: Build hierarchy
  topics.forEach((topic) => {
    const topicWithSubs = topicMap.get(topic.id)!;
    if (topic.parentTopicId) {
      const parent = topicMap.get(topic.parentTopicId);
      if (parent) {
        parent.subTopics = parent.subTopics || [];
        parent.subTopics.push(topicWithSubs);
      }
    } else {
      rootTopics.push(topicWithSubs);
    }
  });

  // Sort by displayOrder
  const sortTopics = (topics: TopicDto[]) => {
    topics.sort((a, b) => a.displayOrder - b.displayOrder);
    topics.forEach((topic) => {
      if (topic.subTopics && topic.subTopics.length > 0) {
        sortTopics(topic.subTopics);
      }
    });
  };

  sortTopics(rootTopics);
  return rootTopics;
}

export default curriculumServiceEnhanced;
