// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || ''; // e.g. https://khata-storee.onrender.com

// If you left MONGO_URI missing in production, app should not crash silently.
// Here we allow the app to start (useful for debug), but prefer setting MONGO_URI.
if (!MONGO_URI) {
  console.warn('Warning: MONGO_URI not defined. App will start but DB will not connect.');
}

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// IMPORTANT: configure CORS to allow your frontend origin (or * while testing)
const corsOptions = {
  origin: FRONTEND_URL || true, // if FRONTEND_URL empty => allow all (not ideal for production)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};
app.use(cors(corsOptions));

// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logger (temporary - helpful while testing)
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// mount routes (no changes)
const authRoutes = require('./routes/auth');
const folderRoutes = require('./routes/folders');
const itemRoutes = require('./routes/items');
const statsRoutes = require('./routes/stats');
const profileRoutes = require('./routes/profile');

app.use('/api', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);

// health and root
app.get('/', (req, res) => res.send('Hello from backend'));
app.get('/health', (req, res) => res.json({ ok: true, mongoConnected: mongoose.connection.readyState === 1 }));

// start server and connect DB (non-fatal if DB fails; server still binds)
async function init() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ Connected to MongoDB');
    } else {
      console.warn('⚠️ MONGO_URI not set — skipping DB connect');
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
  } finally {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (FRONTEND_URL=${FRONTEND_URL || 'not set'})`);
    });
  }

  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
}

init();
