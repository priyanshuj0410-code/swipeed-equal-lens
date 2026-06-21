"use client";

import { useEffect } from "react";

/**
 * The PWA service worker is **disabled**.
 *
 * It was caching stale JS throughout the brand re-skin and serving old builds — most visibly serving a
 * pre-fix bundle on the production preview, so the realistic 3D world bled through the canvas world.
 * This unregisters any existing service worker and clears its caches on load; `public/sw.js` is itself a
 * kill-switch that self-unregisters. Re-introduce a real offline SW later if offline support is wanted.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
    if (typeof caches !== "undefined") {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
  }, []);

  return null;
}
