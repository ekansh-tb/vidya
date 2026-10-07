import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vidya: Family space",
  description: "Connect with your learner, manage their learning level and devices, and choose your family settings.",
  manifest: "/parent/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Vidya Family", statusBarStyle: "default" },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
