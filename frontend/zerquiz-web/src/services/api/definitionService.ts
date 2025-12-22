import apiClient from './apiClient';

// ==================== TYPES ====================

export interface TranslationDto {
  languageCode: string;
  name: string;
  description?: string;
}

export interface DefinitionGroupDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  isSystem: boolean;
  displayOrder: number;
  icon?: string;
  educationModelId?: string;
  isActive: boolean;
  translations: TranslationDto[];
}

export interface DefinitionDto {
  id: string;
  groupId: string;
  groupKey: string;
  groupName?: string;
  parentId?: string;
  parentName?: string;
  code: string;
  name: string;
  altNames?: string[];
  description?: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  displayOrder: number;
  isSystem: boolean;
  validFrom?: string;
  validTo?: string;
  educationModelId?: string;
  isActive: boolean;
  translations: TranslationDto[];
  children: DefinitionDto[];
}

export interface CreateDefinitionGroupRequest {
  code: string;
  name: string;
  description?: string;
  isSystem: boolean;
  displayOrder: number;
  icon?: string;
  translations?: TranslationDto[];
}

export interface UpdateDefinitionGroupRequest {
  name: string;
  description?: string;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
}

export interface CreateDefinitionRequest {
  groupId: string;
  groupKey: string;
  parentId?: string;
  code: string;
  name: string;
  altNames?: string[];
  description?: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  displayOrder: number;
  validFrom?: string;
  validTo?: string;
  educationModelId?: string;
  translations?: TranslationDto[];
}

export interface UpdateDefinitionRequest {
  name: string;
  altNames?: string[];
  description?: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  displayOrder: number;
  validFrom?: string;
  validTo?: string;
  educationModelId?: string;
  isActive: boolean;
}

// Type aliases for React Query hooks
export type CreateDefinitionDto = CreateDefinitionRequest;
export type UpdateDefinitionDto = UpdateDefinitionRequest;

// ==================== DEFINITION GROUPS API ====================

export const getDefinitionGroups = async (): Promise<DefinitionGroupDto[]> => {
  const response = await apiClient.get<DefinitionGroupDto[]>('/api/curriculum/DefinitionGroups');
  return response.data || [];
};

export const getDefinitionGroup = async (id: string): Promise<DefinitionGroupDto> => {
  const response = await apiClient.get<DefinitionGroupDto>(`/api/curriculum/DefinitionGroups/${id}`);
  return response.data;
};

export const createDefinitionGroup = async (request: CreateDefinitionGroupRequest): Promise<DefinitionGroupDto> => {
  const response = await apiClient.post<DefinitionGroupDto>('/api/curriculum/DefinitionGroups', request);
  return response.data;
};

export const updateDefinitionGroup = async (id: string, request: UpdateDefinitionGroupRequest): Promise<void> => {
  await apiClient.put(`/api/curriculum/DefinitionGroups/${id}`, request);
};

export const deleteDefinitionGroup = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/curriculum/DefinitionGroups/${id}`);
};

// ==================== DEFINITIONS API ====================

export const getDefinitions = async (params?: {
  groupKey?: string;
  parentId?: string;
  includeChildren?: boolean;
}): Promise<DefinitionDto[]> => {
  const response = await apiClient.get<DefinitionDto[]>('/api/curriculum/Definitions', { params });
  return response.data || [];
};

export const getDefinitionTree = async (groupKey?: string): Promise<DefinitionDto[]> => {
  const params = groupKey ? { groupKey } : undefined;
  const response = await apiClient.get<DefinitionDto[]>('/api/curriculum/Definitions/tree', { params });
  return response.data || [];
};

export const getDefinition = async (id: string): Promise<DefinitionDto> => {
  const response = await apiClient.get<DefinitionDto>(`/api/curriculum/Definitions/${id}`);
  return response.data;
};

export const getDefinitionById = async (id: string): Promise<DefinitionDto> => {
  return getDefinition(id);
};

export const getDefinitionsByGroup = async (groupKey: string): Promise<DefinitionDto[]> => {
  return getDefinitions({ groupKey, includeChildren: false });
};

export const getDefinitionChildren = async (id: string): Promise<DefinitionDto[]> => {
  const response = await apiClient.get<DefinitionDto[]>(`/api/curriculum/Definitions/${id}/children`);
  return response.data || [];
};

export const createDefinition = async (request: CreateDefinitionRequest): Promise<DefinitionDto> => {
  const response = await apiClient.post<DefinitionDto>('/api/curriculum/Definitions', request);
  return response.data;
};

export const updateDefinition = async (id: string, request: UpdateDefinitionRequest): Promise<DefinitionDto> => {
  const response = await apiClient.put<DefinitionDto>(`/api/curriculum/Definitions/${id}`, request);
  return response.data;
};

export const deleteDefinition = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/curriculum/Definitions/${id}`);
};

