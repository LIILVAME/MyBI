import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Base path pour GitHub Pages
const base = process.env.NODE_ENV === 'production' 
  ? '/MyBI/'  // Nom du repository GitHub
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
    minify: 'esbuild', // Utilise esbuild au lieu de terser (plus rapide, inclus par défaut)
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router']
        }
      }
    }
  }
})

