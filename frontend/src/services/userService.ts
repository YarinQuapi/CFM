import fetchFromAPI from '../lib/api';
import { User } from '../types';


export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await fetchFromAPI('api/users', 'GET');
    const data = await response.json();

    return data.users || [];
  },

  async createUser(user: User): Promise<User> {
    const response = await fetchFromAPI('api/users', 'POST', JSON.stringify({type: 'create', user}));

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const data = await response.json();

    return {
      ...response.user
    };
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = await this.getUsers();
    
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');

    Object.keys(updates).forEach(key => {
      if (updates[key as keyof User] !== undefined) {
        (user as any)[key] = updates[key as keyof User];
      }
    });
    
    const response = await fetchFromAPI('api/users', 'POST', JSON.stringify({type: 'update', user}));

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return { ...user, ...updates };
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetchFromAPI('api/users', 'POST', JSON.stringify({type: 'delete', id}));

    console.log(id);

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
};
