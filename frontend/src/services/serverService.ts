import { Server } from '../types';

// const API_BASE_URL = process.env.API_URL;
// const API_KEY = 

export const serverService = {
  async getServers(): Promise<Server[]> {
    try {
    const response = await fetch('http://localhost:3000/api/servers');
    if (!response.ok) {

      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
    const data = await response.json();

    console.log(data);

    return data.servers;

  } catch (error) {

    console.error('Failed to load servers:', error);
    alert(error.message);
    return [];
  }
  },

  async getServer(id: string): Promise<Server> {
    const servers = await this.getServers();
    const server = servers.find(s => s.id === id);
    if (!server) throw new Error('Server not found');
    return server;
  },

  async createServer(server: Omit<Server, 'id' | 'createdAt'>): Promise<Server> {
    // await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Creating server:', server);

  
    const response = await fetch('http://localhost:3000/api/servers', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(server)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }

    return {
      ...server,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  },

  async updateServer(id: string, updates: Partial<Server>): Promise<Server> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const server = await this.getServer(id);
    return { ...server, ...updates };
  },

  async deleteServer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
