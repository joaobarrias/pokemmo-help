// src/sw-v2.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache only what Vite builds (e.g., index.html)
precacheAndRoute(self.__WB_MANIFEST || []);

// Images: 1 month
registerRoute(
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 2592000 })],
  })
);

// JS/CSS: 1 week
registerRoute(
  /\.(js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 604800 })],
  })
);

// Activate immediately and clear old caches
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.delete('assets').then(() => self.clients.claim())
  );
});