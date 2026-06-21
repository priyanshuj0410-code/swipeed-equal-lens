"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker once the page has loaded — **production only**.
 *
 * In development the SW is a liability: Next's dev chunk URLs are stable, so a previously-installed
 * cache-first SW pins stale JS and silently hides new code. So in dev we instead **unregister** any
 * existing SW and clear its caches, guaranteeing the app always runs the freshest build.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .catch(() => {});
      if (typeof caches !== "undefined") {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
      }
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration is best-effort; ignore failures */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
