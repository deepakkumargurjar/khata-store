// frontend/src/api.js
import axios from 'axios';

// VITE_API_URL should be something like "https://your-backend.onrender.com/api"
// If VITE_API_URL is not provided, fallback to local dev server
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE,
  // you can add timeout here if you like, e.g. timeout: 10000
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

export default API;
