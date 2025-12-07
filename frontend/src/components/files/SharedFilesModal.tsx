import React, { useState, useEffect } from "react";
import { FiX, FiFolder, FiFile, FiCheck } from "react-icons/fi";
import { fileService } from "../../services/fileService";
import toast from "react-hot-toast";
import styles from "./SharedFilesModal.module.css";
import { FileItem } from "../../types";

interface SharedFilesModalProps {
  serverId: string;
  onClose: () => void;
  onAdd: (selectedFiles: string[]) => Promise<void>;
}

const SharedFilesModal: React.FC<SharedFilesModalProps> = ({
  serverId,
  onClose,
  onAdd,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSharedFiles();
  }, []);

  const loadSharedFiles = async () => {
    try {
      const data = await fileService.getSharedFiles();
      // Filter out files already shared with this server
      const availableFiles = data.filter(
        (file) => !file.sharedWith?.includes(serverId)
      );
      setFiles(availableFiles);
    } catch (error) {
      toast.error("Failed to load shared files");
      console.error("Failed to load shared files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileToggle = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    const filteredFiles = getFilteredFiles();
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.id)));
    }
  };

  const handleAddFiles = async () => {
    if (selectedFiles.size === 0) return;

    setSaving(true);

    try {
      await onAdd(Array.from(selectedFiles));
      onClose();
    } catch (error) {
      console.error("Failed to add shared files:", error);
    } finally {
      setSaving(false);
    }
  };

  const getFilteredFiles = () => {
    if (!searchTerm) return files;

    return files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = getFilteredFiles();
  const allSelected =
    filteredFiles.length > 0 && selectedFiles.size === filteredFiles.length;

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading shared files...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <FiFolder />
            </div>
            <h2 className={styles.title}>Add Shared Files</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.searchSection}>
            <input
              type="text"
              className={`input-base ${styles.searchInput}`}
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredFiles.length > 0 && (
              <button
                onClick={handleSelectAll}
                className={`btn-base btn-secondary ${styles.selectAllButton}`}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          {filteredFiles.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiFolder />
              </div>
              <h3 className={styles.emptyTitle}>
                {searchTerm ? "No files found" : "No shared files available"}
              </h3>
              <p className={styles.emptyDescription}>
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "All shared files are already added to this server"}
              </p>
            </div>
          ) : (
            <div className={styles.fileList}>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`${styles.fileItem} ${
                    selectedFiles.has(file.id) ? styles.selected : ""
                  }`}
                  onClick={() => handleFileToggle(file.id)}
                >
                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleFileToggle(file.id)}
                      className={styles.checkboxInput}
                    />
                    <div className={styles.checkboxCustom}>
                      {selectedFiles.has(file.id) && <FiCheck />}
                    </div>
                  </div>

                  <div className={styles.fileIcon}>
                    {file.type === "directory" ? (
                      <FiFolder className={styles.folderIcon} />
                    ) : (
                      <FiFile className={styles.fileItemIcon} />
                    )}
                  </div>

                  <div className={styles.fileInfo}>
                    <h3 className={styles.fileName}>{file.name}</h3>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileType}>
                        {file.type === "directory" ? "Directory" : "File"}
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
                      <span className={styles.uploadDate}>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.sharedCount}>
                    <span className={styles.sharedText}>
                      Shared with {file.sharedWith?.length} server
                      {file.sharedWith?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className="btn-base btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleAddFiles}
            className={`btn-base btn-primary ${
              saving ? styles.loadingButton : ""
            }`}
            disabled={selectedFiles.size === 0 || saving}
          >
            {saving ? (
              <>
                <div className={styles.spinner}></div>
                Adding...
              </>
            ) : (
              `Add ${selectedFiles.size} File${
                selectedFiles.size !== 1 ? "s" : ""
              }`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedFilesModal;
