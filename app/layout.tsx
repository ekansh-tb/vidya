import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/auth/clerk-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidya — your personal school",
  description: "A digital school for any learner — Cambridge Primary, Cambridge IGCSE, ICSE, CBSE. Curriculum-anchored quests, AI tutor, exam prep.",
  applicationName: "Vidya",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vidya",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080F",
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
    <html lang="en" data-theme="playful" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {/* Without keys, mounting ClerkProvider would fail the whole tree. The
            kid app needs no auth, so render it plain; middleware.ts closes the
            parent area in the same condition. */}
        {!clerkConfigured ? children : (
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#A78BFA",
              colorBackground: "#06080F",
              colorText: "#F5F5F7",
              colorTextSecondary: "rgba(255,255,255,0.6)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "#F5F5F7",
              borderRadius: "0.75rem",
            },
          }}
        >
          {children}
        </ClerkProvider>
        )}
      </body>
    </html>
  );
}
