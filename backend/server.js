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
const FRONTEND_URL = process.env.FRONTEND_URL || ''; // set this in Render to your frontend URL

if (!MONGO_URI) {
  console.warn('⚠️ MONGO_URI not defined. App will start but DB will not connect.');
}

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// --- CORS configuration ---
// If FRONTEND_URL is set, only allow that origin. If empty, allow all origins (useful for testing).
const corsOptions = {
  origin: FRONTEND_URL ? FRONTEND_URL : true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true
};
app.use(cors(corsOptions));

// Preflight handling (optional, but explicit)
app.options('*', cors(corsOptions));

// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logger
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// mount routes
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

// health / root
app.get('/', (req, res) => res.send('Hello from backend'));
app.get('/health', (req, res) => res.json({ ok: true, mongoConnected: mongoose.connection.readyState === 1 }));

// init and start
async function init() {
  try {
    if (MONGO_URI) {
      try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Connected to MongoDB');
      } catch (dbErr) {
        console.error('MongoDB connect failed:', dbErr && dbErr.message ? dbErr.message : dbErr);
      }
    } else {
      console.warn('⚠️ MONGO_URI not set — skipping DB connect');
    }
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
