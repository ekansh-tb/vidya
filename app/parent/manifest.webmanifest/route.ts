/** Public installation metadata only. No learner or parent records belong here. */
export function GET() {
  return Response.json({
    id: "/parent",
    name: "Vidya: Family space",
    short_name: "Vidya Family",
    description: "A familiar place to connect with your learner.",
    start_url: "/parent",
    scope: "/",
    display: "standalone",
    background_color: "#f3f7fc",
    theme_color: "#006c67",
    lang: "en",
    icons: [
      { src: "/icons/vidya-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/vidya-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/vidya-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  }, { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } });
}
