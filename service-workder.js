// Define the cache name and the files to be cached.
const CACHE_NAME = 'uptime-pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  'SubmitOrder.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://placehold.co/180x180/3182CE/FFFFFF?text=UT'
];

/**
 * Installation event: This is triggered when the service worker is first installed.
 * It opens a cache and adds the core application files to it.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache files during install:', err);
      })
  );
});

/**
 * Activate event: This is triggered after installation.
 * It's used to clean up any old caches that are no longer needed.
 */
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: This is triggered for every network request made by the page.
 * It follows a "cache-first" strategy:
 * 1. Try to find the request in the cache.
 * 2. If it's found, return the cached response.
 * 3. If it's not found, fetch it from the network.
 */
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If a cached response is found, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch the request from the network.
        return fetch(event.request);
      })
  );
});
