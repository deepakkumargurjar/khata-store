require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const helmet = require('helmet');

const app = express();
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(helmet());

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

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

app.get('/', (req, res) => res.send("Backend Running"));

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

start();
