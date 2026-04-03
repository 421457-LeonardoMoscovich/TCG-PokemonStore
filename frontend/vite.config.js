import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // If WSL localhost forwarding breaks, use WSL IP: wsl -e hostname -I
      '/api': 'http://localhost:3005',
    },
  },
})
