import React, { useState, useRef } from 'react';
import { FiX, FiUpload, FiFile, FiTrash2 } from 'react-icons/fi';
import styles from './FileUploadModal.module.css';

interface FileUploadModalProps {
  onClose: () => void;
  onUpload: (files: FileList) => Promise<void>;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const fileList = createFileList(selectedFiles);
      await onUpload(fileList);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const createFileList = (files: File[]): FileList => {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    return dt.files;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <FiUpload />
            </div>
            <h2 className={styles.title}>Upload Files</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <div className={styles.content}>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={styles.dropZoneContent}>
              <FiUpload className={styles.dropZoneIcon} />
              <h3 className={styles.dropZoneTitle}>
                Drop files here or click to browse
              </h3>
              <p className={styles.dropZoneSubtitle}>
                Select multiple files to upload to shared storage
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className={styles.hiddenInput}
          />

          {selectedFiles.length > 0 && (
            <div className={styles.fileList}>
              <div className={styles.fileListHeader}>
                <h3>Selected Files ({selectedFiles.length})</h3>
                <span className={styles.totalSize}>
                  Total: {formatFileSize(totalSize)}
                </span>
              </div>
              
              <div className={styles.files}>
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <FiFile className={styles.fileIcon} />
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeButton}
                      disabled={uploading}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className="btn-base btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`btn-base btn-primary ${uploading ? styles.loading : ''}`}
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <div className={styles.spinner}></div>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload />
                Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
