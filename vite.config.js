import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      '5173-im04lmjjdnkf7mzwsoyfk-39386b98.manusvm.computer',
      '5173-imn5i9el7vbmkbj27p8w5-9be91e8b.manusvm.computer',
      'localhost',
      '127.0.0.1'
    ],
    host: true
  }
})

