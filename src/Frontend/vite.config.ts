import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 10000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://fuzzy-rotary-phone-v69974jwx664fx96q-5000.app.github.dev',
        changeOrigin: true,
        secure: false
      },
      '/swagger': {
        target: 'https://fuzzy-rotary-phone-v69974jwx664fx96q-5000.app.github.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
