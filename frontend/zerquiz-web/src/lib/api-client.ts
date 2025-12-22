// API client with error handling and interceptors

import { API_ENDPOINTS } from '../config/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const tenantId = localStorage.getItem('tenantId');
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(tenantId && { 'X-Tenant-Id': tenantId }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || 'API request failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error or other issues
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      error
    );
  }
}

// Content Service API
export const contentApi = {
  uploadFile: async (file: File) => {
    const tenantId = localStorage.getItem('tenantId');
    const userId = localStorage.getItem('userId');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId || '');
    formData.append('userId', userId || '');
    formData.append('title', file.name);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_ENDPOINTS.content}/Content/upload`, {
      method: 'POST',
      headers: {
        'X-Tenant-Id': tenantId || '',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError('File upload failed', response.status);
    }

    return response.json();
  },

  listContent: async (page: number = 1, pageSize: number = 20) => {
    const tenantId = localStorage.getItem('tenantId');
    return apiClient(
      `${API_ENDPOINTS.content}/Content/list?tenantId=${tenantId}&page=${page}&pageSize=${pageSize}`
    );
  },

  getContent: async (id: string) => {
    return apiClient(`${API_ENDPOINTS.content}/Content/${id}`);
  },

  deleteContent: async (id: string) => {
    return apiClient(`${API_ENDPOINTS.content}/Content/${id}`, {
      method: 'DELETE',
    });
  },

  generateAI: async (contentId: string, config: any) => {
    return apiClient(`${API_ENDPOINTS.content}/AIGeneration/generate`, {
      method: 'POST',
      body: JSON.stringify({ contentId, ...config }),
    });
  },
};

// Lessons Service API
export const lessonsApi = {
  listPlans: async (page: number = 1, pageSize: number = 20) => {
    const tenantId = localStorage.getItem('tenantId');
    const userId = localStorage.getItem('userId');
    return apiClient(
      `${API_ENDPOINTS.lessons}/LessonPlans/list?tenantId=${tenantId}&createdBy=${userId}&page=${page}&pageSize=${pageSize}`
    );
  },

  getPlan: async (id: string) => {
    return apiClient(`${API_ENDPOINTS.lessons}/LessonPlans/${id}`);
  },

  createPlan: async (plan: any) => {
    return apiClient(`${API_ENDPOINTS.lessons}/LessonPlans`, {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  updatePlan: async (id: string, plan: any) => {
    return apiClient(`${API_ENDPOINTS.lessons}/LessonPlans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  deletePlan: async (id: string) => {
    return apiClient(`${API_ENDPOINTS.lessons}/LessonPlans/${id}`, {
      method: 'DELETE',
    });
  },

  publishPlan: async (id: string) => {
    return apiClient(`${API_ENDPOINTS.lessons}/LessonPlans/${id}/publish`, {
      method: 'POST',
    });
  },
};

// Analytics API
export const analyticsApi = {
  getStudentProgress: async (studentId: string) => {
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/student/${studentId}/progress`
    );
  },

  getLearningStyle: async (studentId: string) => {
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/student/${studentId}/learning-style`
    );
  },

  analyzeLearningStyle: async (studentId: string) => {
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/student/${studentId}/analyze-learning-style`,
      { method: 'POST' }
    );
  },

  getRecommendations: async (studentId: string, status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/student/${studentId}/recommendations${query}`
    );
  },

  generateRecommendations: async (studentId: string) => {
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/student/${studentId}/generate-recommendations`,
      { method: 'POST' }
    );
  },

  getClassroomDashboard: async (teacherId: string, classId?: string) => {
    const query = classId ? `?classId=${classId}` : '';
    return apiClient(
      `${API_ENDPOINTS.grading}/Analytics/classroom/dashboard?teacherId=${teacherId}${query}`
    );
  },
};




