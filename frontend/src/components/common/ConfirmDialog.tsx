import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default'
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <FiAlertTriangle />
          </div>
          <button onClick={onCancel} className={styles.closeButton}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.actions}>
          <button
            onClick={onCancel}
            className="btn-base btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn-base ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
