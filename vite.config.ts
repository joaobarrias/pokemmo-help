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
      filename: 'sw-v3.js',
      includeAssets: [],
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
        globPatterns: ['**/*.{js,css,html}'], // Precache only JS/CSS/HTML
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg)$/, // Cache images on demand
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokemon-images',
              expiration: { maxAgeSeconds: 31536000 }, // 1 year
            },
          },
        ],
      },
      injectRegister: 'inline', // Inline registration
    }),
  ],
  build: { sourcemap: true },
  server: {
    hmr: { clientPort: 5173, protocol: 'ws' },
  },
});