// src/sw-v2.js
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache files from Vite's build (injected by VitePWA)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches from previous service workers
cleanupOutdatedCaches();

// Cache images for 1 month
registerRoute(
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
  new CacheFirst({
    cacheName: 'pokemon-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 2592000, // 1 month
      }),
    ],
  })
);

// Cache JS/CSS for 1 week, update in background
registerRoute(
  /^https:\/\/pokemmo\.help\/assets\/.*\.(js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 604800, // 1 week
      }),
    ],
  })
);

// Listen for install event to force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate new service worker immediately
});

// Listen for activation to clear old asset caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name === 'assets') // Target only the 'assets' cache
          .map((name) => caches.delete(name))   // Delete old JS/CSS cache
      );
    }).then(() => {
      self.clients.claim(); // Take control of all clients immediately
    })
  );
});