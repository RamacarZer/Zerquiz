import apiClient from "./apiClient";
import { ApiResponse } from "../../types/api";
import type { Subject, Topic, LearningOutcome, EducationModel } from "../../types/curriculum.types";

export interface EducationModelDto {
  id: string;
  code: string;
  name: string;
  country: string;
  description?: string;
  isActive: boolean;
}

export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TopicDto {
  id: string;
  subjectId: string;
  parentTopicId?: string;
  code: string;
  name: string;
  level: number;
  displayOrder: number;
  subTopics?: TopicDto[];
}

export interface CurriculumDto {
  id: string;
  educationModelId: string;
  educationModelName: string;
  name: string;
  year: number;
  term: string;
  version: string;
  isActive: boolean;
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
}

export interface CreateEducationModelRequest {
  code: string;
  name: string;
  country: string;
  description?: string;
}

export interface CreateSubjectRequest {
  code: string;
  name: string;
  displayOrder: number;
}

export interface CreateTopicRequest {
  subjectId: string;
  parentTopicId?: string;
  code: string;
  name: string;
  level: number;
  displayOrder: number;
}

export interface CreateCurriculumRequest {
  educationModelId: string;
  name: string;
  year: number;
  term: string;
  version: string;
}

export interface CreateLearningOutcomeRequest {
  curriculumId: string;
  subjectId: string;
  topicId?: string;
  code: string;
  description: string;
  details?: string;
}

// Education Models - Standalone exports
export const getEducationModels = async (): Promise<EducationModelDto[]> => {
  const response = await apiClient.get<ApiResponse<EducationModelDto[]>>(
    "/api/curriculum/EducationModels"
  );
  return response.data.data || [];
};

