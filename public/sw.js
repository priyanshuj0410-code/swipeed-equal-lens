// Kill-switch service worker.
// The PWA offline shell was caching stale JS during the brand re-skin and serving old builds (the
// realistic 3D world bleeding through the canvas). This neutralises it: any previously-installed SW
// updates to this script, which on activate clears ALL caches, unregisters itself, and reloads every
// controlled page so it reloads fresh from the network with no SW in the way. (Re-introduce a real
// offline SW later if wanted.)
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })()
  );
});
