import React, { useState, useEffect } from 'react';
import { FiPlus, FiFolder, FiFile, FiUpload, FiServer, FiMoreVertical } from 'react-icons/fi';
import { SharedFile } from '../types';
import { fileService } from '../services/fileService';
import CreateDirectoryModal from '../components/files/CreateDirectoryModal';
import FileUploadModal from '../components/files/FileUploadModal';
import FileContextMenu from '../components/files/FileContextMenu';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import styles from './SharedFilesPage.module.css';

const SharedFilesPage: React.FC = () => {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(true);
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: SharedFile;
  } | null>(null);
  const { user } = useAuthStore();

  const canEdit = user?.role !== 'viewer';

  useEffect(() => {
    loadSharedFiles();
  }, [currentPath]);

  const loadSharedFiles = async () => {
    try {
      const data = await fileService.getSharedFiles(currentPath);
      setFiles(data);
    } catch (error) {
      toast.error('Failed to load shared files');
      console.error('Failed to load shared files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file: SharedFile) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path);
    }
  };

  const handleFileRightClick = (e: React.MouseEvent, file: SharedFile) => {
    e.preventDefault();
    if (canEdit) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        file
      });
    }
  };

  const handleCreateDirectory = async (name: string) => {
    try {
      await fileService.createDirectory(currentPath, name);
      loadSharedFiles();
      toast.success('Directory created successfully');
    } catch (error) {
      toast.error('Failed to create directory');
      console.error('Failed to create directory:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    try {
      await fileService.uploadFiles(currentPath, files);
      loadSharedFiles();
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('Failed to upload files:', error);
    }
  };

  const breadcrumbParts = currentPath.split('/').filter(Boolean);

  const getSyncStatusColor = (status: SharedFile['syncStatus']) => {
    switch (status) {
      case 'synced': return styles.statusSynced;
      case 'pending': return styles.statusPending;
      case 'error': return styles.statusError;
      default: return styles.statusPending;
    }
  };

  const getSyncStatusText = (status: SharedFile['syncStatus']) => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'pending': return 'Pending';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading shared files...</p>
      </div>
    );
  }

  return (
    <div className={styles.sharedFilesPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Shared Files</h1>
          <p className={styles.subtitle}>Manage files shared across multiple servers</p>
        </div>
        
        {canEdit && (
          <div className={styles.headerActions}>
            <button
              onClick={() => setShowCreateDirModal(true)}
              className={`btn-base btn-secondary ${styles.actionButton}`}
            >
              <FiFolder />
              New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`btn-base btn-primary ${styles.actionButton}`}
            >
              <FiUpload />
              Upload Files
            </button>
          </div>
        )}
      </div>

      <nav className={styles.breadcrumb}>
        <button
          onClick={() => setCurrentPath('/')}
          className={`${styles.breadcrumbItem} ${currentPath === '/' ? styles.active : ''}`}
        >
          Shared Files
        </button>
        {breadcrumbParts.map((part, index) => {
          const path = '/' + breadcrumbParts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <span className={styles.breadcrumbSeparator}>/</span>
              <button
                onClick={() => setCurrentPath(path)}
                className={`${styles.breadcrumbItem} ${path === currentPath ? styles.active : ''}`}
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className={styles.filesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Files and Folders</h2>
          <span className={styles.fileCount}>{files.length} items</span>
        </div>
        
        <div className={styles.fileList}>
          {files.map((file) => (
            <div
              key={file.id}
              className={styles.fileItem}
              onClick={() => handleFileClick(file)}
              onContextMenu={(e) => handleFileRightClick(e, file)}
            >
              <div className={styles.fileIcon}>
                {file.type === 'directory' ? (
                  <FiFolder className={styles.folderIcon} />
                ) : (
                  <FiFile className={styles.fileItemIcon} />
                )}
              </div>
              
              <div className={styles.fileInfo}>
                <h3 className={styles.fileName}>{file.name}</h3>
                <div className={styles.fileMeta}>
                  <span className={styles.fileDate}>
                    Uploaded: {formatDate(file.uploadedAt)}
                  </span>
                  {file.size && (
                    <>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.fileSize}>
                        {formatFileSize(file.size)}
                      </span>
                    </>
                  )}
                  <span className={styles.metaSeparator}>•</span>
                  <span className={styles.uploadedBy}>
                    by {file.uploadedBy}
                  </span>
                </div>
              </div>
              
              <div className={styles.fileActions}>
                <div className={styles.syncStatus}>
                  <span className={`${styles.statusBadge} ${getSyncStatusColor(file.syncStatus)}`}>
                    {getSyncStatusText(file.syncStatus)}
                  </span>
                </div>
                
                {file.sharedWith.length > 0 && (
                  <div className={styles.sharedInfo}>
                    <FiServer className={styles.serverIcon} />
                    <span className={styles.sharedCount}>
                      {file.sharedWith.length} server{file.sharedWith.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {canEdit && (
                  <button 
                    className={styles.menuButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileRightClick(e, file);
                    }}
                  >
                    <FiMoreVertical />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiFolder />
              </div>
              <h3 className={styles.emptyTitle}>No files found</h3>
              <p className={styles.emptyDescription}>
                Upload files or create folders to get started with sharing across servers.
              </p>
              {canEdit && (
                <div className={styles.emptyActions}>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-base btn-primary"
                  >
                    <FiUpload />
                    Upload Your First File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateDirModal && (
        <CreateDirectoryModal
          onClose={() => setShowCreateDirModal(false)}
          onCreate={handleCreateDirectory}
        />
      )}

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onClose={() => setContextMenu(null)}
          canEdit={canEdit}
          isSharedFile={true}
        />
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default SharedFilesPage;
