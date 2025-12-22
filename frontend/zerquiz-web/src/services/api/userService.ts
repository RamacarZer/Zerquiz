import apiClient from './apiClient';
import { ApiResponse } from '../../types/api';

// ==================== TYPES ====================

export interface UserDto {
  id: string;
  tenantId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  identityNumber?: string;
  
  // Department & Position - Direct from backend
  department?: {
    id: string;
    name: string;
    code: string;
  };
  position?: {
    id: string;
    name: string;
    code: string;
    level: number;
    displayOrder: number;
  };
  primaryRole?: {
    id: string;
    name: string;
    description?: string;
  };
  
  // For backward compatibility
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  primaryRoleId?: string;
  primaryRoleName?: string;
  
  // Status
  isActive: boolean;
  emailConfirmed: boolean;
  
  // Profile
  avatarUrl?: string;
  bio?: string;
  
  // Roles
  roles?: string[];
  
  // Audit
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  identityNumber?: string;
  
  departmentId?: string;
  positionId?: string;
  primaryRoleId?: string;
  
  isActive?: boolean;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  identityNumber?: string;
  
  departmentId?: string;
  positionId?: string;
  primaryRoleId?: string;
  
  isActive: boolean;
  avatarUrl?: string;
  bio?: string;
}

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentDepartmentId?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface PositionDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  level: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

// ==================== USER ENDPOINTS ====================

export const getUsers = async (page: number = 1, pageSize: number = 100, search?: string): Promise<{ data: UserDto[], total: number }> => {
  const response = await apiClient.get<ApiResponse<UserDto[]>>('/api/Users', {
    params: { page, pageSize, search }
  });
  return {
    data: response.data?.data || [],
    total: response.data?.data?.length || 0
  };
};

export const toggleUserStatus = async (id: string): Promise<void> => {
  await apiClient.put(`/api/Users/${id}/toggle-status`);
};

export const getUser = async (id: string): Promise<UserDto> => {
  const response = await apiClient.get<ApiResponse<UserDto>>(`/api/Users/${id}`);
  return response.data?.data || response.data;
};

export const createUser = async (request: CreateUserRequest): Promise<UserDto> => {
  const response = await apiClient.post<ApiResponse<UserDto>>('/api/Users', request);
  return response.data?.data || response.data;
};

export const updateUser = async (id: string, request: UpdateUserRequest): Promise<void> => {
  await apiClient.put(`/api/Users/${id}`, request);
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Users/${id}`);
};

export const activateUser = async (id: string): Promise<void> => {
  await apiClient.post(`/api/Users/${id}/activate`);
};

export const deactivateUser = async (id: string): Promise<void> => {
  await apiClient.post(`/api/Users/${id}/deactivate`);
};

export const changePassword = async (id: string, request: ChangePasswordRequest): Promise<void> => {
  await apiClient.post(`/api/Users/${id}/change-password`, request);
};

export const resetPassword = async (id: string, request: ResetPasswordRequest): Promise<void> => {
  await apiClient.post(`/api/Users/${id}/reset-password`, request);
};

export const assignRoles = async (id: string, request: AssignRolesRequest): Promise<void> => {
  await apiClient.post(`/api/Users/${id}/roles`, request);
};

export const getUserRoles = async (id: string): Promise<RoleDto[]> => {
  const response = await apiClient.get<ApiResponse<RoleDto[]>>(`/api/Users/${id}/roles`);
  return response.data?.data || [];
};

// ==================== ROLE ENDPOINTS ====================

export const getRoles = async (): Promise<RoleDto[]> => {
  const response = await apiClient.get<ApiResponse<RoleDto[]>>('/api/Roles');
  return response.data?.data || [];
};

export const getRole = async (id: string): Promise<RoleDto> => {
  const response = await apiClient.get<ApiResponse<RoleDto>>(`/api/Roles/${id}`);
  return response.data?.data || response.data;
};

export const createRole = async (request: Partial<RoleDto>): Promise<RoleDto> => {
  const response = await apiClient.post<ApiResponse<RoleDto>>('/api/Roles', request);
  return response.data?.data || response.data;
};

export const updateRole = async (id: string, request: Partial<RoleDto>): Promise<void> => {
  await apiClient.put(`/api/Roles/${id}`, request);
};

export const deleteRole = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Roles/${id}`);
};

// ==================== DEPARTMENT ENDPOINTS ====================

export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await apiClient.get<ApiResponse<DepartmentDto[]>>('/api/Departments');
  return response.data?.data || [];
};

export const getDepartment = async (id: string): Promise<DepartmentDto> => {
  const response = await apiClient.get<ApiResponse<DepartmentDto>>(`/api/Departments/${id}`);
  return response.data?.data || response.data;
};

export const createDepartment = async (request: Partial<DepartmentDto>): Promise<DepartmentDto> => {
  const response = await apiClient.post<ApiResponse<DepartmentDto>>('/api/Departments', request);
  return response.data?.data || response.data;
};

export const updateDepartment = async (id: string, request: Partial<DepartmentDto>): Promise<void> => {
  await apiClient.put(`/api/Departments/${id}`, request);
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Departments/${id}`);
};

// ==================== POSITION ENDPOINTS ====================

export const getPositions = async (): Promise<PositionDto[]> => {
  const response = await apiClient.get<ApiResponse<PositionDto[]>>('/api/Positions');
  return response.data?.data || [];
};

export const getPosition = async (id: string): Promise<PositionDto> => {
  const response = await apiClient.get<ApiResponse<PositionDto>>(`/api/Positions/${id}`);
  return response.data?.data || response.data;
};

export const createPosition = async (request: Partial<PositionDto>): Promise<PositionDto> => {
  const response = await apiClient.post<ApiResponse<PositionDto>>('/api/Positions', request);
  return response.data?.data || response.data;
};

export const updatePosition = async (id: string, request: Partial<PositionDto>): Promise<void> => {
  await apiClient.put(`/api/Positions/${id}`, request);
};

export const deletePosition = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Positions/${id}`);
};

// ==================== BULK OPERATIONS ====================

export const bulkActivateUsers = async (userIds: string[]): Promise<void> => {
  await apiClient.post('/api/Users/bulk/activate', { userIds });
};

export const bulkDeactivateUsers = async (userIds: string[]): Promise<void> => {
  await apiClient.post('/api/Users/bulk/deactivate', { userIds });
};

export const bulkDeleteUsers = async (userIds: string[]): Promise<void> => {
  await apiClient.post('/api/Users/bulk/delete', { userIds });
};

export const bulkAssignRole = async (userIds: string[], roleId: string): Promise<void> => {
  await apiClient.post('/api/Users/bulk/assign-role', { userIds, roleId });
};

// ==================== SEARCH & FILTER ====================

export interface UserSearchParams {
  search?: string;
  roleId?: string;
  departmentId?: string;
  positionId?: string;
  isActive?: boolean;
  emailConfirmed?: boolean;
  page?: number;
  pageSize?: number;
}

export const searchUsers = async (params: UserSearchParams): Promise<{ users: UserDto[], total: number }> => {
  const response = await apiClient.get<ApiResponse<{ users: UserDto[], total: number }>>('/api/Users/search', { params });
  return {
    users: response.data?.data?.users || [],
    total: response.data?.data?.total || 0
  };
};
