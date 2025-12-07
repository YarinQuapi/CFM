import React from "react";
import { FiBell, FiSettings } from "react-icons/fi";
import { useAuthStore } from "../../stores/authStore";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.pageInfo}>
          <h2 className={styles.pageTitle}>
            {getPageTitle(window.location.pathname)}
          </h2>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionButton} title="Notifications">
            <FiBell />
          </button>
          <button className={styles.actionButton} title="Settings">
            <FiSettings />
          </button>
        </div>
      </div>
    </header>
  );
};

const getPageTitle = (pathname: string): string => {
  if (pathname.includes("/servers/")) return "Server Details";
  if (pathname.includes("/servers")) return "Servers";
  if (pathname.includes("/shared-files")) return "Shared Files";
  if (pathname.includes("/users")) return "User Management";
  if (pathname.includes("/dashboard")) return "Dashboard";
  return "Dashboard";
};

export default Header;
