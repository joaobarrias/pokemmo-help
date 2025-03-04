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
      registerType: 'autoUpdate',
      filename: 'sw-v2.js', // Service worker file
      includeAssets: [], // No precached assets
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
        globPatterns: ['**/*.{js,css,html}'],
        globIgnores: ['**/*.{png,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokemon-images',
              expiration: { maxAgeSeconds: 31536000, maxEntries: 1000 },
            },
          },
        ],
      },
      // Inline custom registration to unregister old SW and register new
      injectRegister: 'inline',
    }),
  ],
  build: { sourcemap: true },
  server: {
    hmr: { clientPort: 5173, protocol: 'ws' },
  },
});