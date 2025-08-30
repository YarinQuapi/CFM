import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './stores/authStore';

// Initialize auth store
useAuthStore.getState().initializeAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
