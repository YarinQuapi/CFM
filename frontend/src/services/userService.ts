import fetchFromAPI from '../lib/api';
import { User } from '../types';


export const userService = {
  async getUsers(): Promise<User[]> {
    const users = await fetchFromAPI('api/users', 'GET')

    console.log(users);

    return users.users;
  },

  async createUser(user: User): Promise<User> {
    const response = await fetchFromAPI('api/users', 'POST', JSON.stringify({type: 'create', user}));

    if (!response.ok) {
      throw new Error('Failed to create user');
    }


    return {
      ...response.user
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
