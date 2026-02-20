import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'logo.svg'],

      // ── Web App Manifest ───────────────────────────────────────
      manifest: {
        name: 'Kids Hero - Learn & Play',
        short_name: 'Kids Hero',
        description: 'Fun learning games for kids — Math, English, Hindi, GK and more!',
        start_url: '/',
        display: 'standalone',          // ← removes browser chrome (address bar etc.)
        orientation: 'portrait',
        background_color: '#0F172A',
        theme_color: '#0F172A',
        icons: [
          {
            src: '/logo.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
        categories: ['education', 'games', 'kids'],
        lang: 'en',
      },

      // ── Service Worker / Cache strategy ───────────────────────
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // Show the install prompt automatically
      devOptions: {
        enabled: true,         // also active in dev mode so you can test
        type: 'module',
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      }
    }
  }
})
