import axios from 'axios';

// VITE_API_URL should be specified like: https://khata-store-1.onrender.com
// Note: we append /api here because backend routes are under /api
const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE = base.endsWith('/api') ? base : `${base}/api`;

const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
