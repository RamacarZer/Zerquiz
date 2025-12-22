// React Query Hooks for Content Management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  contentService, 
  type QuizGenerationRequest,
  type FlashcardGenerationRequest,
  type SummaryGenerationRequest,
  type WorksheetGenerationRequest
} from '../services/api/contentService';

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
export function useContentList(tenantId: string, contentType?: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: contentKeys.list(`${tenantId}-${contentType}-${page}-${pageSize}`),
    queryFn: () => contentService.getAll(tenantId, contentType, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!tenantId,
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
    mutationFn: (data: { file: File; title?: string; tenantId?: string; userId?: string }) =>
      contentService.upload(data.file, data.title, data.tenantId, data.userId),
    onSuccess: () => {
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

// Extract text
export function useExtractText(id: string) {
  return useQuery({
    queryKey: [...contentKeys.detail(id), 'extract'],
    queryFn: () => contentService.getExtractedText(id),
    enabled: false, // Manual trigger
  });
}

// === AI GENERATION HOOKS ===

// Generate Quiz
export function useGenerateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: QuizGenerationRequest) =>
      contentService.generateQuiz(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

// Generate Flashcards
export function useGenerateFlashcards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FlashcardGenerationRequest) =>
      contentService.generateFlashcards(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

// Generate Summary
export function useGenerateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SummaryGenerationRequest) =>
      contentService.generateSummary(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

// Generate Worksheet
export function useGenerateWorksheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: WorksheetGenerationRequest) =>
      contentService.generateWorksheet(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

// Get generation job status with auto-polling
export function useGenerationJobStatus(jobId: string, enabled = false) {
  return useQuery({
    queryKey: ['generation-job', jobId],
    queryFn: () => contentService.getJobStatus(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // Stop polling if completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
  });
}

// Get generated content
export function useGeneratedContent(contentId: string, type?: string) {
  return useQuery({
    queryKey: ['generated-content', contentId, type],
    queryFn: () => contentService.getGeneratedContent(contentId, type),
    enabled: !!contentId,
  });
}

// Approve generated content
export function useApproveGenerated() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.approveGenerated(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-content'] });
    },
  });
}




