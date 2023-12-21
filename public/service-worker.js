const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/assets/section1_illustration.svg',
];

// Install event - caches critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - cache images dynamically
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request).then(response => {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  // ... activation code to clean old caches
});

