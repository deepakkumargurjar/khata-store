// frontend/src/api.js
import axios from 'axios';

// VITE_API_URL should be like: "https://khata-store-1.onrender.com/api"
// If you prefer, set without trailing /api and change paths accordingly.
// Current code expects API.post('/register') -> baseURL + '/register'
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: base });

// attach token if exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
