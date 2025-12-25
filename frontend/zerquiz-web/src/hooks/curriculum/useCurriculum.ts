import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDefinitionGroups,
  getDefinitionTree,
  getDefinitionsByGroup,
  getDefinitionById,
  createDefinition,
  updateDefinition,
  deleteDefinition,
  type DefinitionGroupDto,
  type DefinitionDto,
  type CreateDefinitionDto,
  type UpdateDefinitionDto
} from '../../services/api/definitionService';

// Query Keys
export const curriculumKeys = {
  all: ['curriculum'] as const,
  groups: () => [...curriculumKeys.all, 'groups'] as const,
  definitions: () => [...curriculumKeys.all, 'definitions'] as const,
  definitionTree: (groupCode: string) => [...curriculumKeys.definitions(), 'tree', groupCode] as const,
  definitionsByGroup: (groupCode: string) => [...curriculumKeys.definitions(), 'byGroup', groupCode] as const,
  definition: (id: string) => [...curriculumKeys.definitions(), 'detail', id] as const,
};

// ============ QUERY HOOKS ============

/**
 * Fetch all definition groups (Branş, Konu, vb.)
 */
export function useDefinitionGroups() {
  return useQuery({
    queryKey: curriculumKeys.groups(),
    queryFn: getDefinitionGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch definition tree for a specific group (hierarchical structure)
 */
export function useDefinitionTree(groupCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: curriculumKeys.definitionTree(groupCode),
    queryFn: () => getDefinitionTree(groupCode),
    enabled: !!groupCode && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch flat list of definitions by group
 */
export function useDefinitionsByGroup(groupCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: curriculumKeys.definitionsByGroup(groupCode),
    queryFn: () => getDefinitionsByGroup(groupCode),
    enabled: !!groupCode && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single definition by ID
 */
export function useDefinition(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: curriculumKeys.definition(id),
    queryFn: () => getDefinitionById(id),
    enabled: !!id && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// ============ MUTATION HOOKS ============

/**
 * Create a new definition
 */
export function useCreateDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDefinitionDto) => createDefinition(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: curriculumKeys.definitionTree(variables.groupKey) });
      queryClient.invalidateQueries({ queryKey: curriculumKeys.definitionsByGroup(variables.groupKey) });
    },
  });
}

/**
 * Update an existing definition
 */
export function useUpdateDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDefinitionDto }) =>
      updateDefinition(id, data),
    onSuccess: (updatedDefinition) => {
      // Update cache for the specific definition
      queryClient.setQueryData(
        curriculumKeys.definition(updatedDefinition.id),
        updatedDefinition
      );

      // Invalidate tree and list queries for the group
      queryClient.invalidateQueries({ 
        queryKey: curriculumKeys.definitionTree(updatedDefinition.groupKey) 
      });
      queryClient.invalidateQueries({ 
        queryKey: curriculumKeys.definitionsByGroup(updatedDefinition.groupKey) 
      });
    },
  });
}

/**
 * Delete a definition
 */
export function useDeleteDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDefinition(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: curriculumKeys.definition(deletedId) });

      // Invalidate all tree and list queries (we don't know which group it belonged to)
      queryClient.invalidateQueries({ queryKey: curriculumKeys.definitions() });
    },
  });
}

// ============ HELPER HOOKS ============

/**
 * Combined hook for managing curriculum with all CRUD operations
 */
export function useCurriculumManager(initialGroupCode?: string) {
  const groupsQuery = useDefinitionGroups();
  const treeQuery = useDefinitionTree(initialGroupCode || '', !!initialGroupCode);
  const createMutation = useCreateDefinition();
  const updateMutation = useUpdateDefinition();
  const deleteMutation = useDeleteDefinition();

  return {
    // Queries
    groups: groupsQuery.data || [],
    definitions: treeQuery.data || [],
    isLoadingGroups: groupsQuery.isLoading,
    isLoadingDefinitions: treeQuery.isLoading,
    
    // Mutations
    createDefinition: createMutation.mutate,
    updateDefinition: updateMutation.mutate,
    deleteDefinition: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Errors
    groupsError: groupsQuery.error,
    definitionsError: treeQuery.error,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    
    // Refetch
    refetchGroups: groupsQuery.refetch,
    refetchDefinitions: treeQuery.refetch,
  };
}


