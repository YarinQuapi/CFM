import { Server } from '../types';

// const API_BASE_URL = process.env.API_URL;
// const API_KEY = 

interface PostServerRequest {
  type: string;
  server: Server;
}

export const serverService = {
  async getServers(): Promise<Server[]> {
    try {
    const response = await fetch('http://localhost:3000/api/servers');
    if (!response.ok) {

      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
    const data = await response.json();

    data.servers.forEach((server: Server) => {
      if (server.host.includes(':')) {
        const [host, port] = server.host.split(':');
        server.host = host;
        server.port = parseInt(port);
      }
    });

    return data.servers;

  } catch (error) {
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
    console.log('Creating server:', server);

    const request = {
      type: 'create',
      server
    } as PostServerRequest;
  
    const response = await fetch('http://localhost:3000/api/servers', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
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

  async updateServer(server: Server): Promise<Server> {
    
    const request = {
      type: 'update',
      server
    } as PostServerRequest;
  
    const response = await fetch('http://localhost:3000/api/servers', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
    
    const server2 = await this.getServer(server.id);
    return { ...server, ...server2 };
  },

  async deleteServer(server: Server): Promise<void> {
    const request = {
      type: 'delete',
      server
    } as PostServerRequest;
  
    const response = await fetch('http://localhost:3000/api/servers', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
  }
};
