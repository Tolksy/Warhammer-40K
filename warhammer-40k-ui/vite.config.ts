import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths so dist/index.html works when opened from a subfolder
  // (e.g. with VS Code Live Server) instead of assuming site root "/".
  base: './',
})
