import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiFolder,
  FiFile,
  FiPlus,
  FiDownload,
  FiShare2,
} from "react-icons/fi";
import { Server, FileItem } from "../types";
import { serverService } from "../services/serverService";
import { fileService } from "../services/fileService";
import FileContextMenu from "../components/files/FileContextMenu";
import SharedFilesModal from "../components/files/SharedFilesModal";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import styles from "./ServerDetailPage.module.css";

const ServerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<Server | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileItem;
  } | null>(null);
  const [showSharedFilesModal, setShowSharedFilesModal] = useState(false);
  const { user } = useAuthStore();

  const canEdit = user?.role !== "0";

  useEffect(() => {
    if (id) {
      loadServerDetails(id);
      loadServerFiles(id, currentPath);
    }
  }, [id, currentPath]);

  const loadServerDetails = async (serverId: string) => {
    try {
      const data = await serverService.getServer(serverId);
      setServer(data);
    } catch (error) {
      toast.error("Failed to load server details");
      console.error("Failed to load server details:", error);
    }
  };

  const loadServerFiles = async (serverId: string, path: string) => {
    try {
      const data = await fileService.getServerFiles(serverId, path);
      setFiles(data);
    } catch (error) {
      toast.error("Failed to load server files");
      console.error("Failed to load server files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === "directory") {
      setCurrentPath(file.path);
    }
  };

  const handleFileRightClick = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    if (canEdit) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        file,
      });
    }
  };

  const handleAddSharedFiles = async (selectedFiles: string[]) => {
    if (!id) return;

    try {
      await fileService.addSharedFilesToServer(id, selectedFiles);
      loadServerFiles(id, currentPath);
      toast.success("Shared files added successfully");
    } catch (error) {
      toast.error("Failed to add shared files");
      console.error("Failed to add shared files:", error);
    }
  };

  const breadcrumbParts = currentPath.split("/").filter(Boolean);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading server details...</p>
      </div>
    );
  }

  if (!server) {
    return (
      <div className={styles.error}>
        <h2>Server not found</h2>
        <p>The requested server could not be found.</p>
        <Link to="/servers" className="btn-base btn-primary">
          <FiArrowLeft />
          Back to Servers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.serverDetail}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            to="/servers"
            className={`btn-base btn-secondary ${styles.backButton}`}
          >
            <FiArrowLeft />
            Back to Servers
          </Link>
          <div className={styles.serverInfo}>
            <h1 className={styles.serverName}>{server.name}</h1>
            <p className={styles.serverAddress}>
              {server.host}:{server.port}
            </p>
            {server.description && (
              <p className={styles.serverDescription}>{server.description}</p>
            )}
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowSharedFilesModal(true)}
            className={`btn-base btn-primary ${styles.addFilesButton}`}
          >
            <FiPlus />
            Add Shared Files
          </button>
        )}
      </div>

      <nav className={styles.breadcrumb}>
        <button
          onClick={() => setCurrentPath("/")}
          className={`${styles.breadcrumbItem} ${
            currentPath === "/" ? styles.active : ""
          }`}
        >
          Root
        </button>
        {breadcrumbParts.map((part, index) => {
          const path = "/" + breadcrumbParts.slice(0, index + 1).join("/");
          return (
            <React.Fragment key={path}>
              <span className={styles.breadcrumbSeparator}>/</span>
              <button
                onClick={() => setCurrentPath(path)}
                className={`${styles.breadcrumbItem} ${
                  path === currentPath ? styles.active : ""
                }`}
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className={styles.filesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Server Files</h2>
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
                {file.type === "directory" ? (
                  <FiFolder className={styles.folderIcon} />
                ) : (
                  <FiFile className={styles.fileItemIcon} />
                )}
              </div>

              <div className={styles.fileInfo}>
                <h3 className={styles.fileName}>{file.name}</h3>
                <div className={styles.fileMeta}>
                  <span className={styles.fileDate}>
                    Modified: {formatDate(file.createdAt)}
                  </span>
                  {file.size && (
                    <>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.fileSize}>
                        {formatFileSize(file.size)}
                      </span>
                    </>
                  )}
                  {file.isShared && (
                    <>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.sharedIndicator}>
                        <FiShare2 className={styles.shareIcon} />
                        Shared
                      </span>
                    </>
                  )}
                </div>
              </div>

              {file.isShared && (
                <div className={styles.sharedBadge}>
                  <FiShare2 />
                  <span>
                    Shared with {file.sharedWith?.length || 0} server(s)
                  </span>
                </div>
              )}
            </div>
          ))}

          {files.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiFolder />
              </div>
              <h3 className={styles.emptyTitle}>No files found</h3>
              <p className={styles.emptyDescription}>
                This directory is empty or no files are accessible.
              </p>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onClose={() => setContextMenu(null)}
          canEdit={canEdit}
        />
      )}

      {showSharedFilesModal && (
        <SharedFilesModal
          serverId={id!}
          onClose={() => setShowSharedFilesModal(false)}
          onAdd={handleAddSharedFiles}
        />
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default ServerDetailPage;
