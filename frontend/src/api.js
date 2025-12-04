// frontend/src/api.js
import axios from 'axios';

// Prefer VITE_API_URL from your build-time env (Vite) — fallback to same host /api
const base = import.meta.env.VITE_API_URL || (window.location.origin + '/api');

// ensure trailing /api is not doubled
const baseURL = base.endsWith('/api') ? base : (base.replace(/\/$/, '') + '/api');

const API = axios.create({
  baseURL
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
