import React, { useEffect, useRef } from 'react';
import { FiShare2, FiDownload, FiCopy, FiTrash2, FiEdit } from 'react-icons/fi';
import { FileItem, SharedFile } from '../../types';
import styles from './FileContextMenu.module.css';

interface FileContextMenuProps {
  x: number;
  y: number;
  file: FileItem | SharedFile;
  onClose: () => void;
  canEdit: boolean;
  isSharedFile?: boolean;
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  x,
  y,
  file,
  onClose,
  canEdit,
  isSharedFile = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position
      if (x + rect.width > viewport.width) {
        adjustedX = viewport.width - rect.width - 10;
      }

      // Adjust vertical position
      if (y + rect.height > viewport.height) {
        adjustedY = viewport.height - rect.height - 10;
      }

      menu.style.left = `${Math.max(10, adjustedX)}px`;
      menu.style.top = `${Math.max(10, adjustedY)}px`;
    }
  }, [x, y]);

  const handleShareFile = () => {
    // Implement file sharing logic
    console.log('Share file:', file.name);
    onClose();
  };

  const handleDownloadFile = () => {
    // Implement file download logic
    console.log('Download file:', file.name);
    onClose();
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(file.path);
    onClose();
  };

  const handleRenameFile = () => {
    // Implement file rename logic
    console.log('Rename file:', file.name);
    onClose();
  };

  const handleDeleteFile = () => {
    // Implement file delete logic
    console.log('Delete file:', file.name);
    onClose();
  };

  const menuItems = [
    {
      label: 'Download',
      icon: FiDownload,
      onClick: handleDownloadFile,
      show: file.type === 'file'
    },
    {
      label: 'Share with Servers',
      icon: FiShare2,
      onClick: handleShareFile,
      show: isSharedFile && canEdit
    },
    {
      label: 'Copy Path',
      icon: FiCopy,
      onClick: handleCopyPath,
      show: true
    },
    {
      label: 'Rename',
      icon: FiEdit,
      onClick: handleRenameFile,
      show: canEdit
    },
    {
      label: 'Delete',
      icon: FiTrash2,
      onClick: handleDeleteFile,
      show: canEdit,
      danger: true
    }
  ];

  return (
    <div ref={menuRef} className={styles.contextMenu}>
      <div className={styles.menuHeader}>
        <span className={styles.fileName}>{file.name}</span>
      </div>
      <div className={styles.menuItems}>
        {menuItems.filter(item => item.show).map((item, index) => (
          <button
            key={index}
            className={`${styles.menuItem} ${item.danger ? styles.danger : ''}`}
            onClick={item.onClick}
          >
            <item.icon className={styles.menuIcon} />
            <span className={styles.menuLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileContextMenu;
