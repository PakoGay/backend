import { getAxiosInstance } from '@/config/axios';
import { UserAccount, PaginatedResponse } from '@/types';

export const adminApi = {
  getUsers: async (page: number = 0, size: number = 10) => {
    const response = await getAxiosInstance().get<PaginatedResponse<UserAccount>>('/admin/users', {
      params: { page, size },
    });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await getAxiosInstance().get<UserAccount>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserAccount>) => {
    const response = await getAxiosInstance().put<UserAccount>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await getAxiosInstance().delete(`/admin/users/${id}`);
    return response.data;
  },

  getAnalytics: async (startDate?: string, endDate?: string) => {
    const response = await getAxiosInstance().get('/admin/analytics', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getActivityLogs: async (page: number = 0, size: number = 10) => {
    const response = await getAxiosInstance().get('/admin/activity-logs', {
      params: { page, size },
    });
    return response.data;
  },
};

