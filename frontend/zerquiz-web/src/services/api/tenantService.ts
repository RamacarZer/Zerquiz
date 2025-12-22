import apiClient from "./apiClient";
import { ApiResponse } from "../../types/api";

export interface TenantDto {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string;
  companyName?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Company Representative (Şirket Temsilcisi)
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeTitle?: string;
  representativeEmail?: string;
  representativePhone?: string;
  
  // IT Contact (Bilgi İşlem Sorumlusu)
  itContactFirstName?: string;
  itContactLastName?: string;
  itContactTitle?: string;
  itContactEmail?: string;
  itContactPhone?: string;
  
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
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
  isActive?: boolean;
  subdomain?: string;
  customDomain?: string;
  companyName?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Company Representative
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeTitle?: string;
  representativeEmail?: string;
  representativePhone?: string;
  
  // IT Contact
  itContactFirstName?: string;
  itContactLastName?: string;
  itContactTitle?: string;
  itContactEmail?: string;
  itContactPhone?: string;
}

export interface UpdateTenantRequest {
  name: string;
  isActive: boolean;
  companyName?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Company Representative
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeTitle?: string;
  representativeEmail?: string;
  representativePhone?: string;
  
  // IT Contact
  itContactFirstName?: string;
  itContactLastName?: string;
  itContactTitle?: string;
  itContactEmail?: string;
  itContactPhone?: string;
  
  subscriptionStatus?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
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
      "/api/core/Tenants"
    );
    return response.data.data;
  },

  getTenant: async (id: string) => {
    const response = await apiClient.get<ApiResponse<TenantDto>>(
      `/api/core/Tenants/by-id/${id}`
    );
    return response.data.data;
  },

  createTenant: async (data: CreateTenantRequest) => {
    const response = await apiClient.post<ApiResponse<TenantDto>>(
      "/api/core/Tenants",
      data
    );
    return response.data.data;
  },

  updateTenant: async (id: string, data: UpdateTenantRequest) => {
    const response = await apiClient.put<ApiResponse<TenantDto>>(
      `/api/core/Tenants/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTenant: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/api/core/Tenants/${id}`
    );
    return response.data.data;
  },

  toggleTenantStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/api/core/Tenants/${id}/toggle-status`
    );
    return response.data.data;
  },

  // License Package APIs
  getLicensePackages: async () => {
    const response = await apiClient.get<ApiResponse<LicensePackageDto[]>>(
      "/api/core/LicensePackages"
    );
    return response.data.data;
  },

  getLicensePackage: async (id: string) => {
    const response = await apiClient.get<ApiResponse<LicensePackageDto>>(
      `/api/core/LicensePackages/${id}`
    );
    return response.data.data;
  },

  createLicensePackage: async (data: CreateLicensePackageRequest) => {
    const response = await apiClient.post<ApiResponse<LicensePackageDto>>(
      "/api/core/LicensePackages",
      data
    );
    return response.data.data;
  },

  toggleLicensePackageStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/api/core/LicensePackages/${id}/toggle-status`
    );
    return response.data.data;
  },

  // Tenant License APIs
  getTenantLicenses: async (tenantId: string) => {
    const response = await apiClient.get<ApiResponse<TenantLicenseDto[]>>(
      `/api/core/TenantLicenses/tenant/${tenantId}`
    );
    return response.data.data;
  },

  createTenantLicense: async (data: CreateTenantLicenseRequest) => {
    const response = await apiClient.post<ApiResponse<TenantLicenseDto>>(
      "/api/core/TenantLicenses",
      data
    );
    return response.data.data;
  },

  suspendTenantLicense: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/api/core/TenantLicenses/${id}/suspend`
    );
    return response.data.data;
  },

  activateTenantLicense: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/api/core/TenantLicenses/${id}/activate`
    );
    return response.data.data;
  },
};
