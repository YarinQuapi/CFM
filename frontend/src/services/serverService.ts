import { Server } from '../types';

export const serverService = {
  async getServers(): Promise<Server[]> {
    // Mock data - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        name: 'Main Survival Server',
        host: '192.168.1.100',
        port: 25565,
        status: 'online',
        description: 'Primary survival server for the community',
        createdAt: '2024-01-15T10:30:00Z',
        filesPath: '/home/minecraft/survival',
        playerCount: 12,
        maxPlayers: 50
      },
      {
        id: '2',
        name: 'Creative Build Server',
        host: '192.168.1.101',
        port: 25566,
        status: 'offline',
        description: 'Creative server for building projects',
        createdAt: '2024-01-20T14:20:00Z',
        filesPath: '/home/minecraft/creative',
        playerCount: 0,
        maxPlayers: 30
      },
      {
        id: '3',
        name: 'Modded Adventure',
        host: '192.168.1.102',
        port: 25567,
        status: 'maintenance',
        description: 'Modded server with adventure packs',
        createdAt: '2024-02-01T09:15:00Z',
        filesPath: '/home/minecraft/modded',
        playerCount: 0,
        maxPlayers: 20
      }
    ];
  },

  async getServer(id: string): Promise<Server> {
    const servers = await this.getServers();
    const server = servers.find(s => s.id === id);
    if (!server) throw new Error('Server not found');
    return server;
  },

  async createServer(server: Omit<Server, 'id' | 'createdAt'>): Promise<Server> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
