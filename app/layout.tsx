import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { clerkConfigured } from "@/lib/auth/clerk-config";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidya: explore, create, grow",
  description: "A learning and creation space with activities, stories, music and family support. Curriculum practice is available for supported placements.",
  applicationName: "Vidya",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/vidya-app.svg", type: "image/svg+xml" },
      { url: "/icons/vidya-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: "/icons/vidya-app.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/icons/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vidya",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f8fc",
  width: "device-width",
  initialScale: 1,
  // Zoom is deliberately NOT disabled. `maximumScale: 1` / `userScalable: false`
  // fails WCAG 2.1 SC 1.4.4 (Resize Text) and hurts exactly the learners who
  // need it most — anyone with low vision, and any kid squinting at Devanagari
  // or a maths expression on a small phone. The double-tap-zoom annoyance this
  // was presumably guarding against is not worth locking them out.
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="playful" data-appearance="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout shares this font link across all pages. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ServiceWorkerRegistration />
        {/* Without keys, mounting ClerkProvider would fail the whole tree. The
            kid app needs no auth, so render it plain; middleware.ts closes the
            parent area in the same condition. */}
        {!clerkConfigured ? children : (
        <ClerkProvider appearance={clerkAppearance}>
          {children}
        </ClerkProvider>
        )}
      </body>
    </html>
  );
}
