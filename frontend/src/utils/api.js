import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const userInfoFromStorage = localStorage.getItem('userInfo');
    if (userInfoFromStorage) {
      const userInfo = JSON.parse(userInfoFromStorage);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data && error.response.data.detail
        ? error.response.data.detail
        : error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
