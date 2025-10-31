import axios from 'axios';

const VITE_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the token from localStorage
// This implements the "quick dev" (localStorage) option
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Don't attach for signup/login
      if (!config.url.includes('/auth/signup') && !config.url.includes('/auth/login')) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;