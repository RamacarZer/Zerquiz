// Analytics API Service
import { apiClient } from '../../lib/api-client';

export interface StudentProgress {
  studentId: string;
  subjectId?: string;
  topicId?: string;
  totalQuestions: number;
  correctAnswers: number;
  masteryLevel: number; // 0-100
  lastActivityDate?: string;
  streakDays: number;
  weakAreas?: string[];
  strongAreas?: string[];
}

export interface LearningStyleProfile {
  studentId: string;
  visualScore: number; // 0-100
  auditoryScore: number;
  kinestheticScore: number;
  preferredQuestionTypes?: string[];
  responseTimeAverage?: number;
  accuracyByType?: any;
  lastAnalyzedAt: string;
}

export interface StudyRecommendation {
  id: string;
  studentId: string;
  recommendationType: 'topic_focus' | 'practice_more' | 'review';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description?: string;
  topicId?: string;
  resourceType?: 'quiz' | 'video' | 'reading';
  reasoning?: string;
  status: 'pending' | 'viewed' | 'completed' | 'dismissed';
  generatedAt: string;
}

export interface ClassroomDashboard {
  teacherId: string;
  classId?: string;
  startDate: string;
  endDate: string;
  averageScore?: number;
  participationRate?: number;
  topPerformers?: string[];
  needHelp?: string[];
  questionDifficultyDistribution?: any;
  generatedAt: string;
}

export const analyticsService = {
  // === STUDENT PROGRESS ===
  
  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    const response = await apiClient.get(`/grading/Analytics/student/${studentId}/progress`);
    return response.data;
  },

  // === LEARNING STYLE ===
  
  async getLearningStyle(studentId: string): Promise<LearningStyleProfile> {
    const response = await apiClient.get(`/grading/Analytics/student/${studentId}/learning-style`);
    return response.data;
  },

  async analyzeLearningStyle(studentId: string): Promise<LearningStyleProfile> {
    const response = await apiClient.post(`/grading/Analytics/student/${studentId}/analyze-learning-style`);
    return response.data;
  },

  // === RECOMMENDATIONS ===
  
  async getRecommendations(studentId: string): Promise<StudyRecommendation[]> {
    const response = await apiClient.get(`/grading/Analytics/student/${studentId}/recommendations`);
    return response.data;
  },

  async generateRecommendations(studentId: string): Promise<StudyRecommendation[]> {
    const response = await apiClient.post(`/grading/Analytics/student/${studentId}/generate-recommendations`);
    return response.data;
  },

  async updateRecommendationStatus(recommendationId: string, status: string): Promise<void> {
    await apiClient.put(`/grading/Analytics/recommendation/${recommendationId}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // === CLASSROOM DASHBOARD ===
  
  async getClassroomDashboard(classId?: string, startDate?: string, endDate?: string): Promise<ClassroomDashboard> {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/grading/Analytics/classroom/dashboard?${params}`);
    return response.data;
  },

  // === PERFORMANCE REPORT ===
  
  async getPerformanceReport(studentId: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/grading/Analytics/performance-report/${studentId}?${params}`);
    return response.data;
  },
};
