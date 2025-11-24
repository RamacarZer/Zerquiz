import apiClient from "./apiClient";
import { ApiResponse } from "../../types/api";

export interface TenantDto {
  id: string;
  name: string;
  slug: string;
  customDomain?: string;
  companyName: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionStatus: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LicensePackageDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  maxUsers: number;
  maxStudents: number;
  maxQuestions: number;
  maxExams: number;
  maxStorageMB: number;
  isActive: boolean;
  displayOrder: number;
}

export interface TenantLicenseDto {
  id: string;
  tenantId: string;
  tenantName?: string;
  licensePackageId: string;
  licensePackageName: string;
  licensePackageCode: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  customDomain?: string;
  companyName: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdateTenantRequest {
  name: string;
  companyName: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface CreateLicensePackageRequest {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  maxUsers: number;
  maxStudents: number;
  maxQuestions: number;
  maxExams: number;
  maxStorageMB: number;
  displayOrder: number;
}

export interface CreateTenantLicenseRequest {
  tenantId: string;
  licensePackageId: string;
  startDate: string;
  endDate: string;
}

export const tenantService = {
  // Tenant APIs
  getTenants: async () => {
    const response = await apiClient.get<ApiResponse<TenantDto[]>>(
      "/core/tenants"
    );
    return response.data.data;
  },

  getTenant: async (id: string) => {
    const response = await apiClient.get<ApiResponse<TenantDto>>(
      `/core/tenants/${id}`
    );
    return response.data.data;
  },

  createTenant: async (data: CreateTenantRequest) => {
    const response = await apiClient.post<ApiResponse<TenantDto>>(
      "/core/tenants",
      data
    );
    return response.data.data;
  },

  updateTenant: async (id: string, data: UpdateTenantRequest) => {
    const response = await apiClient.put<ApiResponse<TenantDto>>(
      `/core/tenants/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTenant: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/core/tenants/${id}`
    );
    return response.data.data;
  },

  toggleTenantStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/core/tenants/${id}/toggle-status`
    );
    return response.data.data;
  },

  // License Package APIs
  getLicensePackages: async () => {
    const response = await apiClient.get<ApiResponse<LicensePackageDto[]>>(
      "/core/licensepackages"
    );
    return response.data.data;
  },

  getLicensePackage: async (id: string) => {
    const response = await apiClient.get<ApiResponse<LicensePackageDto>>(
      `/core/licensepackages/${id}`
    );
    return response.data.data;
  },

  createLicensePackage: async (data: CreateLicensePackageRequest) => {
    const response = await apiClient.post<ApiResponse<LicensePackageDto>>(
      "/core/licensepackages",
      data
    );
    return response.data.data;
  },

  toggleLicensePackageStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/core/licensepackages/${id}/toggle-status`
    );
    return response.data.data;
  },

  // Tenant License APIs
  getTenantLicenses: async (tenantId: string) => {
    const response = await apiClient.get<ApiResponse<TenantLicenseDto[]>>(
      `/core/tenantlicenses/tenant/${tenantId}`
    );
    return response.data.data;
  },

  createTenantLicense: async (data: CreateTenantLicenseRequest) => {
    const response = await apiClient.post<ApiResponse<TenantLicenseDto>>(
      "/core/tenantlicenses",
      data
    );
    return response.data.data;
  },

  suspendTenantLicense: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/core/tenantlicenses/${id}/suspend`
    );
    return response.data.data;
  },

  activateTenantLicense: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/core/tenantlicenses/${id}/activate`
    );
    return response.data.data;
  },
};