export const curriculumService = {
  // Education Models
  getEducationModels: async () => {
    const response = await apiClient.get<ApiResponse<EducationModelDto[]>>(
      "/api/curriculum/EducationModels"
    );
    return response.data.data;
  },

  getEducationModel: async (id: string) => {
    const response = await apiClient.get<ApiResponse<EducationModelDto>>(
      `/api/curriculum/EducationModels/${id}`
    );
    return response.data.data;
  },

  createEducationModel: async (data: CreateEducationModelRequest) => {
    const response = await apiClient.post<ApiResponse<EducationModelDto>>(
      "/api/curriculum/EducationModels",
      data
    );
    return response.data.data;
  },

  updateEducationModel: async (
    id: string,
    data: CreateEducationModelRequest
  ) => {
    const response = await apiClient.put<ApiResponse<EducationModelDto>>(
      `/api/curriculum/EducationModels/${id}`,
      data
    );
    return response.data.data;
  },

  deleteEducationModel: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/api/curriculum/EducationModels/${id}`
    );
    return response.data.data;
  },

  toggleEducationModelStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/api/curriculum/EducationModels/${id}/toggle-status`
    );
    return response.data.data;
  },

  // Subjects
  getSubjects: async () => {
    const response = await apiClient.get<ApiResponse<SubjectDto[]>>(
      "/api/curriculum/Subjects"
    );
    return response.data.data;
  },

  getSubject: async (id: string) => {
    const response = await apiClient.get<ApiResponse<SubjectDto>>(
      `/api/curriculum/Subjects/${id}`
    );
    return response.data.data;
  },

  createSubject: async (data: CreateSubjectRequest) => {
    const response = await apiClient.post<ApiResponse<SubjectDto>>(
      "/api/curriculum/Subjects",
      data
    );
    return response.data.data;
  },

  updateSubject: async (id: string, data: CreateSubjectRequest) => {
    const response = await apiClient.put<ApiResponse<SubjectDto>>(
      `/api/curriculum/Subjects/${id}`,
      data
    );
    return response.data.data;
  },

  deleteSubject: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/api/curriculum/Subjects/${id}`
    );
    return response.data.data;
  },

  // Topics
  getTopics: async (subjectId?: string) => {
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(
      "/api/curriculum/Topics",
      { params: { subjectId } }
    );
    return response.data.data;
  },

  getTopicsBySubject: async (subjectId: string) => {
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(
      `/api/curriculum/Topics/subject/${subjectId}`
    );
    return response.data.data;
  },

  getTopic: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/curriculum/Topics/${id}`
    );
    return response.data.data;
  },

  createTopic: async (data: CreateTopicRequest) => {
    const response = await apiClient.post<ApiResponse<TopicDto>>(
      "/api/curriculum/Topics",
      data
    );
    return response.data.data;
  },

  updateTopic: async (
    id: string,
    data: { name: string; displayOrder: number }
  ) => {
    const response = await apiClient.put<ApiResponse<TopicDto>>(
      `/api/curriculum/Topics/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTopic: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/api/curriculum/Topics/${id}`
    );
    return response.data.data;
  },

  // Curricula
  getCurricula: async (educationModelId?: string, year?: number) => {
    const response = await apiClient.get<ApiResponse<CurriculumDto[]>>(
      "/api/curriculum/Curricula",
      { params: { educationModelId, year } }
    );
    return response.data.data;
  },

  createCurriculum: async (data: CreateCurriculumRequest) => {
    const response = await apiClient.post<ApiResponse<CurriculumDto>>(
      "/api/curriculum/Curricula",
      data
    );
    return response.data.data;
  },

  // Learning Outcomes
  getLearningOutcomes: async (
    curriculumId?: string,
    subjectId?: string,
    topicId?: string
  ) => {
    const response = await apiClient.get<ApiResponse<LearningOutcomeDto[]>>(
      "/api/curriculum/LearningOutcomes",
      { params: { curriculumId, subjectId, topicId } }
    );
    return response.data.data;
  },

  createLearningOutcome: async (data: CreateLearningOutcomeRequest) => {
    const response = await apiClient.post<ApiResponse<LearningOutcomeDto>>(
      "/api/curriculum/LearningOutcomes",
      data
    );
    return response.data.data;
  },

  updateLearningOutcome: async (
    id: string,
    data: { description: string; details?: string }
  ) => {
    const response = await apiClient.put<ApiResponse<LearningOutcomeDto>>(
      `/api/curriculum/LearningOutcomes/${id}`,
      data
    );
    return response.data.data;
  },

  deleteLearningOutcome: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/api/curriculum/LearningOutcomes/${id}`
    );
    return response.data.data;
  },

  // Simplified methods for Question Create Modal
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await apiClient.get<ApiResponse<SubjectDto[]>>('/api/curriculum/Subjects');
      return response.data.data.map(s => ({
        id: s.id,
        code: s.code,
        name: s.name,
        displayOrder: s.displayOrder,
        createdAt: new Date().toISOString()
      }));
    } catch {
      return [];
    }
  },

  async getTopics(params?: { subjectId?: string }): Promise<Topic[]> {
    try {
      const response = await apiClient.get<ApiResponse<TopicDto[]>>('/api/curriculum/Topics', { params });
      return response.data.data.map(t => ({
        id: t.id,
        subjectId: t.subjectId,
        parentTopicId: t.parentTopicId,
        code: t.code,
        name: t.name,
        level: t.level,
        displayOrder: t.displayOrder,
        createdAt: new Date().toISOString()
      }));
    } catch {
      return [];
    }
  },

  async getLearningOutcomes(params?: { topicId?: string }): Promise<LearningOutcome[]> {
    try {
      const response = await apiClient.get<ApiResponse<LearningOutcomeDto[]>>('/api/curriculum/LearningOutcomes', { params });
      return response.data.data.map(o => ({
        id: o.id,
        curriculumId: o.curriculumId || '',
        subjectId: o.subjectId || '',
        topicId: o.topicId,
        code: o.code,
        description: o.description,
        details: o.details,
        createdAt: new Date().toISOString()
      }));
    } catch {
      return [];
    }
  },
};
