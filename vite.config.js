import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const repoName = 'ShelfSpace'

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'project_hail_mary.jpg'],
      manifest: {
        name: 'ShelfSpace',
        short_name: 'ShelfSpace',
        description: 'Your personal digital library',
        theme_color: '#c9956a',
        background_color: '#fafaf9',
        display: 'standalone',
        scope: `/${repoName}/`,
        start_url: `/${repoName}/`,
        icons: [
          { src: `/${repoName}/pwa-192.png`,  sizes: '192x192', type: 'image/png' },
          { src: `/${repoName}/pwa-512.png`,  sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Cache all static assets + pages
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'],
        // Don't cache Open Library API calls
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/covers\.openlibrary\.org\//,
            handler: 'CacheFirst',
            options: { cacheName: 'openlibrary-covers', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          {
            urlPattern: /^https:\/\/openlibrary\.org\/search/,
            handler: 'NetworkFirst',
            options: { cacheName: 'openlibrary-search', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'unsplash-images', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
