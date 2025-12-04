// frontend/src/api.js
import axios from 'axios';

// VITE_API_URL should be set at build time; fallback to localhost for local dev
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: base,
  // Add any defaults
  withCredentials: false, // set true if you use cookies and server supports credentials
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
