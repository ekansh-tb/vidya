"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A celebration that has to be *earned*.
 *
 * The child reads three beats, in this order:
 *
 *   1. ANTICIPATION (0–14%)  — everything pulls inward and gets smaller.
 *      This is the held breath. It tells the kid "something is coming",
 *      which is what makes the release land instead of just appearing.
 *   2. RELEASE (14–40%)      — the core punches past its target size and the
 *      shards fire outward on arcs. This is the payoff: the moment that says
 *      "you did that."
 *   3. SETTLE (40–100%)      — the core undershoots then rests, the shards
 *      decelerate and fall slightly under gravity, the bloom fades.
 *      Settling is what separates a reward from a screensaver: the screen
 *      goes calm again and hands attention back to the kid.
 *
 * Everything is `transform` + `opacity` only, and the whole thing is over in
 * ≤ 760ms so it never becomes something to wait through.
 */

export type CelebrateVariant = "correct" | "levelup" | "badge";

const SPEC: Record<
  CelebrateVariant,
  { duration: number; shards: number; radius: number; core: number; ring: number }
> = {
  // Fires many times per quest — small, quick, gets out of the way.
  correct: { duration: 0.52, shards: 8, radius: 76, core: 44, ring: 88 },
  // Rare and structural — the biggest moment the app has.
  levelup: { duration: 0.76, shards: 16, radius: 132, core: 76, ring: 150 },
  // Rare, collectible — punchy but a touch calmer than a level-up.
  badge: { duration: 0.68, shards: 12, radius: 108, core: 64, ring: 124 },
};

/**
 * Deterministic shard geometry. Kept out of `Math.random` so server and
 * client render the same markup and so the burst reads the same every time —
 * a reward the child recognises is a stronger reward than a novel one.
 */
const JITTER = [0.86, 1.12, 0.94, 1.2, 0.78, 1.06, 1.16, 0.9, 1.04, 0.82, 1.18, 0.96, 1.1, 0.88, 1.14, 0.92];

/** Theme tokens, so the burst is on-palette in playful / vivid / terminal alike. */
const SHARD_COLOURS = ["var(--accent)", "var(--accent-2)", "var(--success)", "var(--warning)"];

export function CelebrationBurst({
  show,
  variant = "correct",
  origin,
  label,
  onDone,
}: {
  show: boolean;
  variant?: CelebrateVariant;
  /** Viewport-relative point to burst from, e.g. the button the kid just tapped. Defaults to screen centre. */
  origin?: { x: number; y: number };
  /** Optional text announced to screen readers — the celebration itself is decorative. */
  label?: string;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const spec = SPEC[variant];

  // Hand control back to the caller once the beat is genuinely over, so a
  // parent can chain (burst → score tick → next question) without guessing.
  useEffect(() => {
    if (!show || !onDone) return;
    const ms = (reduce ? 0.36 : spec.duration) * 1000 + 60;
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [show, onDone, reduce, spec.duration]);

  const pos = origin
    ? { left: origin.x, top: origin.y }
    : { left: "50%", top: "45%" };

  return (
    <>
      {label && (
        <div className="sr-only" aria-live="polite">
          {show ? label : ""}
        </div>
      )}
      <AnimatePresence>
        {show && (
          <div
            key="celebrate"
            aria-hidden
            className="fixed z-[95] pointer-events-none"
            style={{ ...pos, transform: "translate(-50%, -50%)" }}
          >
            {reduce ? (
              <ReducedBloom spec={spec} />
            ) : (
              <>
                <Ring spec={spec} />
                <Bloom spec={spec} />
                <Core spec={spec} variant={variant} />
                <Shards spec={spec} />
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

type Spec = (typeof SPEC)[CelebrateVariant];

/**
 * The ring is the anticipation made visible: it tightens *inward* before it
 * blows outward, which is the visual equivalent of a wind-up.
 */
function Ring({ spec }: { spec: Spec }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: spec.ring,
        height: spec.ring,
        left: "50%",
        top: "50%",
        marginLeft: -spec.ring / 2,
        marginTop: -spec.ring / 2,
        border: "2px solid var(--accent)",
        boxShadow: "0 0 24px var(--accent-glow)",
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.5, 0.34, 1.05, 1.85], opacity: [0, 0.95, 0.7, 0] }}
      exit={{ opacity: 0 }}
      transition={{
        duration: spec.duration,
        times: [0, 0.14, 0.42, 1],
        ease: ["easeIn", "easeOut", "easeOut"],
      }}
    />
  );
}

/** Secondary action: a warm bloom that swells behind the core so the burst feels lit, not drawn. */
function Bloom({ spec }: { spec: Spec }) {
  const size = spec.ring * 1.6;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background:
          "radial-gradient(circle, var(--accent-soft) 0%, var(--accent-soft) 30%, transparent 68%)",
      }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: [0.4, 0.3, 1.15, 1.3], opacity: [0, 0.5, 0.85, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: spec.duration, times: [0, 0.14, 0.5, 1], ease: "easeOut" }}
    />
  );
}

/**
 * The core carries the whole three-beat shape on its own: squash down (0.86),
 * punch past the target (1.18), undershoot (0.97), rest. Even if a device
 * drops the shards, this alone still reads as anticipation → release → settle.
 */
function Core({ spec, variant }: { spec: Spec; variant: CelebrateVariant }) {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full"
      style={{
        width: spec.core,
        height: spec.core,
        left: "50%",
        top: "50%",
        marginLeft: -spec.core / 2,
        marginTop: -spec.core / 2,
        background: "radial-gradient(circle at 35% 30%, #fff 0%, var(--accent) 55%, var(--accent-2) 100%)",
        boxShadow: "0 0 32px var(--accent-glow)",
      }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{
        scale: [0.6, 0.86, 1.18, 0.97, 1],
        opacity: [0, 1, 1, 1, 1],
        rotate: [-8, -12, 4, 0, 0],
      }}
      exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.16 } }}
      transition={{
        duration: spec.duration,
        times: [0, 0.14, 0.36, 0.62, 1],
        ease: ["easeIn", "easeOut", "easeOut", "easeOut"],
      }}
    >
      <Glyph variant={variant} size={spec.core * 0.5} />
    </motion.div>
  );
}

