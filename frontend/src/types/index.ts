export interface User {
  id: string;
  username: string;
  email: string;
  role: 'viewer' | 'editor' | 'superadmin';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'online' | 'offline' | 'maintenance';
  description?: string;
  createdAt: string;
  filesPath: string;
  playerCount?: number;
  maxPlayers?: number;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt: string;
  permissions?: string[];
  sharedWith?: string[]; // server IDs
  isShared: boolean;
}

export interface SharedFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  uploadedBy: string;
  uploadedAt: string;
  sharedWith: string[]; // server IDs
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalServers: number;
  onlineServers: number;
  totalFiles: number;
  totalUsers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'server_created' | 'server_updated' | 'file_uploaded' | 'file_shared' | 'user_created';
  description: string;
  timestamp: string;
  userId: string;
  username: string;
}
