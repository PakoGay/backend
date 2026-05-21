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
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData, token) => {
    localStorage.setItem('accessToken', token);
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },
}));