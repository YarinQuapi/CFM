import { fetchFromAPIObject } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { FileItem, SharedFile } from '../types';

export const fileService = {
  async getServerFiles(serverId: string, path: string = '/'): Promise<FileItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data
    return [
      {
        id: '1',
        name: 'world',
        path: '/world',
        type: 'directory',
        modifiedAt: '2024-02-15T10:30:00Z',
        isShared: false,
        sharedWith: []
      },
      {
        id: '2',
        name: 'plugins',
        path: '/plugins',
        type: 'directory',
        modifiedAt: '2024-02-14T15:20:00Z',
        isShared: true,
        sharedWith: ['2', '3']
      },
      {
        id: '3',
        name: 'server.properties',
        path: '/server.properties',
        type: 'file',
        size: 1024,
        modifiedAt: '2024-02-16T08:45:00Z',
        isShared: true,
        sharedWith: ['1', '2']
      }
    ];
  },

  async getSharedFiles(path: string = '/'): Promise<SharedFile[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        name: 'common-plugins',
        path: '/common-plugins',
        type: 'directory',
        uploadedBy: '1',
        uploadedAt: '2024-02-10T12:00:00Z',
        sharedWith: ['1', '2', '3'],
        syncStatus: 'synced'
      },
      {
        id: '2',
        name: 'server-icon.png',
        path: '/server-icon.png',
        type: 'file',
        size: 4096,
        uploadedBy: '1',
        uploadedAt: '2024-02-12T14:30:00Z',
        sharedWith: ['1', '2'],
        syncStatus: 'pending'
      }
    ];
  },

  async uploadFiles(path: string, files: FileList): Promise<void> {
    const formData = new FormData();
    const userId = useAuthStore.getState().user?.id || 'unknown';

    for (let i = 0; i < files.length; i++) {
      formData.set('file', files[i]);
    }

    const body = {
      formData,
      uploader: userId,
      path: path
    }

    const response = await fetchFromAPIObject('api/files', "POST", body);

    if (!response.ok) {
      throw new Error('File upload failed');
    }
  },

  async createDirectory(path: string, name: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async shareFileWithServer(fileId: string, serverId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async addSharedFilesToServer(serverId: string, fileIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
