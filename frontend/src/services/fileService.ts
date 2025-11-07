import { useAuthStore } from '../stores/authStore';
import { FileItem } from '../types';

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
        uploader: "sdfsdf",
        isShared: false,
        sharedWith: [],
        syncStatus: "synced",
        createdAt: ""
      },
    ];
  },

  async getSharedFiles(): Promise<FileItem[]> {
    const response = await fetch("http://localhost:3000/api/files");

    const data = await response.json();

    return data.files;
  },

  async uploadFiles(path: string, files: FileList): Promise<void> {
    const formData = new FormData();
    const userId = useAuthStore.getState().user?.id || 'unknown';

    for (let i = 0; i < files.length; i++) {
      formData.set('file', files[i]);
      formData.set('userId', userId);
      formData.set('path', path);
    }

    const response = await fetch('http://localhost:3000/api/files', { method: "POST", body: formData });

    if (!response.ok) {
      throw new Error('File upload failed');
    }
  },

  async createDirectory(path: string, name: string, uploader: string): Promise<void> {
    const response = await fetch("http://localhost:3000/api/files/create-directory",  
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'post-action',
                action: 'create-directory',
                uploader: uploader,
                name: name,
                path: path
            })
        });

    if (!response.ok) {
        throw new Error(await response.text());
    }
  },

  async shareFileWithServer(fileId: string, serverId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async addSharedFilesToServer(serverId: string, fileIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
