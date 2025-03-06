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
          { src: "icons/logo192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/logo.png", sizes: "320x320", type: "image/png" },
          { src: "icons/logo512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ['**/index.html'], // Explicitly precache index.html
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg)$/, // Cache images on demand
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokemon-images',
              expiration: { maxAgeSeconds: 2592000 }, // 1 month
            }
          },
          {
            urlPattern: /^https:\/\/pokemmo\.help\/assets\/.*\.js$/, // JS with JSON
            handler: 'CacheFirst',
            options: {
              cacheName: 'json-data',
              expiration: { maxAgeSeconds: 604800 }, // 1 week
            },
          },
        ],
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