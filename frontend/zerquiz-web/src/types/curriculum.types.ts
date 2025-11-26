export interface Subject {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  parentTopicId?: string;
  code: string;
  name: string;
  level: number;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LearningOutcome {
  id: string;
  curriculumId: string;
  subjectId: string;
  topicId?: string;
  code: string;
  description: string;
  details?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EducationModel {
  id: string;
  code: string;
  name: string;
  country: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Curriculum {
  id: string;
  educationModelId: string;
  name: string;
  year: number;
  term: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

