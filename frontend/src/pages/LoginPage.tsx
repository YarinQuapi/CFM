import React, { useState } from 'react';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { login } = useAuthStore();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await authService.login(credentials);
      login(response.user, response.token);
      toast.success(`Welcome back, ${response.user.username}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>MC</div>
          </div>
          <h1 className={styles.title}>Minecraft Server Manager</h1>
          <p className={styles.subtitle}>Sign in to manage your servers</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => {
                  setCredentials({...credentials, username: e.target.value});
                  if (errors.username) {
                    setErrors({...errors, username: ''});
                  }
                }}
                disabled={loading}
              />
            </div>
            {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({...credentials, password: e.target.value});
                  if (errors.password) {
                    setErrors({...errors, password: ''});
                  }
                }}
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Secure access to your Minecraft server infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
