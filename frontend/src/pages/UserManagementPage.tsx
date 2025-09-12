import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiShield } from "react-icons/fi";
import { User } from "../types";
import { userService } from "../services/userService";
import UserModal from "../components/users/UserModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import styles from "./UserManagementPage.module.css";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    (async () => {
    try {
      setLoading(true);
      const users = await userService.getUsers();
      setUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      // setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  })();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      
      console.log("logged " + data);
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await userService.deleteUser(deletingUser.id);
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Failed to delete user:", error);
    } finally {
      setDeletingUser(null);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const updatedUser = await userService.updateUser(user.id, {
        isActive: !user.isActive,
      });
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      toast.success(
        `User ${
          updatedUser.isActive ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Failed to update user status:", error);
    }
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "2":
        return styles.roleSuperadmin;
      case "1":
        return styles.roleEditor;
      case "0":
        return styles.roleViewer;
      default:
        return styles.roleViewer;
    }
  };

  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "2":
        return <FiShield />;
      case "1":
        return <FiEdit2 />;
      case "0":
        return <FiUser />;
      default:
        return <FiUser />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userManagementPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage system users and permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className={`btn-base btn-primary ${styles.addButton}`}
        >
          <FiPlus />
          Add User
        </button>
      </div>

      <div className={styles.usersSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>System Users</h2>
          <span className={styles.userCount}>{users.length} users</span>
        </div>

        <div className={styles.userTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>User</div>
            <div className={styles.headerCell}>Role</div>
            <div className={styles.headerCell}>Status</div>
            <div className={styles.headerCell}>Last Login</div>
            <div className={styles.headerCell}>Actions</div>
          </div>

          <div className={styles.tableBody}>
            {users.map((user) => (
              <div key={user.id} className={styles.tableRow}>
                <div className={styles.userCell}>
                  <div className={styles.userAvatar}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.username}>{user.displayName}</h3>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                </div>

                <div className={styles.roleCell}>
                  <div
                    className={`${styles.roleBadge} ${getRoleColor(user.role)}`}
                  >
                    {getRoleIcon(user.role)}
                    <span>{user.role}</span>
                  </div>
                </div>

                <div className={styles.statusCell}>
                  <button
                    onClick={() => handleToggleUserStatus(user)}
                    className={`${styles.statusToggle} ${
                      user.isActive ? styles.active : styles.inactive
                    }`}
                    disabled={user.id === currentUser?.id}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className={styles.loginCell}>
                  {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                </div>

                <div className={styles.actionsCell}>
                  <button
                    onClick={() => handleEditUser(user)}
                    className={`btn-base btn-secondary ${styles.actionButton}`}
                    disabled={user.id === currentUser?.id && user.role === "2"}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => setDeletingUser(user)}
                    className={`btn-base btn-danger ${styles.actionButton}`}
                    disabled={user.id === currentUser?.id}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {users.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiUser />
            </div>
            <h3 className={styles.emptyTitle}>No users found</h3>
            <p className={styles.emptyDescription}>
              Create your first user to get started.
            </p>
            <button onClick={handleAddUser} className="btn-base btn-primary">
              <FiPlus />
              Create First User
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={loadUsers}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete "${deletingUser.displayName}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
          variant="danger"
        />
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default UserManagementPage;
