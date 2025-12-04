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
const FRONTEND_URL = process.env.FRONTEND_URL || ''; // set this in Render to your frontend URL (e.g. https://khata-storee.onrender.com)

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// CORS: allow only the frontend origin or allow all if FRONTEND_URL is empty (temporary)
const corsOptions = {
  origin: FRONTEND_URL || true, // set FRONTEND_URL in Render for production (do NOT use true in prod)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
// make sure preflight (OPTIONS) uses cors as well:
app.options('*', cors(corsOptions));

// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logger (only enable while testing)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('[REQ]', req.method, req.originalUrl);
    next();
  });
}

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

// health + root
app.get('/', (req, res) => res.send('Hello from backend'));
app.get('/health', (req, res) => res.json({ ok: true, mongoConnected: mongoose.connection.readyState === 1 }));

// init: connect DB (if available) and always start server so Render sees a bound port
async function init() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ Connected to MongoDB');
    } else {
      console.warn('⚠️ MONGO_URI not set — skipping DB connect (set this in Render env vars).');
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    // don't exit; start server so Render can show logs and you can debug
  } finally {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (FRONTEND_URL=${FRONTEND_URL || 'not set'})`);
    });
  }

  // helpful mongoose events
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
}

init();