// ==================== SEED API ====================

export const seedDefinitionSystem = async (): Promise<any> => {
  const response = await apiClient.post('/api/curriculum/SeedDefinitions/seed-all');
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Build hierarchical tree structure from flat definitions
 */
export const buildDefinitionTree = (definitions: DefinitionDto[]): DefinitionDto[] => {
  const definitionMap = new Map<string, DefinitionDto>();
  const rootDefinitions: DefinitionDto[] = [];

  // Create map
  definitions.forEach(def => {
    definitionMap.set(def.id, { ...def, children: [] });
  });

  // Build tree
  definitions.forEach(def => {
    const definition = definitionMap.get(def.id)!;
    if (def.parentId) {
      const parent = definitionMap.get(def.parentId);
      if (parent) {
        parent.children.push(definition);
      }
    } else {
      rootDefinitions.push(definition);
    }
  });

  return rootDefinitions;
};

/**
 * Get definition breadcrumb path
 */
export const getDefinitionBreadcrumb = (
  definitionId: string,
  allDefinitions: DefinitionDto[]
): DefinitionDto[] => {
  const breadcrumb: DefinitionDto[] = [];
  let currentId: string | undefined = definitionId;

  while (currentId) {
    const definition = allDefinitions.find(d => d.id === currentId);
    if (!definition) break;
    breadcrumb.unshift(definition);
    currentId = definition.parentId;
  }

  return breadcrumb;
};

/**
 * Get all children recursively
 */
export const getAllChildrenIds = (definition: DefinitionDto): string[] => {
  const ids: string[] = [definition.id];
  definition.children.forEach(child => {
    ids.push(...getAllChildrenIds(child));
  });
  return ids;
};

/**
 * Get level color by group key
 */
export const getGroupColor = (groupKey: string): string => {
  const colors: Record<string, string> = {
    SUBJECT: '#3B82F6',     // Blue
    SUB_SUBJECT: '#8B5CF6', // Purple
    TOPIC: '#EC4899',       // Pink
    SUB_TOPIC: '#F59E0B',   // Amber
    TITLE: '#10B981',       // Green
    OUTCOME: '#EF4444'      // Red
  };
  return colors[groupKey] || '#6B7280';
};

/**
 * Get level icon by group key
 */
export const getGroupIcon = (groupKey: string): string => {
  const icons: Record<string, string> = {
    SUBJECT: '📚',
    SUB_SUBJECT: '📖',
    TOPIC: '📝',
    SUB_TOPIC: '📄',
    TITLE: '🔖',
    OUTCOME: '🎯'
  };
  return icons[groupKey] || '📌';
};

export default {
  // Groups
  getDefinitionGroups,
  getDefinitionGroup,
  createDefinitionGroup,
  updateDefinitionGroup,
  deleteDefinitionGroup,
  // Definitions
  getDefinitions,
  getDefinitionTree,
  getDefinition,
  getDefinitionChildren,
  createDefinition,
  updateDefinition,
  deleteDefinition,
  // Seed
  seedDefinitionSystem,
  // Helpers
  buildDefinitionTree,
  getDefinitionBreadcrumb,
  getAllChildrenIds,
  getGroupColor,
  getGroupIcon
};

