import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// 🔑 LEARNING: Vite config is the build pipeline definition.
// Plugins transform your source code during development and production builds.
// The order matters — react() handles JSX, VitePWA() generates the service worker.

export default defineConfig({
  plugins: [
    // 💡 CONCEPT: @vitejs/plugin-react — Provides Fast Refresh (HMR) in dev,
    // and automatic JSX runtime in production (no need to import React).
    react(),

    // 🔑 LEARNING: vite-plugin-pwa — Automatically generates a service worker
    // using Workbox. Service workers intercept network requests and can serve
    // cached responses when offline. This is what makes a PWA work offline.
    VitePWA({
      // registerType: 'autoUpdate' — When a update is found, the new SW activates
      // immediately instead of waiting for all tabs to close. Good for timers.
      registerType: 'autoUpdate',

      // 💡 CONCEPT: workbox configuration — Workbox is Google's library for
      // common caching patterns. runtimeCaching lets us define how different
      // URL patterns should be cached.
      workbox: {
        // globPatterns: which files to pre-cache during build (cache-first).
        // These are bundled into the SW and available offline immediately.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets — staleWhileRevalidate means
            // serve from cache if available, but also fetch update in background.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Cache font files — CacheFirst because fonts rarely change.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },

      // manifest: PWA metadata — This is what the browser uses to show the
      // install prompt and app icon on the home screen.
      // 🔑 LEARNING: Icon paths must exist on disk. Chrome on Android will
      // silently fail "Add to Home Screen" if any icon URL 404s.
      manifest: {
        name: 'DoneRight — Cooking Timer',
        short_name: 'DoneRight',
        description: 'Cooking doneness timer PWA',
        theme_color: '#1a2f38',
        background_color: '#1a2f38',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
});
