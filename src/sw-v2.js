// src/sw-v2.js
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { NavigationRoute, createHandlerBoundToURL } from 'workbox-routing';

// Precache files from the manifest (includes index.html if in __WB_MANIFEST)
precacheAndRoute(self.__WB_MANIFEST || []); // Fallback to empty array if manifest is missing
cleanupOutdatedCaches();

// Cache images for 1 month
registerRoute(
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
  new CacheFirst({
    cacheName: 'pokemon-images',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 2592000 })],
  })
);

// Cache JS/CSS for 1 week
registerRoute(
  /^https:\/\/pokemmo\.help\/assets\/.*\.(js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 604800 })],
  })
);

// Handle navigation requests (SPA fallback)
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    allowlist: [/^\/.*/], // Match all navigation requests
    denylist: [/\.(?:png|jpg|jpeg|gif|webp|svg|ico|js|css)$/], // Exclude asset requests
  })
);

// Install: Activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: Clear old asset caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name === 'assets')
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});