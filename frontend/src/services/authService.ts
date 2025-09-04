import fetchFromAPI from '../lib/api';
import { User } from '../types';

export const authService = {
  async login(credentials: { username: string; password: string }) {
    const loginRequest = await fetchFromAPI('api/users',
      JSON.stringify({
        type: 'authorize',
        credentials
       }));

    if (loginRequest.status !== 200) {
      throw new Error('Invalid username or password');
    }


    const user = loginRequest.user as User;

    return { user };
  }
};
