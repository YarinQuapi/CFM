export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  status: '0' | '1' | '2';
  description?: string;
  createdAt?: string;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  uploader: string;
  modifiedAt?: string;
  permissions?: string[];
  sharedWith?: string[]; // server IDs
  isShared: boolean;
  syncStatus: 'synced' | 'pending' | 'error';
  createdAt: string;
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
