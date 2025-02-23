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
        server.middlewares.use((req, res, next) => {
          res.removeHeader('Content-Security-Policy');
          next();
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/**/*.png', '**/*.svg'],
      manifest: {
        name: 'PokeMMO Help',
        short_name: 'PokeMMO Help',
        start_url: '/',
        display: 'standalone',
        background_color: '#2c2f38',
        theme_color: '#23262f',
        icons: [
          {
            src: "icons/logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/logo.png",
            sizes: "320x320",
            type: "image/png",
          },
          {
            src: "icons/logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
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