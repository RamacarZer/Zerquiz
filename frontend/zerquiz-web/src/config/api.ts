// API endpoints configuration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Gateway base
  gateway: API_BASE_URL,
  
  // Microservices
  core: `${API_BASE_URL}/core`,
  identity: `${API_BASE_URL}/identity`,
  curriculum: `${API_BASE_URL}/curriculum`,
  questions: `${API_BASE_URL}/questions`,
  exams: `${API_BASE_URL}/exams`,
  grading: `${API_BASE_URL}/grading`,
  finance: `${API_BASE_URL}/finance`,
  content: `${API_BASE_URL}/content`,
  lessons: `${API_BASE_URL}/lessons`,
};

// API request timeout (milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// File upload limits
export const UPLOAD_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    image: 'image/*',
  },
};

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
};

// AI Generation defaults
export const AI_GENERATION = {
  defaultQuestionCount: 10,
  questionCountOptions: [5, 10, 20, 30, 50],
  defaultFlashcardCount: 20,
  flashcardCountOptions: [10, 20, 30, 50],
  difficultyLevels: ['easy', 'medium', 'hard'],
  languages: ['tr', 'en', 'ar'],
};
