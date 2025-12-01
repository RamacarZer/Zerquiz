// Lessons API Service
import { apiClient } from '../lib/api-client';

export interface LessonPlan {
  id: string;
  tenantId: string;
  createdBy: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  lessonTemplateId?: string;
  objectives: string[];
  materialsNeeded: string[];
  activities: LessonActivity[];
  status: 'draft' | 'published' | 'archived';
  generationSource: 'manual' | 'template' | 'ai';
  createdAt: string;
  updatedAt: string;
}

export interface LessonActivity {
  id: string;
  lessonPlanId: string;
  activityType: 'warm_up' | 'main' | 'practice' | 'closing';
  title: string;
  description: string;
  duration: number;
  instructions: string;
  displayOrder: number;
}

export interface LessonTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  structure: any;
  isSystemReserved: boolean;
}

export interface Assignment {
  id: string;
  lessonPlanId?: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  points: number;
  assignmentType: string;
  rubricId?: string;
  attachedResources: string[];
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt?: string;
  status: 'pending' | 'graded' | 'late';
  submissionText?: string;
  submissionFiles: string[];
  score?: number;
  feedback?: string;
  rubricScores?: any;
}

export const lessonsService = {
  // Lesson Plans
  async getAllLessonPlans(): Promise<LessonPlan[]> {
    const response = await apiClient.get('/lessons/LessonPlans/list');
    return response.data;
  },

  async getLessonPlan(id: string): Promise<LessonPlan> {
    const response = await apiClient.get(`/lessons/LessonPlans/${id}`);
    return response.data;
  },

  async createLessonPlan(data: Partial<LessonPlan>): Promise<LessonPlan> {
    const response = await apiClient.post('/lessons/LessonPlans/create', data);
    return response.data;
  },

  async updateLessonPlan(id: string, data: Partial<LessonPlan>): Promise<LessonPlan> {
    const response = await apiClient.put(`/lessons/LessonPlans/${id}`, data);
    return response.data;
  },

  async deleteLessonPlan(id: string): Promise<void> {
    await apiClient.delete(`/lessons/LessonPlans/${id}`);
  },

  async duplicateLessonPlan(id: string): Promise<LessonPlan> {
    const response = await apiClient.post(`/lessons/LessonPlans/${id}/duplicate`);
    return response.data;
  },

  async generateLessonPlanWithAI(data: any): Promise<LessonPlan> {
    const response = await apiClient.post('/lessons/LessonPlans/generate-ai', data);
    return response.data;
  },

  // Templates
  async getAllTemplates(): Promise<LessonTemplate[]> {
    const response = await apiClient.get('/lessons/LessonTemplates');
    return response.data;
  },

  async getTemplate(code: string): Promise<LessonTemplate> {
    const response = await apiClient.get(`/lessons/LessonTemplates/${code}`);
    return response.data;
  },

  // Assignments
  async getAllAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get('/lessons/Assignments/list');
    return response.data;
  },

  async getAssignment(id: string): Promise<Assignment> {
    const response = await apiClient.get(`/lessons/Assignments/${id}`);
    return response.data;
  },

  async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
    const response = await apiClient.post('/lessons/Assignments/create', data);
    return response.data;
  },

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    const response = await apiClient.put(`/lessons/Assignments/${id}`, data);
    return response.data;
  },

  async publishAssignment(id: string): Promise<void> {
    await apiClient.post(`/lessons/Assignments/${id}/publish`);
  },

  async getSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const response = await apiClient.get(`/lessons/Assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Submissions (Student)
  async submitAssignment(assignmentId: string, data: Partial<AssignmentSubmission>): Promise<AssignmentSubmission> {
    const response = await apiClient.post('/lessons/Submissions/submit', {
      assignmentId,
      ...data,
    });
    return response.data;
  },

  async getMySubmissions(): Promise<AssignmentSubmission[]> {
    const response = await apiClient.get('/lessons/Submissions/my-submissions');
    return response.data;
  },

  async gradeSubmission(id: string, score: number, feedback: string, rubricScores?: any): Promise<void> {
    await apiClient.post(`/lessons/Submissions/${id}/grade`, {
      score,
      feedback,
      rubricScores,
    });
  },
};

