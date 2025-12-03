import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 🚀 IMPORTANT: this makes Vite work on Render
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  // Build output folder
  build: {
    outDir: "dist",
  },
});
