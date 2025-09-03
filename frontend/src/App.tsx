import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import ServerDetailPage from './pages/ServerDetailPage';
import SharedFilesPage from './pages/SharedFilesPage';
import UserManagementPage from './pages/UserManagementPage';
import './styles/globals.css';
import styles from './App.module.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={styles.app}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/servers" element={<ServersPage />} />
                    <Route path="/servers/:id" element={<ServerDetailPage />} />
                    <Route path="/shared-files" element={<SharedFilesPage />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: styles.toast,
          duration: 4000,
        }}
      />
    </div>
  );
}

export default App;
