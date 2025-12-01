Image-Money Gallery - Vite + Plain CSS Frontend + Backend Skeleton
----------------------------------------------------------------
This project includes:
- backend (Express + MongoDB + Cloudinary) in /backend
- frontend (Vite + React + plain CSS) in /frontend

Quick start (backend):
1. cd backend
2. npm install
3. copy .env.example to .env and fill values (MONGO_URI, JWT_SECRET, Cloudinary keys)
4. npm run dev

Quick start (frontend):
1. cd frontend
2. npm install
3. copy .env.example to .env and set VITE_API_URL (e.g. http://localhost:5000/api)
4. npm run dev

Notes:
- If you can't use Cloudinary, change backend/routes/items.js to save locally.
- This is a starter template; adjust styles and add features as needed.
