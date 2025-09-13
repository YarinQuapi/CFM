import React, { useState, useEffect } from "react";
import { FiServer, FiFolder, FiUsers, FiActivity } from "react-icons/fi";
import { DashboardStats } from "../types";
import { useAuthStore } from "../stores/authStore";
import styles from "./DashboardPage.module.css";
import { serverService } from "../services/serverService";
import { userService } from "../services/userService";

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const servers = await serverService.getServers()
    const users = await userService.getUsers()

    setStats({
      totalServers: servers.length,
      onlineServers: servers.filter((s) => s.status === "1").length,
      totalFiles: 24,
      totalUsers: users.length,
      recentActivity: [
        {
          id: "1",
          type: "file_uploaded",
          description: "Uploaded server-icon.png to shared files",
          timestamp: "2024-02-16T10:30:00Z",
          userId: "1",
          username: "admin",
        },
        {
          id: "2",
          type: "server_updated",
          description: "Updated Main Survival Server configuration",
          timestamp: "2024-02-16T09:15:00Z",
          userId: "1",
          username: "admin",
        },
        {
          id: "3",
          type: "file_shared",
          description: "Shared common-plugins with Creative Build Server",
          timestamp: "2024-02-15T16:45:00Z",
          userId: "2",
          username: "moderator",
        },
      ],
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user?.displayName}!</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiServer />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalServers}</h3>
            <p className={styles.statLabel}>Total Servers</p>
            <span className={styles.statSubtext}>
              {stats.onlineServers} online
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiFolder />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalFiles}</h3>
            <p className={styles.statLabel}>Shared Files</p>
            <span className={styles.statSubtext}>Across all servers</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalUsers}</h3>
            <p className={styles.statLabel}>Active Users</p>
            <span className={styles.statSubtext}>System administrators</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiActivity />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>98%</h3>
            <p className={styles.statLabel}>Uptime</p>
            <span className={styles.statSubtext}>Last 30 days</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.activitySection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityDescription}>
                    {activity.description}
                  </p>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityUser}>
                      {activity.username}
                    </span>
                    <span className={styles.activityTime}>
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <a href="/servers" className={styles.actionCard}>
              <FiServer className={styles.actionIcon} />
              <span>Manage Servers</span>
            </a>
            <a href="/shared-files" className={styles.actionCard}>
              <FiFolder className={styles.actionIcon} />
              <span>Shared Files</span>
            </a>
            {user && (
              <a href="/users" className={styles.actionCard}>
                <FiUsers className={styles.actionIcon} />
                <span>User Management</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "server_created":
    case "server_updated":
      return <FiServer />;
    case "file_uploaded":
    case "file_shared":
      return <FiFolder />;
    case "user_created":
      return <FiUsers />;
    default:
      return <FiActivity />;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default DashboardPage;
