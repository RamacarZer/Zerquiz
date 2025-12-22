// React Query Hooks for Questions Management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '../services/api/questionService';
import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '../types/question.types';

// Query Keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: string) => [...questionKeys.lists(), { filters }] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  types: () => [...questionKeys.all, 'types'] as const,
  type: (code: string) => [...questionKeys.types(), code] as const,
  schema: (code: string) => [...questionKeys.all, 'schema', code] as const,
};

// === QUESTIONS ===

// Get all questions with filters
export function useQuestions(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  difficulty?: string;
  subjectId?: string;
  topicId?: string;
  search?: string;
}) {
  const filterKey = JSON.stringify(params || {});
  
  return useQuery({
    queryKey: questionKeys.list(filterKey),
    queryFn: () => questionService.getQuestions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single question
export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionService.getQuestion(id),
    enabled: !!id,
  });
}

// Create question
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      questionService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// Update question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      questionService.updateQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// Delete question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// === QUESTION TYPES (NEW - Backend Integration) ===

// Get all question types (65 types from Core Service)
export function useQuestionTypes() {
  return useQuery({
    queryKey: questionKeys.types(),
    queryFn: () => questionService.getQuestionTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes (relatively static data)
  });
}

// Get single question type by code
export function useQuestionType(code: string) {
  return useQuery({
    queryKey: questionKeys.type(code),
    queryFn: () => questionService.getQuestionType(code),
    enabled: !!code,
    staleTime: 30 * 60 * 1000,
  });
}

// Get question type JSON schema
export function useQuestionTypeSchema(code: string) {
  return useQuery({
    queryKey: questionKeys.schema(code),
    queryFn: () => questionService.getQuestionTypeSchema(code),
    enabled: !!code,
    staleTime: 30 * 60 * 1000,
  });
}

// === AI GENERATION ===

// Generate questions with AI
export function useGenerateQuestionsWithAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: {
      prompt: string;
      questionType: string;
      difficulty?: string;
      count?: number;
    }) => questionService.generateWithAI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// Bulk import questions
export function useBulkImportQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questions: any[]) => questionService.bulkImport(questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// === METADATA ===

// Get format types
export function useFormatTypes() {
  return useQuery({
    queryKey: ['question-formats'],
    queryFn: () => questionService.getFormatTypes(),
    staleTime: 30 * 60 * 1000,
  });
}

// Get pedagogical types
export function usePedagogicalTypes() {
  return useQuery({
    queryKey: ['pedagogical-types'],
    queryFn: () => questionService.getPedagogicalTypes(),
    staleTime: 30 * 60 * 1000,
  });
}

// Get presentation types
export function usePresentationTypes() {
  return useQuery({
    queryKey: ['presentation-types'],
    queryFn: () => questionService.getPresentationTypes(),
    staleTime: 30 * 60 * 1000,
  });
}

// Get difficulty levels
export function useDifficultyLevels() {
  return useQuery({
    queryKey: ['difficulty-levels'],
    queryFn: () => questionService.getDifficultyLevels(),
    staleTime: 30 * 60 * 1000,
  });
}

// === VERSIONS ===

// Get question versions
export function useQuestionVersions(questionId: string) {
  return useQuery({
    queryKey: [...questionKeys.detail(questionId), 'versions'],
    queryFn: () => questionService.getQuestionVersions(questionId),
    enabled: !!questionId,
  });
}

// Get specific version
export function useQuestionVersion(questionId: string, versionId: string) {
  return useQuery({
    queryKey: [...questionKeys.detail(questionId), 'version', versionId],
    queryFn: () => questionService.getQuestionVersion(questionId, versionId),
    enabled: !!questionId && !!versionId,
  });
}

// === ASSETS ===

// Upload asset
export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      file: File;
      questionVersionId?: string;
      assetType?: string;
    }) =>
      questionService.uploadAsset(
        data.file,
        data.questionVersionId,
        data.assetType
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

// Get assets by version
export function useAssetsByVersion(questionVersionId: string) {
  return useQuery({
    queryKey: ['assets', questionVersionId],
    queryFn: () => questionService.getAssetsByVersion(questionVersionId),
    enabled: !!questionVersionId,
  });
}

// Delete asset
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId: string) => questionService.deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

