import { apiClient } from '@/lib/api-client';

// ==================== TYPE DEFINITIONS ====================

export interface SystemDefinition {
  id: string;
  category: string;
  code: string;
  name: string;
  description?: string;
  nameTr?: string;
  nameEn?: string;
  nameAr?: string;
  descriptionTr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  displayOrder: number;
  icon?: string;
  color?: string;
  parentId?: string;
  configurationJson?: string;
  isSystemReserved: boolean;
  isEditable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  entityType: string;
  entityId?: string;
  action: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AIConfiguration {
  provider: string;
  model: string;
  apiKey?: string;
  temperature: number;
  maxTokens: number;
  questionGenerationEnabled: boolean;
  contentSummarizationEnabled: boolean;
  autoTranslationEnabled?: boolean;
}

// ==================== SYSTEM DEFINITIONS API ====================

export const getSystemDefinitions = async (category?: string): Promise<SystemDefinition[]> => {
  try {
    if (category) {
      const response = await apiClient.get<{ data: SystemDefinition[] }>(
        `/api/SystemDefinitions/category/${category}`
      );
      return response.data?.data || [];
    } else {
      // Get all categories first, then get all definitions
      const categoriesResponse = await apiClient.get<{ data: string[] }>(
        `/api/SystemDefinitions/categories`
      );
      const categories = categoriesResponse.data?.data || [];
      
      const allDefinitions: SystemDefinition[] = [];
      for (const cat of categories) {
        const response = await apiClient.get<{ data: SystemDefinition[] }>(
          `/api/SystemDefinitions/category/${cat}`
        );
        allDefinitions.push(...(response.data?.data || []));
      }
      return allDefinitions;
    }
  } catch (error) {
    console.error('Error fetching system definitions:', error);
    return [];
  }
};

export const getSystemDefinitionById = async (id: string): Promise<SystemDefinition | null> => {
  try {
    const response = await apiClient.get<{ data: SystemDefinition }>(
      `/api/SystemDefinitions/${id}`
    );
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching system definition:', error);
    return null;
  }
};

export const getSystemDefinitionCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<{ data: string[] }>(
      `/api/SystemDefinitions/categories`
    );
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createSystemDefinition = async (
  definition: Partial<SystemDefinition>
): Promise<SystemDefinition> => {
  const response = await apiClient.post<{ data: SystemDefinition }>(
    '/api/SystemDefinitions',
    definition
  );
  return response.data?.data!;
};

export const updateSystemDefinition = async (
  id: string,
  definition: Partial<SystemDefinition>
): Promise<SystemDefinition> => {
  const response = await apiClient.put<{ data: SystemDefinition }>(
    `/api/SystemDefinitions/${id}`,
    definition
  );
  return response.data?.data!;
};

export const deleteSystemDefinition = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/SystemDefinitions/${id}`);
};

export const getSystemDefinitionChildren = async (parentId: string): Promise<SystemDefinition[]> => {
  try {
    const response = await apiClient.get<{ data: SystemDefinition[] }>(
      `/api/SystemDefinitions/${parentId}/children`
    );
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching children definitions:', error);
    return [];
  }
};

// ==================== AUDIT LOGS API ====================

export const getAuditLogs = async (params?: {
  userId?: string;
  entityName?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}): Promise<AuditLogsResponse> => {
  try {
    const response = await apiClient.get<AuditLogsResponse>('/api/AuditLogs', {
      params: {
        userId: params?.userId,
        entityName: params?.entityName,
        action: params?.action,
        from: params?.from,
        to: params?.to,
        page: params?.page || 1,
        pageSize: params?.pageSize || 50,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: 50,
        total: 0,
        totalPages: 0,
      },
    };
  }
};

export const getAuditLogById = async (id: string): Promise<AuditLog | null> => {
  try {
    const response = await apiClient.get<{ data: AuditLog }>(`/api/AuditLogs/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return null;
  }
};

export const getUserActivity = async (
  userId: string,
  from?: string,
  to?: string
): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/AuditLogs/user/${userId}/activity`, {
      params: { from, to },
    });
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return null;
  }
};

export const getAuditStatistics = async (from?: string, to?: string): Promise<any> => {
  try {
    const response = await apiClient.get('/api/AuditLogs/statistics', {
      params: { from, to },
    });
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching audit statistics:', error);
    return null;
  }
};

// ==================== AI CONFIGURATION API ====================
// Note: This is a placeholder. You may need to implement actual backend endpoints.

export const getAIConfiguration = async (): Promise<AIConfiguration | null> => {
  try {
    // Mock implementation - replace with actual API call when backend is ready
    return {
      provider: 'OpenAI',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      questionGenerationEnabled: true,
      contentSummarizationEnabled: true,
      autoTranslationEnabled: false,
    };
  } catch (error) {
    console.error('Error fetching AI configuration:', error);
    return null;
  }
};

export const updateAIConfiguration = async (
  config: Partial<AIConfiguration>
): Promise<AIConfiguration> => {
  try {
    // Mock implementation - replace with actual API call when backend is ready
    console.log('Updating AI configuration:', config);
    return {
      provider: config.provider || 'OpenAI',
      model: config.model || 'gpt-4',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000,
      questionGenerationEnabled: config.questionGenerationEnabled ?? true,
      contentSummarizationEnabled: config.contentSummarizationEnabled ?? true,
      autoTranslationEnabled: config.autoTranslationEnabled ?? false,
    };
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    throw error;
  }
};

export const testAIConnection = async (): Promise<boolean> => {
  try {
    // Mock implementation - replace with actual API call when backend is ready
    console.log('Testing AI connection...');
    return true;
  } catch (error) {
    console.error('Error testing AI connection:', error);
    return false;
  }
};

