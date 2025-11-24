import apiClient from "./apiClient";

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

export const roleService = {
  getRoles: async () => {
    const response = await apiClient.get<ApiResponse<RoleDto[]>>(
      "/identity/roles"
    );
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await apiClient.get<ApiResponse<RoleDto>>(
      `/identity/roles/${id}`
    );
    return response.data;
  },
};

