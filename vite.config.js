import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Base path pour GitHub Pages (remplacer 'mybi' par votre nom de repo)
const base = process.env.NODE_ENV === 'production' 
  ? '/mybi/'  // ⚠️ IMPORTANT: Remplacez 'mybi' par le nom exact de votre repository GitHub
  : '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router']
        }
      }
    }
  }
})

