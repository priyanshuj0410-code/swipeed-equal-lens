import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwipeEd — Active micro-learning",
    short_name: "SwipeEd",
    description:
      "Active micro-learning, one swipe at a time. The first game on the Praxis engine.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
