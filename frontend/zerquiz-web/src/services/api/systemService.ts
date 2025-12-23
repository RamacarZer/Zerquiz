import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

// Base URL for Core API (System Definitions & Audit Logs)
const CORE_API = API_ENDPOINTS.core;

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
      const response = await apiClient<{ data: SystemDefinition[] }>(
        `${CORE_API}/api/SystemDefinitions/category/${category}`
      );
      return response.data || [];
    } else {
      // Get all categories first, then get all definitions
      const categoriesResponse = await apiClient<{ data: string[] }>(
        `${CORE_API}/api/SystemDefinitions/categories`
      );
      const categories = categoriesResponse.data || [];
      
      const allDefinitions: SystemDefinition[] = [];
      for (const cat of categories) {
        const response = await apiClient<{ data: SystemDefinition[] }>(
          `${CORE_API}/api/SystemDefinitions/category/${cat}`
        );
        allDefinitions.push(...(response.data || []));
      }
      return allDefinitions;
    }
  } catch (error) {
    // Silent fail, return empty array for demo mode
    return [];
  }
};

export const getSystemDefinitionById = async (id: string): Promise<SystemDefinition | null> => {
  try {
    const response = await apiClient<{ data: SystemDefinition }>(
      `${CORE_API}/api/SystemDefinitions/${id}`
    );
    return response.data || null;
  } catch (error) {
    return null;
  }
};

export const getSystemDefinitionCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient<{ data: string[] }>(
      `${CORE_API}/api/SystemDefinitions/categories`
    );
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const createSystemDefinition = async (
  definition: Partial<SystemDefinition>
): Promise<SystemDefinition> => {
  const response = await apiClient<{ data: SystemDefinition }>(
    `${CORE_API}/api/SystemDefinitions`,
    {
      method: 'POST',
      body: JSON.stringify(definition),
    }
  );
  return response.data!;
};

export const updateSystemDefinition = async (
  id: string,
  definition: Partial<SystemDefinition>
): Promise<SystemDefinition> => {
  const response = await apiClient<{ data: SystemDefinition }>(
    `${CORE_API}/api/SystemDefinitions/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(definition),
    }
  );
  return response.data!;
};

export const deleteSystemDefinition = async (id: string): Promise<void> => {
  await apiClient(`${CORE_API}/api/SystemDefinitions/${id}`, {
    method: 'DELETE',
  });
};

export const getSystemDefinitionChildren = async (parentId: string): Promise<SystemDefinition[]> => {
  try {
    const response = await apiClient<{ data: SystemDefinition[] }>(
      `${CORE_API}/api/SystemDefinitions/${parentId}/children`
    );
    return response.data || [];
  } catch (error) {
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
    const queryParams = new URLSearchParams({
      ...(params?.userId && { userId: params.userId }),
      ...(params?.entityName && { entityName: params.entityName }),
      ...(params?.action && { action: params.action }),
      ...(params?.from && { from: params.from }),
      ...(params?.to && { to: params.to }),
      page: String(params?.page || 1),
      pageSize: String(params?.pageSize || 50),
    });
    const response = await apiClient<AuditLogsResponse>(`${CORE_API}/api/AuditLogs?${queryParams}`);
    return response;
  } catch (error) {
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
    const response = await apiClient<{ data: AuditLog }>(`${CORE_API}/api/AuditLogs/${id}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
};

export const getUserActivity = async (
  userId: string,
  from?: string,
  to?: string
): Promise<any> => {
  try {
    const queryParams = new URLSearchParams({
      ...(from && { from }),
      ...(to && { to }),
    });
    const response = await apiClient(`${CORE_API}/api/AuditLogs/user/${userId}/activity?${queryParams}`);
    return response || null;
  } catch (error) {
    return null;
  }
};

export const getAuditStatistics = async (from?: string, to?: string): Promise<any> => {
  try {
    const queryParams = new URLSearchParams({
      ...(from && { from }),
      ...(to && { to }),
    });
    const response = await apiClient(`${CORE_API}/api/AuditLogs/statistics?${queryParams}`);
    return response || null;
  } catch (error) {
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

