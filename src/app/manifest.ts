import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwipeEd by The Equal Lens",
    short_name: "SwipeEd",
    description:
      "SwipeEd by The Equal Lens — unlearn bias and relearn empathy through play, across warm no-fail games for ages 3–18.",
    start_url: "/path",
    display: "standalone",
    background_color: "#fbf9ff",
    theme_color: "#553286",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
