import axios from 'axios';

const API_BASE_URL = '/api/core';

// ==================== TYPES ====================

export interface LicensePackageDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  trialDays: number;
  
  // Quotas
  maxUsers: number;
  maxStudents: number;
  maxQuestions: number;
  maxExams: number;
  maxStorageGB: number;
  maxApiCallsPerMonth: number;
  maxModules: number;
  maxCases: number;
  maxDocuments: number;
  
  // Features
  features: string[];
  
  // Display
  isActive: boolean;
  isPublic: boolean;
  isHighlighted: boolean;
  highlightText?: string;
  displayOrder: number;
  
  createdAt: string;
  updatedAt?: string;
}

export interface TenantLicenseDto {
  id: string;
  tenantId: string;
  licensePackageId?: string; // For backwards compatibility
  package?: {
    id: string;
    code: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
  };
  
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  
  status: 'trial' | 'active' | 'suspended' | 'expired' | 'cancelled';
  
  amount: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  autoRenew: boolean;
  nextBillingDate?: string;
  
  customLimitsJson?: string;
  customFeaturesJson?: string;
  currentUsageJson?: string;
  
  createdAt: string;
  updatedAt?: string;
}

export interface UsageStats {
  users: { current: number; limit: number; percentage: number };
  students: { current: number; limit: number; percentage: number };
  questions: { current: number; limit: number; percentage: number };
  exams: { current: number; limit: number; percentage: number };
  storage: { current: number; limit: number; percentage: number; unit: string };
  modules: { current: number; limit: number; percentage: number };
  cases: { current: number; limit: number; percentage: number };
  documents: { current: number; limit: number; percentage: number };
}

export interface CreateLicensePackageRequest {
  code: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  trialDays: number;
  maxUsers: number;
  maxStudents: number;
  maxQuestions: number;
  maxExams: number;
  maxStorageGB: number;
  maxApiCallsPerMonth: number;
  maxModules: number;
  maxCases: number;
  maxDocuments: number;
  features: string[];
  isActive: boolean;
  isPublic: boolean;
  isHighlighted: boolean;
  highlightText?: string;
  displayOrder: number;
}

export interface UpdateLicensePackageRequest extends CreateLicensePackageRequest {
  id: string;
}

export interface AssignLicenseRequest {
  packageId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  billingPeriod: 'monthly' | 'yearly';
  customLimitsJson?: string;
  customFeaturesJson?: string;
}

export interface UpgradeLicenseRequest {
  newPackageId: string;
  effectiveDate?: string;
  billingPeriod: 'monthly' | 'yearly';
  autoRenew: boolean;
}

// ==================== API FUNCTIONS ====================

// License Packages
export const getLicensePackages = async (): Promise<LicensePackageDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/licensepackages`);
  return Array.isArray(response.data) ? response.data : (response.data?.data || []);
};

export const getLicensePackage = async (id: string): Promise<LicensePackageDto> => {
  const response = await axios.get(`${API_BASE_URL}/licensepackages/${id}`);
  return response.data.data;
};

export const createLicensePackage = async (request: CreateLicensePackageRequest): Promise<LicensePackageDto> => {
  const response = await axios.post(`${API_BASE_URL}/licensepackages`, request);
  return response.data.data;
};

export const updateLicensePackage = async (id: string, request: UpdateLicensePackageRequest): Promise<void> => {
  await axios.put(`${API_BASE_URL}/core/licensepackages/${id}`, request);
};

export const deleteLicensePackage = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/core/licensepackages/${id}`);
};

// Tenant Licenses
export const getTenantLicense = async (tenantId: string): Promise<TenantLicenseDto | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tenants/${tenantId}/license`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const assignTenantLicense = async (tenantId: string, request: AssignLicenseRequest): Promise<TenantLicenseDto> => {
  const response = await axios.post(`${API_BASE_URL}/tenants/${tenantId}/license/assign`, request);
  return response.data.data;
};

export const upgradeTenantLicense = async (tenantId: string, request: UpgradeLicenseRequest): Promise<TenantLicenseDto> => {
  const response = await axios.put(`${API_BASE_URL}/tenants/${tenantId}/license/upgrade`, request);
  return response.data.data;
};

export const suspendTenantLicense = async (tenantId: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/license/suspend`);
};

export const activateTenantLicense = async (tenantId: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/license/activate`);
};

export const getTenantUsage = async (tenantId: string): Promise<UsageStats> => {
  const response = await axios.get(`${API_BASE_URL}/tenants/${tenantId}/license/usage`);
  return response.data.data;
};

