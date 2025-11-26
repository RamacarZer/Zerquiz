export interface Question {
  id: string;
  code: string;
  formatType?: string; // From API (display name)
  formatTypeId?: string;
  pedagogicalType?: string; // From API (display name)
  pedagogicalTypeId?: string;
  subjectId?: string;
  subjectName?: string; // From API
  topicId?: string;
  topicName?: string; // From API
  subtopicId?: string;
  learningOutcomeId?: string;
  curriculumId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  weight?: number;
  status?: 'draft' | 'review' | 'published' | 'archived'; // From API
  questionStatus?: 'draft' | 'review' | 'published' | 'archived'; // Legacy
  currentVersionId?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuestionFormatType {
  id: string;
  code: string;
  name: string;
  description?: string;
  configSchema?: string;
}

export interface QuestionPedagogicalType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface QuestionContent {
  header?: ContentBlock;
  premises?: ContentBlock[];
  stem?: ContentBlock;
  options?: QuestionOption[];
  correctAnswers?: string[];
  assets?: AssetReference[];
}

export interface ContentBlock {
  text?: string;
  latex?: string;
  html?: string;
}

export interface QuestionOption {
  key: string;
  text?: string;
  latex?: string;
  html?: string;
}

export interface AssetReference {
  type: 'image' | 'audio' | 'video';
  url: string;
  position: 'header' | 'stem' | 'option' | 'premise';
}

export interface QuestionVersion {
  id: string;
  questionId: string;
  versionNumber: number;
  content: QuestionContent;
  createdAt: string;
  createdBy: string;
}

export interface QuestionAsset {
  id: string;
  questionVersionId: string;
  type: 'image' | 'audio' | 'video' | 'latex' | 'svg';
  fileName: string;
  storageKey: string;
  url: string;
  fileSize: number;
  mimeType?: string;
  position: number;
}

export interface CreateQuestionRequest {
  formatTypeId: string;
  pedagogicalTypeId?: string;
  subjectId: string;
  topicId?: string;
  subtopicId?: string;
  learningOutcomeId?: string;
  curriculumId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  weight?: number;
  content: QuestionContent;
}

export interface UpdateQuestionRequest {
  pedagogicalTypeId?: string;
  subjectId?: string;
  topicId?: string;
  subtopicId?: string;
  learningOutcomeId?: string;
  curriculumId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  weight?: number;
  content?: QuestionContent;
}

export interface AssetUploadResponse {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  type: string;
}

