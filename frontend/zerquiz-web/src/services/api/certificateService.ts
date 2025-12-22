import { api } from '@/lib/api';

// Types
export interface CertificateDto {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  examTitle: string;
  examId: string;
  score: number;
  grade: string;
  maxScore: number;
  percentage: number;
  issueDate: string;
  expiryDate?: string;
  template: string;
  templateName: string;
  status: 'active' | 'revoked' | 'expired';
  qrCode: string;
  verificationUrl: string;
  downloadCount: number;
  viewCount: number;
  sharedCount: number;
  issuerName: string;
  issuerTitle: string;
  skills?: string[];
  achievements?: string[];
}

export interface CertificateTemplateDto {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'classic' | 'modern' | 'minimal' | 'premium';
  orientation: 'landscape' | 'portrait';
  primaryColor: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface CertificateStatsDto {
  totalIssued: number;
  activeCount: number;
  revokedCount: number;
  expiredCount: number;
  avgScore: number;
  totalDownloads: number;
  totalViews: number;
  monthlyIssued: number;
  topTemplate: string;
}

export interface VerificationResultDto {
  valid: boolean;
  certificate?: CertificateDto;
  message: string;
}

export interface CreateCertificateRequest {
  studentId: string;
  examId: string;
  templateId: string;
  score: number;
  maxScore: number;
  grade: string;
  skills?: string[];
  achievements?: string[];
}

export interface UpdateCertificateRequest {
  status?: 'active' | 'revoked' | 'expired';
  expiryDate?: string;
}

export interface CreateTemplateRequest {
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'minimal' | 'premium';
  orientation: 'landscape' | 'portrait';
  primaryColor: string;
  preview: string;
}

// API Endpoints
const ENDPOINTS = {
  CERTIFICATES: '/api/Certificates',
  CERTIFICATE_STATS: '/api/Certificates/stats',
  CERTIFICATE_VERIFY: '/api/Certificates/verify',
  CERTIFICATE_DOWNLOAD: (id: string) => `/api/Certificates/${id}/download`,
  CERTIFICATE_SEND_EMAIL: (id: string) => `/api/Certificates/${id}/send-email`,
  CERTIFICATE_REVOKE: (id: string) => `/api/Certificates/${id}/revoke`,
  CERTIFICATE_VIEW: (id: string) => `/api/Certificates/${id}/view`,
  TEMPLATES: '/api/CertificateTemplates',
  BULK_DOWNLOAD: '/api/Certificates/bulk-download',
};

// Certificates
export const getCertificates = async (): Promise<CertificateDto[]> => {
  const response = await api.get<CertificateDto[]>(ENDPOINTS.CERTIFICATES);
  return response.data;
};

export const getCertificateById = async (id: string): Promise<CertificateDto> => {
  const response = await api.get<CertificateDto>(`${ENDPOINTS.CERTIFICATES}/${id}`);
  return response.data;
};

export const createCertificate = async (data: CreateCertificateRequest): Promise<CertificateDto> => {
  const response = await api.post<CertificateDto>(ENDPOINTS.CERTIFICATES, data);
  return response.data;
};

export const updateCertificate = async (id: string, data: UpdateCertificateRequest): Promise<CertificateDto> => {
  const response = await api.put<CertificateDto>(`${ENDPOINTS.CERTIFICATES}/${id}`, data);
  return response.data;
};

export const deleteCertificate = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.CERTIFICATES}/${id}`);
};

// Statistics
export const getCertificateStats = async (): Promise<CertificateStatsDto> => {
  const response = await api.get<CertificateStatsDto>(ENDPOINTS.CERTIFICATE_STATS);
  return response.data;
};

// Verification
export const verifyCertificate = async (certificateNumber: string): Promise<VerificationResultDto> => {
  const response = await api.get<VerificationResultDto>(`${ENDPOINTS.CERTIFICATE_VERIFY}/${certificateNumber}`);
  return response.data;
};

// Download
export const downloadCertificate = async (id: string): Promise<Blob> => {
  const response = await api.get(ENDPOINTS.CERTIFICATE_DOWNLOAD(id), {
    responseType: 'blob',
  });
  return response.data;
};

export const bulkDownloadCertificates = async (certificateIds: string[]): Promise<Blob> => {
  const response = await api.post(ENDPOINTS.BULK_DOWNLOAD, { certificateIds }, {
    responseType: 'blob',
  });
  return response.data;
};

// Email
export const sendCertificateEmail = async (id: string, email: string): Promise<void> => {
  await api.post(ENDPOINTS.CERTIFICATE_SEND_EMAIL(id), { email });
};

// Actions
export const revokeCertificate = async (id: string): Promise<CertificateDto> => {
  const response = await api.post<CertificateDto>(ENDPOINTS.CERTIFICATE_REVOKE(id));
  return response.data;
};

export const recordCertificateView = async (id: string): Promise<void> => {
  await api.post(ENDPOINTS.CERTIFICATE_VIEW(id));
};

// Templates
export const getCertificateTemplates = async (): Promise<CertificateTemplateDto[]> => {
  const response = await api.get<CertificateTemplateDto[]>(ENDPOINTS.TEMPLATES);
  return response.data;
};

export const getTemplateById = async (id: string): Promise<CertificateTemplateDto> => {
  const response = await api.get<CertificateTemplateDto>(`${ENDPOINTS.TEMPLATES}/${id}`);
  return response.data;
};

export const createTemplate = async (data: CreateTemplateRequest): Promise<CertificateTemplateDto> => {
  const response = await api.post<CertificateTemplateDto>(ENDPOINTS.TEMPLATES, data);
  return response.data;
};

export const updateTemplate = async (id: string, data: Partial<CreateTemplateRequest>): Promise<CertificateTemplateDto> => {
  const response = await api.put<CertificateTemplateDto>(`${ENDPOINTS.TEMPLATES}/${id}`, data);
  return response.data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.TEMPLATES}/${id}`);
};

export const toggleTemplateStatus = async (id: string): Promise<CertificateTemplateDto> => {
  const response = await api.post<CertificateTemplateDto>(`${ENDPOINTS.TEMPLATES}/${id}/toggle-status`);
  return response.data;
};

// Search & Filter
export interface CertificateSearchParams {
  searchTerm?: string;
  status?: 'active' | 'revoked' | 'expired';
  templateId?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const searchCertificates = async (params: CertificateSearchParams): Promise<{
  items: CertificateDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}> => {
  const response = await api.get(`${ENDPOINTS.CERTIFICATES}/search`, { params });
  return response.data;
};

