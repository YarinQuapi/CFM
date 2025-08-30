import { create } from 'zustand';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateUser: (user) => set({ user }),
  
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, verify token with backend
      set({ token, isAuthenticated: true });
    }
  }
}));
