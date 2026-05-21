import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'PARENT' | 'CHILD' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    set({ 
      user: userData, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },
}));