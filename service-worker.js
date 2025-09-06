const CACHE_NAME = 'driver-app-cache-v1';
const PRECACHE_URLS = [
  '/driver-app/',
  '/driver-app/index.html',
  '/driver-app/manifest.json',
  '/driver-app/icon-192x192.png',
  '/driver-app/icon-512x512.png'
  // Add more assets if needed, like CSS/JS files
  // '/driver-app/styles.css',
  // '/driver-app/script.js',
];

// Install event: cache files for offline use
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate event: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Navigation requests (e.g. user typing URL, refreshing)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/driver-app/index.html'))
    );
    return;
  }

  // Other requests (icons, manifest, etc.)
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
