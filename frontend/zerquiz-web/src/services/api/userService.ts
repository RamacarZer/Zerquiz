import apiClient from "./apiClient";

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
  permissions?: string[];
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantId?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateUserRolesRequest {
  roleIds: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const userService = {
  getUsers: async (page: number = 1, pageSize: number = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.append("search", search);
    
    const response = await apiClient.get<ApiResponse<UserDto[]>>(
      `/identity/users?${params}`
    );
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<ApiResponse<UserDto>>(
      `/identity/users/${id}`
    );
    return response.data;
  },

  createUser: async (data: CreateUserRequest) => {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      "/identity/auth/register",
      data
    );
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    const response = await apiClient.put<ApiResponse<UserDto>>(
      `/identity/users/${id}`,
      data
    );
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/identity/users/${id}/toggle-status`
    );
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/identity/users/${id}`
    );
    return response.data;
  },

  updateUserRoles: async (id: string, roleIds: string[]) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/identity/users/${id}/roles`,
      { roleIds }
    );
    return response.data;
  },
};

