import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/": {
        // target: "http://localhost:6001",//local
        // target: "https://twod-tutorial-web-application.onrender.com", //vinay
        target:"https://twod-tutorial-web-application-3brq.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
