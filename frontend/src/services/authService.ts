import axios from 'axios';
import { User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authService = {
  async login(credentials: { username: string; password: string }) {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const user: User = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: '2',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      
      return { user, token: 'mock-token-12345' };
    }
    
    throw new Error('Invalid credentials');
  },

  async verifyToken(token: string) {
    // Mock implementation
    return {
      valid: true,
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    };
  }
};
