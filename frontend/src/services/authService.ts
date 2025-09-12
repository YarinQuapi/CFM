import fetchFromAPI from '../lib/api';

export const authService = {
  async login(credentials: { username: string; password: string }) {
    const loginRequest = await fetchFromAPI('api/users', 'POST',
      JSON.stringify({
        type: 'authorize',
        credentials
       }));

    const data = await loginRequest.json();

    if (loginRequest.status !== 200) {
      return { ok: false, error: 'Invalid username or password' };
    }

    return { ok: true, user: data.user };
  }
};
