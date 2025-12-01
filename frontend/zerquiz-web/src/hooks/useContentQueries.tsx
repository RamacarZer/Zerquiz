// React Query Hooks for Content Management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService, type ContentFile, type GenerationRequest } from '../services/api/contentService';

// Query Keys
export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters: string) => [...contentKeys.lists(), { filters }] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
  generation: (id: string) => [...contentKeys.all, 'generation', id] as const,
};

// Get all content files
export function useContentList() {
  return useQuery({
    queryKey: contentKeys.lists(),
    queryFn: () => contentService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single content file
export function useContentDetail(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentService.getById(id),
    enabled: !!id,
  });
}

// Upload file
export function useContentUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { file: File; metadata?: any }) =>
      contentService.upload(data.file, data.metadata),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

// Delete content
export function useContentDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

// Extract text from PDF
export function useExtractText(id: string) {
  return useQuery({
    queryKey: [...contentKeys.detail(id), 'extract'],
    queryFn: () => contentService.extractText(id),
    enabled: false, // Manual trigger
  });
}

// Generate content with AI
export function useGenerateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GenerationRequest) =>
      contentService.generateContent(request),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

// Get generation status
export function useGenerationStatus(id: string, enabled = false) {
  return useQuery({
    queryKey: contentKeys.generation(id),
    queryFn: () => contentService.getGenerationStatus(id),
    enabled: enabled && !!id,
    refetchInterval: (data) => {
      // Stop polling if completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
}

// Approve generation
export function useApproveGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contentService.approveGeneration(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.generation(variables.id) });
    },
  });
}

