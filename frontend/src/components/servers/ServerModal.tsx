import React, { useState, useEffect } from 'react';
import { FiX, FiServer } from 'react-icons/fi';
import { Server } from '../../types';
import { serverService } from '../../services/serverService';
import toast from 'react-hot-toast';
import styles from './ServerModal.module.css';

interface ServerModalProps {
  server?: Server | null;
  onClose: () => void;
  onSave: () => void;
}

const ServerModal: React.FC<ServerModalProps> = ({ server, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 25565,
    description: '',
    status: '0' as Server['status']
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name,
        host: server.host,
        port: server.port,
        description: server.description || '',
        status: server.status,
      });
    }
  }, [server]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Server name is required';
    }

    if (!formData.host.trim()) {
      newErrors.host = 'Host address is required';
    }

    if (!formData.port || formData.port < 1 || formData.port > 65535) {
      newErrors.port = 'Port must be between 1 and 65535';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (server) {
        await serverService.updateServer(server.id, formData);
        toast.success('Server updated successfully');
      } else {
        await serverService.createServer(formData);
        toast.success('Server created successfully');
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save server');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <FiServer />
            </div>
            <h2 className={styles.title}>
              {server ? 'Edit Server' : 'Add New Server'}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="name">
                Server Name *
              </label>
              <input
                id="name"
                type="text"
                className={`input-base ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter server name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={loading}
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="host">
                Host Address *
              </label>
              <input
                id="host"
                type="text"
                className={`input-base ${errors.host ? styles.inputError : ''}`}
                placeholder="192.168.1.100 or mc.example.com"
                value={formData.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                disabled={loading}
              />
              {errors.host && <span className={styles.errorMessage}>{errors.host}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="port">
                Port *
              </label>
              <input
                id="port"
                type="number"
                className={`input-base ${errors.port ? styles.inputError : ''}`}
                placeholder="25565"
                min="1"
                max="65535"
                value={formData.port}
                onChange={(e) => handleInputChange('port', parseInt(e.target.value) || '')}
                disabled={loading}
              />
              {errors.port && <span className={styles.errorMessage}>{errors.port}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="input-base"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Server['status'])}
                disabled={loading}
              >
                <option value="0">Offline</option>
                <option value="1">Online</option>
                <option value="2">Maintenance</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="input-base"
              placeholder="Enter server description (optional)"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
            />
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : (
                server ? 'Update Server' : 'Create Server'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServerModal;
