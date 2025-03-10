import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js', // Register service worker as sw.js
      includeAssets: ['index.html', 'assets/**/*'], // Cache the HTML and assets
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
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg}'], // Cache HTML, JS, CSS, and images
        runtimeCaching: [
          {
            urlPattern: /\.js$/, // Cache JS files on demand
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-cache',
              expiration: { maxAgeSeconds: 0 }, // Don't keep in cache after changes
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/, // Cache images
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxAgeSeconds: 2592000 }, // Cache for 30 days
            },
          },
        ],
        navigateFallback: '/index.html', // Handle SPA routing
      },
      injectRegister: 'inline', // Inline service worker registration
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    hmr: {
      clientPort: 5173,
      protocol: 'ws',
    },
  },
});
