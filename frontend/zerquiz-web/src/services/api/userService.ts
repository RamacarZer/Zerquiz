import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/identity';

// ==================== TYPES ====================

export interface UserDto {
  id: string;
  tenantId: string;
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
  
  // Department & Position
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

export const getUsers = async (): Promise<UserDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data?.data || response.data || [];
};

export const getUser = async (id: string): Promise<UserDto> => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`);
  return response.data?.data || response.data;
};

export const createUser = async (request: CreateUserRequest): Promise<UserDto> => {
  const response = await axios.post(`${API_BASE_URL}/users`, request);
  return response.data?.data || response.data;
};

export const updateUser = async (id: string, request: UpdateUserRequest): Promise<void> => {
  await axios.put(`${API_BASE_URL}/users/${id}`, request);
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${id}`);
};

export const activateUser = async (id: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${id}/activate`);
};

export const deactivateUser = async (id: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${id}/deactivate`);
};

export const changePassword = async (id: string, request: ChangePasswordRequest): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${id}/change-password`, request);
};

export const resetPassword = async (id: string, request: ResetPasswordRequest): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${id}/reset-password`, request);
};

export const assignRoles = async (id: string, request: AssignRolesRequest): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${id}/roles`, request);
};

export const getUserRoles = async (id: string): Promise<RoleDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}/roles`);
  return response.data?.data || response.data || [];
};

// ==================== ROLE ENDPOINTS ====================

export const getRoles = async (): Promise<RoleDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/roles`);
  return response.data?.data || response.data || [];
};

export const getRole = async (id: string): Promise<RoleDto> => {
  const response = await axios.get(`${API_BASE_URL}/roles/${id}`);
  return response.data?.data || response.data;
};

export const createRole = async (request: Partial<RoleDto>): Promise<RoleDto> => {
  const response = await axios.post(`${API_BASE_URL}/roles`, request);
  return response.data?.data || response.data;
};

export const updateRole = async (id: string, request: Partial<RoleDto>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/roles/${id}`, request);
};

export const deleteRole = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/roles/${id}`);
};

// ==================== DEPARTMENT ENDPOINTS ====================

export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/departments`);
  return response.data?.data || response.data || [];
};

export const getDepartment = async (id: string): Promise<DepartmentDto> => {
  const response = await axios.get(`${API_BASE_URL}/departments/${id}`);
  return response.data?.data || response.data;
};

export const createDepartment = async (request: Partial<DepartmentDto>): Promise<DepartmentDto> => {
  const response = await axios.post(`${API_BASE_URL}/departments`, request);
  return response.data?.data || response.data;
};

export const updateDepartment = async (id: string, request: Partial<DepartmentDto>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/departments/${id}`, request);
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/departments/${id}`);
};

// ==================== POSITION ENDPOINTS ====================

export const getPositions = async (): Promise<PositionDto[]> => {
  const response = await axios.get(`${API_BASE_URL}/positions`);
  return response.data?.data || response.data || [];
};

export const getPosition = async (id: string): Promise<PositionDto> => {
  const response = await axios.get(`${API_BASE_URL}/positions/${id}`);
  return response.data?.data || response.data;
};

export const createPosition = async (request: Partial<PositionDto>): Promise<PositionDto> => {
  const response = await axios.post(`${API_BASE_URL}/positions`, request);
  return response.data?.data || response.data;
};

export const updatePosition = async (id: string, request: Partial<PositionDto>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/positions/${id}`, request);
};

export const deletePosition = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/positions/${id}`);
};

// ==================== BULK OPERATIONS ====================

export const bulkActivateUsers = async (userIds: string[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/bulk/activate`, { userIds });
};

export const bulkDeactivateUsers = async (userIds: string[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/bulk/deactivate`, { userIds });
};

export const bulkDeleteUsers = async (userIds: string[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/bulk/delete`, { userIds });
};

export const bulkAssignRole = async (userIds: string[], roleId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/bulk/assign-role`, { userIds, roleId });
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
  const response = await axios.get(`${API_BASE_URL}/users/search`, { params });
  return {
    users: response.data?.data || response.data?.users || [],
    total: response.data?.total || 0
  };
};
