import React, { useState, useEffect } from 'react';
import { FiPlus, FiServer, FiEdit2, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Server } from '../types';
import { serverService } from '../services/serverService';
import ServerModal from '../components/servers/ServerModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import styles from './ServersPage.module.css';

const ServersPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [deletingServer, setDeletingServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const canEdit = user?.role !== '0';
  const canDelete = user?.role === '2';

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const data = await serverService.getServers();
      setServers(data);
    } catch (error) {
      toast.error('Failed to load servers');
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddServer = () => {
    setEditingServer(null);
    setShowModal(true);
  };

  const handleEditServer = (server: Server) => {
    setEditingServer(server);
    setShowModal(true);
  };

  const handleDeleteServer = async () => {
    if (!deletingServer) return;
    
    try {
      await serverService.deleteServer(deletingServer.id);
      setServers(servers.filter(s => s.id !== deletingServer.id));
      toast.success('Server deleted successfully');
    } catch (error) {
      toast.error('Failed to delete server');
      console.error('Failed to delete server:', error);
    } finally {
      setDeletingServer(null);
    }
  };
  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case '0': return styles.statusOnline;
      case '1': return styles.statusOffline;
      case '2': return styles.statusMaintenance;
      default: return styles.statusOffline;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading servers...</p>
      </div>
    );
  }

  return (
    <div className={styles.serversPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Server Management</h1>
          <p className={styles.subtitle}>Manage your Minecraft server infrastructure</p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddServer}
            className={`btn-base btn-primary ${styles.addButton}`}
          >
            <FiPlus />
            Add Server
          </button>
        )}
      </div>

      {servers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiServer />
          </div>
          <h3 className={styles.emptyTitle}>No servers found</h3>
          <p className={styles.emptyDescription}>
            Get started by creating your first Minecraft server
          </p>
          {canEdit && (
            <button
              onClick={handleAddServer}
              className="btn-base btn-primary"
            >
              <FiPlus />
              Create Your First Server
            </button>
          )}
        </div>
      ) : (
        <div className={styles.serverGrid}>
          {servers.map((server) => (
            <div key={server.id} className={styles.serverCard}>
              <div className={styles.serverHeader}>
                <div className={styles.serverInfo}>
                  <div className={styles.serverIcon}>
                    <FiServer />
                  </div>
                  <div className={styles.serverDetails}>
                    <h3 className={styles.serverName}>{server.name}</h3>
                    <p className={styles.serverAddress}>{server.host}</p>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${getStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              
              {server.description && (
                <p className={styles.serverDescription}>{server.description}</p>
              )}
              
              <div className={styles.serverStats}>
                {/* {server.playerCount !== undefined && (
                  <div className={styles.playerCount}>
                    <FiUsers className={styles.statIcon} />
                    <span>{server.playerCount}/{server.maxPlayers} players</span>
                  </div>
                )} */}
                <div className={styles.serverAge}>
                  Created {formatDate(server.createdAt)}
                </div>
              </div>
              
              <div className={styles.serverActions}>
                <Link
                  to={`/servers/${server.id}`}
                  className={`btn-base btn-primary ${styles.actionButton}`}
                >
                  <FiEye />
                  View Files
                </Link>
                
                {canEdit && (
                  <button
                    onClick={() => handleEditServer(server)}
                    className={`btn-base btn-secondary ${styles.actionButton}`}
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={() => setDeletingServer(server)}
                    className={`btn-base btn-danger ${styles.actionButton}`}
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ServerModal
          server={editingServer}
          onClose={() => setShowModal(false)}
          onSave={loadServers}
        />
      )}

      {deletingServer && (
        <ConfirmDialog
          title="Delete Server"
          message={`Are you sure you want to delete "${deletingServer.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteServer}
          onCancel={() => setDeletingServer(null)}
          variant="danger"
        />
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default ServersPage;
