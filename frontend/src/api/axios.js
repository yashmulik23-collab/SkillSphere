import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Use environment variable if available
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Avoid redirect loops if we're already on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
