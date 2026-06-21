// SwipeEd service worker — minimal offline shell for the PWA.
// Cache name is bumped on each shell change so `activate` purges the previous cache.
const CACHE = "el-v1";
const PRECACHE = ["/", "/decks", "/flagpedia", "/settings", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Network-first for page navigations, fall back to cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/")));
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // App code/build assets: network-first. Dev chunk URLs are stable, so cache-first would pin stale JS
  // and silently hide new code; network-first keeps the running code fresh online, cache is offline fallback.
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for the rest of the same-origin static assets (icons, brand SVGs, manifest).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
