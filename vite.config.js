import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ✅ ensures relative paths for assets
  plugins: [react()],
  server: {
    host: '0.0.0.0', // ✅ allow external connections (Replit proxy)
    port: parseInt(process.env.PORT) || 5173, // ✅ use Replit's assigned port
    allowedHosts: true // ✅ allow Replit dynamic subdomains
  }
})
