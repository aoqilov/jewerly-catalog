import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { APP, THEME_COLORS } from './src/config/app.ts'

const DAY = 24 * 60 * 60

// index.html'dagi %APP_NAME% / %APP_DESCRIPTION% config/app.ts'dan olinadi
function appMetaPlugin(): Plugin {
  return {
    name: 'app-meta',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%APP_NAME%', APP.name)
        .replaceAll('%APP_SHORT_NAME%', APP.shortName)
        .replaceAll('%APP_DESCRIPTION%', APP.description)
        .replaceAll('%THEME_COLOR_LIGHT%', THEME_COLORS.light)
        .replaceAll('%THEME_COLOR_DARK%', THEME_COLORS.dark),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    appMetaPlugin(),
    // Ikonkalar public/'da: npm run pwa:icons yasaydi. Service worker faqat build'da (dev'da kesh xalaqit bermasin)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-64x64.png', 'apple-touch-icon-180x180.png'],
      manifest: {
        id: '/',
        name: APP.name,
        short_name: APP.shortName,
        description: APP.description,
        lang: 'uz',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: THEME_COLORS.light,
        background_color: THEME_COLORS.light,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // API keshlanmaydi: ro'yxatlar POST bilan olinadi va ma'lumot doim yangi bo'lishi kerak
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
