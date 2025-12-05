// frontend/src/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Ensure trailing /api is present in env var or fallback handles it
const baseURL = BASE.endsWith('/api') ? BASE : (BASE.replace(/\/$/, '') + '/api');

const API = axios.create({
  baseURL,
  // you can set timeout if you want
  timeout: 20000
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
