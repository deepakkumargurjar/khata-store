require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not defined in .env');
  process.exit(1);
}

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logger (temporary - helpful while testing)
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

app.use('/api', authRoutes);           // /api/register, /api/login
app.use('/api/folders', folderRoutes); // /api/folders...
app.use('/api/items', itemRoutes);     // /api/items...
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);


// simple root
app.get('/', (req, res) => res.send('Hello from backend'));

// connect and start
async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}
start();
