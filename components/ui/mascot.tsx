"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AVATAR_MAP } from "@/lib/content/avatars";

const sizes = {
  sm: "w-12 h-12 text-3xl",
  md: "w-20 h-20 text-5xl",
  lg: "w-32 h-32 text-7xl",
  xl: "w-48 h-48 text-9xl",
};

export function Mascot({
  avatarId, customAvatar, size = "md", mood = "happy", glow = true,
}: {
  avatarId: string;
  customAvatar?: string | null;
  size?: keyof typeof sizes;
  mood?: "happy" | "celebrate" | "thinking" | "sad";
  glow?: boolean;
}) {
  const avatar = AVATAR_MAP[avatarId] || AVATAR_MAP.peacock;
  const reduced = useReducedMotion();
  return (
    // The mascot bobs forever, and at xl it is a 192px block. An infinite
    // animation is the clearest case for stopping outright rather than
    // shortening — the mascot reads fine standing still.
    <motion.div
      animate={reduced ? { y: 0 } : { y: [0, -6, 0] }}
      transition={reduced ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full glass-strong overflow-hidden",
        glow && "shadow-2xl shadow-fuchsia-500/20",
        sizes[size],
      )}
    >
      {glow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-cyan-500/30 blur-xl -z-10" />
      )}
      {customAvatar ? (
        <motion.img
          src={customAvatar}
          alt=""
          animate={mood === "celebrate" && !reduced ? { rotate: [-6, 6, -6, 0] } : { rotate: 0 }}
          transition={mood === "celebrate" && !reduced ? { duration: 0.6 } : {}}
          className="w-full h-full object-cover rounded-full"
          draggable={false}
        />
      ) : (
        <motion.span
          animate={mood === "celebrate" && !reduced ? { rotate: [-6, 6, -6, 0] } : { rotate: 0 }}
          transition={mood === "celebrate" && !reduced ? { duration: 0.6 } : {}}
        >
          {avatar.emoji}
        </motion.span>
      )}
    </motion.div>
  );
}