function Glyph({ variant, size }: { variant: CelebrateVariant; size: number }) {
  if (variant === "correct") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* The tick draws itself rather than popping in — a small "it is being
            checked, now" beat that lands right after the core punches. */}
        <motion.path
          d="M5 12.5 L10 17.5 L19 7"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2, delay: 0.16, ease: "easeOut" }}
        />
      </svg>
    );
  }
  if (variant === "levelup") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M12 4 L12 20 M12 4 L6 10 M12 4 L18 10"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.24, delay: 0.18, ease: "easeOut" }}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <motion.path
        d="M12 2.6 L14.9 9 L21.6 9.7 L16.6 14.2 L18 20.8 L12 17.4 L6 20.8 L7.4 14.2 L2.4 9.7 L9.1 9 Z"
        initial={{ scale: 0, originX: "12px", originY: "12px" }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 460, damping: 12, delay: 0.16 }}
      />
    </svg>
  );
}

/**
 * Shards travel on *arcs*, not straight lines — they rise, slow, and fall a
 * little. Straight radial lines read as a UI effect; arcs read as physical
 * things that were thrown, which is what makes this feel like an object in
 * the room rather than a decoration on the glass.
 */
function Shards({ spec }: { spec: Spec }) {
  const pieces = Array.from({ length: spec.shards }, (_, i) => i);
  return (
    <>
      {pieces.map((i) => {
        const angle = (i / spec.shards) * Math.PI * 2;
        const jitter = JITTER[i % JITTER.length];
        const dist = spec.radius * jitter;
        const dx = Math.cos(angle) * dist;
        const rise = Math.sin(angle) * dist;
        const round = i % 3 === 0;
        const w = round ? 7 : 5;
        const h = round ? 7 : 11;
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: w,
              height: h,
              marginLeft: -w / 2,
              marginTop: -h / 2,
              borderRadius: round ? "50%" : 2,
              background: SHARD_COLOURS[i % SHARD_COLOURS.length],
            }}
            initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
            animate={{
              // Arc: out along x, up past the target on y, then eased back down.
              x: [0, dx * 0.7, dx],
              y: [0, rise * 0.75 - dist * 0.22, rise + dist * 0.16],
              scale: [0.3, 1, 0.65],
              rotate: [0, jitter * 140],
              opacity: [0, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: spec.duration * 0.78,
              // Fires only after the anticipation beat has finished.
              delay: spec.duration * 0.16 + (i % 4) * 0.018,
              times: [0, 0.45, 1],
              ease: ["easeOut", "easeIn"],
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Reduced motion: no travel, no scaling, no spin — a still warm bloom that
 * fades up and away. The child still gets an unmistakable "yes, that counted"
 * without anything that can trigger nausea or overwhelm.
 */
function ReducedBloom({ spec }: { spec: Spec }) {
  const size = spec.ring * 1.4;
  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background:
          "radial-gradient(circle, var(--accent-soft) 0%, var(--accent-soft) 38%, transparent 70%)",
        border: "2px solid var(--accent)",
        borderRadius: "50%",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.36, times: [0, 0.25, 0.7, 1], ease: "linear" }}
    />
  );
}
