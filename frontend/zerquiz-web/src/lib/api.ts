import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// API Base URL - Gateway
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const tenantId = localStorage.getItem("tenantId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers["X-Tenant-Id"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors, refresh token)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/identity/auth/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Helper functions
export const api = {
  // Generic methods
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),

  // Service-specific helpers
  core: {
    tenants: () => api.get("/core/tenants"),
    organizations: () => api.get("/core/organizations"),
    auditLogs: (params?: any) => api.get("/core/audit-logs", { params }),
    media: {
      upload: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/core/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
      download: (fileKey: string) => api.get(`/core/media/download/${fileKey}`),
    },
    notifications: {
      send: (notification: any) =>
        api.post("/core/notifications/email", notification),
    },
    reports: {
      generate: (reportRequest: any) =>
        api.post("/core/reports/generate", reportRequest),
      download: (reportId: string) =>
        api.get(`/core/reports/download/${reportId}`),
    },
  },

  identity: {
    login: (email: string, password: string) =>
      api.post("/identity/auth/login", { email, password }),
    register: (userData: any) => api.post("/identity/auth/register", userData),
    refresh: (refreshToken: string) =>
      api.post("/identity/auth/refresh", { refreshToken }),
    logout: () => api.post("/identity/auth/logout"),
    users: () => api.get("/identity/users"),
    roles: () => api.get("/identity/roles"),
    permissions: () => api.get("/identity/permissions"),
  },

  curriculum: {
    definitions: (groupKey?: string) =>
      api.get("/curriculum/definitions", { params: { groupKey } }),
    learningOutcomes: () => api.get("/curriculum/learning-outcomes"),
    curricula: () => api.get("/curriculum/curricula"),
  },

  questions: {
    list: (params?: any) => api.get("/questions", { params }),
    get: (id: string) => api.get(`/questions/${id}`),
    create: (question: any) => api.post("/questions", question),
    update: (id: string, question: any) =>
      api.put(`/questions/${id}`, question),
    delete: (id: string) => api.delete(`/questions/${id}`),
    reviews: {
      list: () => api.get("/questions/question-reviews"),
      approve: (reviewId: string) =>
        api.post(`/questions/question-reviews/${reviewId}/approve`),
      reject: (reviewId: string, comments: string) =>
        api.post(`/questions/question-reviews/${reviewId}/reject`, {
          comments,
        }),
    },
    solutions: {
      get: (questionId: string) =>
        api.get(`/questions/${questionId}/solutions`),
      create: (solution: any) =>
        api.post("/questions/question-solutions", solution),
    },
  },

  exams: {
    list: (params?: any) => api.get("/exams", { params }),
    get: (id: string) => api.get(`/exams/${id}`),
    create: (exam: any) => api.post("/exams", exam),
    update: (id: string, exam: any) => api.put(`/exams/${id}`, exam),
    delete: (id: string) => api.delete(`/exams/${id}`),
    booklets: {
      list: (examId: string) => api.get(`/exams/booklets/exam/${examId}`),
      create: (booklet: any) => api.post("/exams/booklets", booklet),
      shuffle: (bookletId: string) =>
        api.post(`/exams/booklets/${bookletId}/shuffle-questions`),
    },
    sessions: {
      start: (sessionData: any) =>
        api.post("/exams/exam-sessions/start", sessionData),
      get: (sessionId: string) => api.get(`/exams/exam-sessions/${sessionId}`),
      heartbeat: (sessionId: string) =>
        api.post(`/exams/exam-sessions/${sessionId}/heartbeat`),
      submit: (sessionId: string) =>
        api.post(`/exams/exam-sessions/${sessionId}/submit`),
    },
  },

  grading: {
    results: (params?: any) => api.get("/grading/exam-results", { params }),
    autoGrade: (examResultId: string) =>
      api.post(`/grading/auto-grade/${examResultId}`),
    certificates: {
      list: () => api.get("/grading/certificates"),
      get: (id: string) => api.get(`/grading/certificates/${id}`),
      download: (id: string) =>
        api.get(`/grading/certificates/${id}/download`, {
          responseType: "blob",
        }),
      verify: (token: string) =>
        api.get(`/grading/certificates/verify/${token}`),
    },
    rankings: (examId: string) => api.get(`/grading/rankings/exam/${examId}`),
  },

  royalty: {
    authorDashboard: {
      summary: () => api.get("/royalty/author-dashboard/summary"),
      works: () => api.get("/royalty/author-dashboard/works"),
      payouts: () => api.get("/royalty/author-dashboard/payouts"),
      requestPayout: (amount: number) =>
        api.post("/royalty/author-dashboard/request-payout", { amount }),
    },
    works: {
      list: () => api.get("/royalty/works"),
      get: (id: string) => api.get(`/royalty/works/${id}`),
      create: (work: any) => api.post("/royalty/works", work),
    },
  },

  finance: {
    subscriptionPlans: () => api.get("/finance/subscription-plans"),
    subscriptions: {
      list: () => api.get("/finance/subscriptions"),
      get: (id: string) => api.get(`/finance/subscriptions/${id}`),
      create: (subscription: any) =>
        api.post("/finance/subscriptions", subscription),
      cancel: (id: string) => api.put(`/finance/subscriptions/${id}/cancel`),
    },
    payments: {
      list: () => api.get("/finance/payments"),
      create: (payment: any) => api.post("/finance/payments", payment),
    },
    quotas: () => api.get("/finance/quotas"),
  },

  presentation: {
    list: (params?: any) => api.get("/presentation", { params }),
    get: (id: string) => api.get(`/presentation/${id}`),
    create: (presentation: any) => api.post("/presentation", presentation),
    sessions: {
      start: (presentationId: string) =>
        api.post(`/presentation/presentation-sessions/start`, {
          presentationId,
        }),
      join: (sessionCode: string, userId: string) =>
        api.post("/presentation/presentation-sessions/join", {
          sessionCode,
          userId,
        }),
      submitResponse: (response: any) =>
        api.post(
          "/presentation/presentation-sessions/submit-response",
          response
        ),
    },
  },
};

export default apiClient;
