import React, { useState } from 'react';
import { FiX, FiFolder } from 'react-icons/fi';
import styles from './CreateDirectoryModal.module.css';

interface CreateDirectoryModalProps {
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

const CreateDirectoryModal: React.FC<CreateDirectoryModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateName = (name: string): string => {
    if (!name.trim()) {
      return 'Directory name is required';
    }
    
    if (name.includes('/') || name.includes('\\')) {
      return 'Directory name cannot contain slashes';
    }
    
    if (name.startsWith('.')) {
      return 'Directory name cannot start with a dot';
    }
    
    if (name.length > 255) {
      return 'Directory name is too long';
    }
    
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onCreate(name.trim());
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create directory');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <FiFolder />
            </div>
            <h2 className={styles.title}>Create New Directory</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.content}>
            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="directoryName">
                Directory Name
              </label>
              <input
                id="directoryName"
                type="text"
                className={`input-base ${error ? styles.inputError : ''}`}
                placeholder="Enter directory name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={loading}
                autoFocus
              />
              {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
            
            <div className={styles.guidelines}>
              <h4 className={styles.guidelinesTitle}>Naming Guidelines:</h4>
              <ul className={styles.guidelinesList}>
                <li>Use only letters, numbers, hyphens, and underscores</li>
                <li>Cannot contain slashes or start with a dot</li>
                <li>Maximum length is 255 characters</li>
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className="btn-base btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-base btn-primary ${loading ? styles.loading : ''}`}
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiFolder />
                  Create Directory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDirectoryModal;
