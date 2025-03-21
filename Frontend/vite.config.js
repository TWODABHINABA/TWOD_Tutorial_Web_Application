import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://twod-tutorial-web-application-3brq.onrender.com" ||"http://localhost:6001" ,   
        // target: "https://twod-tutorial-web-application-3brq.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
