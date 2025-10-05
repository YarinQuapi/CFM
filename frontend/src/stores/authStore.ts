import { create } from 'zustand';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  
  getUser: () => {
	  return get().user;
  },

  login: (user, token) => {
    localStorage.setItem('token', token);
	  localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
	  localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateUser: (user) => set({ user }),
  
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // WIP: validate token with backend
      set({ token, isAuthenticated: true });
    }
  }
}));
