const CACHE_NAME = "rateddocs-cache-v2";
const OFFLINE_URL = "/offline";

// Assets to cache immediately on installation (precaching)
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/logos/mainlogo.png",
];

// Install event - precache offline page and key assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Precaching offline fallback page and key assets");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - caching strategies
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Exclude non-http(s), API calls, Next.js HMR/webpack, and protected portal routes
  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/dentist") ||
    url.pathname.startsWith("/patient") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.includes("/_next/webpack-hmr") ||
    url.pathname.includes("webpack")
  ) {
    return;
  }

  // Strategy for HTML documents (pages): Network-First falling back to Cache, then Offline Page
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful 200 OK basic responses
          if (response && response.status === 200 && response.type === "basic") {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fall back to offline page if available
            return caches.match(OFFLINE_URL).then((offlineRes) => {
              return offlineRes || new Response("Offline", { status: 503, statusText: "Offline" });
            });
          });
        })
    );
    return;
  }

  // Strategy for static assets (JS, CSS, Fonts, Images): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return networkResponse;
      });

      if (cachedResponse) {
        // Background update, catch errors silently
        fetchPromise.catch(() => {});
        return cachedResponse;
      }

      // If not in cache, return fetchPromise directly to avoid returning undefined
      return fetchPromise;
    })
  );
});
