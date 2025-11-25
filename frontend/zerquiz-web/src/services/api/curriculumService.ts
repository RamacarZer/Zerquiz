import apiClient from "./apiClient";
import { ApiResponse } from "../../types/api";

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
    "/curriculum/educationmodels"
  );
  return response.data.data || [];
};

export const curriculumService = {
  // Education Models
  getEducationModels: async () => {
    const response = await apiClient.get<ApiResponse<EducationModelDto[]>>(
      "/curriculum/educationmodels"
    );
    return response.data.data;
  },

  getEducationModel: async (id: string) => {
    const response = await apiClient.get<ApiResponse<EducationModelDto>>(
      `/curriculum/educationmodels/${id}`
    );
    return response.data.data;
  },

  createEducationModel: async (data: CreateEducationModelRequest) => {
    const response = await apiClient.post<ApiResponse<EducationModelDto>>(
      "/curriculum/educationmodels",
      data
    );
    return response.data.data;
  },

  updateEducationModel: async (
    id: string,
    data: CreateEducationModelRequest
  ) => {
    const response = await apiClient.put<ApiResponse<EducationModelDto>>(
      `/curriculum/educationmodels/${id}`,
      data
    );
    return response.data.data;
  },

  deleteEducationModel: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/curriculum/educationmodels/${id}`
    );
    return response.data.data;
  },

  toggleEducationModelStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/curriculum/educationmodels/${id}/toggle-status`
    );
    return response.data.data;
  },

  // Subjects
  getSubjects: async () => {
    const response = await apiClient.get<ApiResponse<SubjectDto[]>>(
      "/curriculum/subjects"
    );
    return response.data.data;
  },

  getSubject: async (id: string) => {
    const response = await apiClient.get<ApiResponse<SubjectDto>>(
      `/curriculum/subjects/${id}`
    );
    return response.data.data;
  },

  createSubject: async (data: CreateSubjectRequest) => {
    const response = await apiClient.post<ApiResponse<SubjectDto>>(
      "/curriculum/subjects",
      data
    );
    return response.data.data;
  },

  updateSubject: async (id: string, data: CreateSubjectRequest) => {
    const response = await apiClient.put<ApiResponse<SubjectDto>>(
      `/curriculum/subjects/${id}`,
      data
    );
    return response.data.data;
  },

  deleteSubject: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/curriculum/subjects/${id}`
    );
    return response.data.data;
  },

  // Topics
  getTopics: async (subjectId?: string) => {
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(
      "/curriculum/topics",
      { params: { subjectId } }
    );
    return response.data.data;
  },

  getTopicsBySubject: async (subjectId: string) => {
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(
      `/curriculum/topics/subject/${subjectId}`
    );
    return response.data.data;
  },

  getTopic: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/curriculum/topics/${id}`
    );
    return response.data.data;
  },

  createTopic: async (data: CreateTopicRequest) => {
    const response = await apiClient.post<ApiResponse<TopicDto>>(
      "/curriculum/topics",
      data
    );
    return response.data.data;
  },

  updateTopic: async (
    id: string,
    data: { name: string; displayOrder: number }
  ) => {
    const response = await apiClient.put<ApiResponse<TopicDto>>(
      `/curriculum/topics/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTopic: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/curriculum/topics/${id}`
    );
    return response.data.data;
  },

  // Curricula
  getCurricula: async (educationModelId?: string, year?: number) => {
    const response = await apiClient.get<ApiResponse<CurriculumDto[]>>(
      "/curriculum/curricula",
      { params: { educationModelId, year } }
    );
    return response.data.data;
  },

  createCurriculum: async (data: CreateCurriculumRequest) => {
    const response = await apiClient.post<ApiResponse<CurriculumDto>>(
      "/curriculum/curricula",
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
      "/curriculum/learningoutcomes",
      { params: { curriculumId, subjectId, topicId } }
    );
    return response.data.data;
  },

  createLearningOutcome: async (data: CreateLearningOutcomeRequest) => {
    const response = await apiClient.post<ApiResponse<LearningOutcomeDto>>(
      "/curriculum/learningoutcomes",
      data
    );
    return response.data.data;
  },

  updateLearningOutcome: async (
    id: string,
    data: { description: string; details?: string }
  ) => {
    const response = await apiClient.put<ApiResponse<LearningOutcomeDto>>(
      `/curriculum/learningoutcomes/${id}`,
      data
    );
    return response.data.data;
  },

  deleteLearningOutcome: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/curriculum/learningoutcomes/${id}`
    );
    return response.data.data;
  },
};
