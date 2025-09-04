import { User } from '../types';


export const userService = {
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: '2',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-02-16T10:30:00Z',
        isActive: true
      },
      {
        id: '2',
        username: 'moderator',
        email: 'mod@example.com',
        role: '1',
        createdAt: '2024-01-15T00:00:00Z',
        lastLogin: '2024-02-15T16:20:00Z',
        isActive: true
      },
      {
        id: '3',
        username: 'viewer_user',
        email: 'viewer@example.com',
        role: '0',
        createdAt: '2024-02-01T00:00:00Z',
        lastLogin: '2024-02-10T14:15:00Z',
        isActive: false
      }
    ];
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = await this.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    
    return { ...user, ...updates };
  },

  async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
