import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Base path pour GitHub Pages vs Vercel
// Par défaut, utiliser '/' pour Vercel/Netlify
// Pour GitHub Pages, définir VITE_BASE_PATH=/MyBI/ dans les variables d'environnement
const base = process.env.VITE_BASE_PATH || '/'

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

