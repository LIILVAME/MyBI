import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// Base path pour GitHub Pages vs Vercel
// Par défaut, utiliser '/' pour Vercel/Netlify
// Pour GitHub Pages, définir VITE_BASE_PATH=/MyBI/ dans les variables d'environnement
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'MyBI - Suivi Intelligent de Biens Immobiliers',
        short_name: 'MyBI',
        description: 'Plateforme de gestion et de suivi intelligent de biens immobiliers avec monitoring en temps réel',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${base}icons/icon-72x72.png`,
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-96x96.png`,
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-128x128.png`,
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-144x144.png`,
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-152x152.png`,
            sizes: '152x152',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-384x384.png`,
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: `${base}icons/icon-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 jours
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Désactivé en dev pour éviter les problèmes
      }
    })
  ],
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

