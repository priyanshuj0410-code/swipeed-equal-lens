import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwipeEd",
    short_name: "SwipeEd",
    description:
      "Swipe right on the green flags, left on the red ones — learn to spot healthy and unhealthy relationships.",
    start_url: "/path",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f6ef7",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
