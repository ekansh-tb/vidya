import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Vidya: Your Personal School",
    short_name: "Vidya",
    description:
      "A welcoming digital school with curriculum learning, books, field trips, revision, and wellbeing activities.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#06080F",
    theme_color: "#7C3AED",
    orientation: "any",
    lang: "en",
    categories: ["education", "kids"],
    icons: [
      {
        src: "/icons/vidya-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/vidya-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/vidya-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/vidya-app.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/vidya-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
