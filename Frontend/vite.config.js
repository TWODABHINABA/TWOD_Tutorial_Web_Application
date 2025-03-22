import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isLocal = process.argv.includes("dev");
// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://twod-tutorial-web-application-3brq.onrender.com" || "http://localhost:6001" ,   
//         // target: "https://twod-tutorial-web-application-3brq.onrender.com",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: isLocal
          ? "http://localhost:6001"  // Local server
          : "https://twod-tutorial-web-application-3brq.onrender.com", // Live server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

