// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw-v2.js',
      workbox: {
        globPatterns: ['**/*.{html,js,css}'],
        globDirectory: 'dist',
        navigateFallback: '/index.html',
      },
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
    }),
  ],
});