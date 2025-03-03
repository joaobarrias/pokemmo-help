// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    {
      // Disable CSP in dev for easier debugging
      name: 'disable-csp-for-dev',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.removeHeader('Content-Security-Policy');
          next();
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate', // Auto-update service worker
      includeAssets: ['/**/*.png', '**/*.jpg'], // Include PNG and JPG in build
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
        // Precache compiled JS (from TSX), CSS, and HTML
        globPatterns: ['**/*.{js,css,html}'],
        // Runtime caching for requested images
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg)$/, // Match PNG and JPG files
            handler: 'CacheFirst', // Cache images when requested
            options: {
              cacheName: 'pokemon-images', // Separate cache for images
              expiration: {
                maxAgeSeconds: 31536000, // Cache for 1 year
                maxEntries: 1000, // Cap at 1,000 images
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true, // Generate source maps
  },
  server: {
    hmr: {
      clientPort: 5173, // HMR port for dev
      protocol: 'ws',
    },
  },
});