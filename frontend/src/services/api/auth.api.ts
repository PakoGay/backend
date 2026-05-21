import { getAxiosInstance } from '@/config/axios';
import { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth';

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await getAxiosInstance().post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<LoginResponse> => {
    const response = await getAxiosInstance().post<LoginResponse>('/auth/register', payload);
    return response.data;
  },

  verify: async (token: string) => {
    const response = await getAxiosInstance().post('/auth/verify', { token });
    return response.data;
  },

  logout: async () => {
    const response = await getAxiosInstance().post('/auth/logout');
    return response.data;
  },
};

