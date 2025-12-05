// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const helmet = require('helmet');

const app = express();
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const FRONTEND_URL = process.env.FRONTEND_URL || ''; // e.g. https://khata-storee.onrender.com
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

// configure cloudinary (safe defaults if not set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// security headers
app.use(helmet());

// CORS config: prefer explicit FRONTEND_URL or ALLOWED_ORIGINS; fallback to allow all (only while testing)
const origins = [];
if (FRONTEND_URL) origins.push(FRONTEND_URL);
if (ALLOWED_ORIGINS.length) origins.push(...ALLOWED_ORIGINS);

const corsOptions = {
  origin: function(origin, callback) {
    // allow non-browser tools (no origin) and same-origin
    if (!origin) return callback(null, true);
    // if list provided, only allow those
    if (origins.length > 0) {
      if (origins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    }
    // no list configured -> allow all (development)
    return callback(null, true);
  },
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// apply CORS and preflight handling
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// small request logger for debugging
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} - origin:${req.headers.origin || '-'}`);
  next();
});

// mount routes (unchanged)
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
app.get('/health', (req, res) => res.json({
  ok: true,
  mongoReadyState: mongoose.connection.readyState // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
}));

// connect and start server
async function init() {
  // Start server immediately so health checks don't fail even if DB is slow
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (FRONTEND_URL=${FRONTEND_URL || 'not set'})`);
  });

  if (!MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set — DB connection skipped. Set env MONGO_URI in Render.');
    return;
  }

  try {
    // Longer serverSelectionTimeoutMS to handle remote DB slowness
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connect failed:', err && err.message ? err.message : err);
    // Don't crash the server — keep it running so you can debug (the routes will fail if they require DB)
  }

  // helpful listeners
  mongoose.connection.on('connected', () => console.log('MongoDB: connected'));
  mongoose.connection.on('error', (e) => console.error('MongoDB error:', e && e.message ? e.message : e));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB: disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB: reconnected'));
}

init();
