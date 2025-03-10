// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'disable-csp-for-dev',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.removeHeader('Content-Security-Policy');
          next();
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw-v2.js',
      includeAssets: ['index.html'], // Precache index.html
      manifest: {
        name: 'PokeMMO Help',
        short_name: 'PokeMMO Help',
        start_url: '/',
        display: 'standalone',
        background_color: '#2c2f38',
        theme_color: '#23262f',
        icons: [
          { src: 'icons/logo192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/logo.png', sizes: '320x320', type: 'image/png' },
          { src: 'icons/logo512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/index.html'], // Precache index.html
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/, // Cache images on demand
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokemon-images',
              expiration: { maxAgeSeconds: 2592000 }, // Cache images for 1 month
            },
          },
          {
            urlPattern: /^https:\/\/pokemmo\.help\/assets\/.*\.(js|css)$/, // JS and CSS files
            handler: 'StaleWhileRevalidate', // Serve cached, update in background
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 50, maxAgeSeconds: 604800}, // Limit cache size and cache JS/CSS for 1 week
            },
          },
        ],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html', // Handle SPA routing
      },
      injectRegister: 'inline',
    }),
  ],
  build: { sourcemap: true },
  server: {
    hmr: { clientPort: 5173, protocol: 'ws' },
  },
});