import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Force port 5173
    strictPort: true, // Don't switch ports if 5173 is busy
    proxy: {
      '/architect-api': {
        target: 'https://qantum-framework-private.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/architect-api/, ''),
      }
    }
  }
})
