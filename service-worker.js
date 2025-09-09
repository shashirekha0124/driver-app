const CACHE_NAME = 'swm-app-cache-v1';
const PRECACHE_URLS = [
  '/',
 './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
  // Add other assets, such as images/icons
  // '/images/logo.png',
  // '/offline.html',
];

// Install event: cache key files for offline mode
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// Intercept network requests
self.addEventListener('fetch', event => {
  // For navigation requests, show offline page if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }
  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});


