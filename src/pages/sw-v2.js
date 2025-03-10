// src/sw-v2.js
// Import Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

// Cache images with CacheFirst
registerRoute(
  /\.(?:png|jpg|jpeg)$/,
  new CacheFirst({
    cacheName: 'pokemon-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 2592000, // 1 month
      }),
    ],
  }),
  'GET'
);

// Compare cached vs network, use cached if same, update if different
registerRoute(
  /^https:\/\/pokemmo\.help\/assets\/.*\.js$/,
  async ({ request }) => {
    const cache = await caches.open('js-files');
    const cachedResponse = await cache.match(request);
    const networkResponsePromise = fetch(request); // Start fetching network version

    // If no cached version exists, fetch from network and cache it
    if (!cachedResponse) {
      const networkResponse = await networkResponsePromise;
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }

    // Get network response
    const networkResponse = await networkResponsePromise;

    // If network fails, fall back to cache
    if (!networkResponse.ok) {
      return cachedResponse;
    }

    // Compare content of cached and network responses
    const cachedText = await cachedResponse.text();
    const networkText = await networkResponse.text();

    if (cachedText === networkText) {
      // Same content: use cached version
      return cachedResponse;
    } else {
      // Different content: use network version and update cache
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  },
  'GET'
);