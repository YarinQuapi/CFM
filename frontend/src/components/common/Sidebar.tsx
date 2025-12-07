import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiServer, FiFolder, FiUsers, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../stores/authStore";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/servers", label: "Servers", icon: FiServer },
    { path: "/shared-files", label: "Shared Files", icon: FiFolder },
    ...(user?.role == "2"
      ? [{ path: "/users", label: "User Management", icon: FiUsers }]
      : []),
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>C F M</h1>
        <p className={styles.subtitle}>Controlled File Management</p>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <item.icon className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.username}>{user?.displayName}</span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
        </div>
        <button onClick={logout} className={styles.logoutButton} title="Logout">
          <FiLogOut className={styles.logoutIcon} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
