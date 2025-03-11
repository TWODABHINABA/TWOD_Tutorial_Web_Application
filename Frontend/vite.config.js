import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:6001",
        target: "https://twod-tutorial-web-application.onrender.com/api",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
