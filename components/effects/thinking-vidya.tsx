"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * "Miss Vidya is thinking" — a waiting state with a person behind it.
 *
 * A spinner tells a child *the machine is busy*. That is the wrong message
 * here: the app's whole premise is that a teacher is on the other side. So
 * instead of a rotating arc, this shows someone considering the question —
 * a lamp that breathes, a head that tilts, and thoughts that rise and
 * dissolve one at a time.
 *
 * The rhythm is deliberately unhurried (~1.6s cycle). Fast, tight loops read
 * as "hurry up"; a slow loop reads as "she's actually thinking about what you
 * asked", which makes the same wait feel shorter and less anxious.
 *
 * Six animated elements, all `transform`/`opacity`, all Framer-driven — no
 * rAF loop of our own, and unmounting stops everything.
 */
export function ThinkingVidya({
  label = "Miss Vidya is thinking…",
  size = 34,
}: {
  label?: string;
  /** Diameter of the lamp glyph in px. */
  size?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className="inline-flex items-center gap-3"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative flex-shrink-0" style={{ width: size, height: size }} aria-hidden>
        {/* Thought motes: they rise on a slight arc and dissolve, rather than
            blinking in place. Things that drift upward and fade read as ideas
            forming; things that blink read as a progress bar. */}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                left: size * 0.5 - 2 + (i - 1) * 4,
                top: size * 0.18,
                background: "var(--accent)",
                boxShadow: "0 0 6px var(--accent-glow)",
              }}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.95, 0],
                y: [0, -9, -17],
                x: [0, (i - 1) * 3.5, (i - 1) * 6],
                scale: [0.5, 1, 0.45],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.22,
                ease: "easeOut",
                times: [0, 0.45, 1],
              }}
            />
          ))}

        {/* The lamp itself, tilting like a head considering a question.
            The tilt is the single clearest signal that there is a *someone*
            here and not a process. */}
        <motion.div
          className="absolute left-1/2 rounded-full"
          style={{
            width: size * 0.56,
            height: size * 0.56,
            bottom: 0,
            marginLeft: -(size * 0.28),
            background:
              "radial-gradient(circle at 34% 30%, #FFFAEB 0%, var(--accent) 52%, var(--accent-2) 100%)",
            transformOrigin: "50% 100%",
          }}
          animate={reduce ? {} : { rotate: [-6, 6, -6] }}
          transition={reduce ? {} : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Breathing halo — the "she is present and listening" heartbeat.
            Opacity only, so it costs nothing and never moves anything. */}
        <motion.div
          className="absolute left-1/2 rounded-full pointer-events-none"
          style={{
            width: size,
            height: size,
            bottom: -size * 0.22,
            marginLeft: -(size * 0.5),
            background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 68%)",
          }}
          animate={reduce ? { opacity: 0.7 } : { opacity: [0.45, 0.95, 0.45] }}
          transition={reduce ? {} : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        {label.replace(/…$/, "")}
        {/* The dots carry the waiting, so the sentence itself can hold still
            and stay readable — motion on text is hard for slower readers. */}
        <span aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block"
              animate={reduce ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25], y: [0, -1.5, 0] }}
              transition={
                reduce ? {} : { duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
              }
            >
              .
            </motion.span>
          ))}
        </span>
      </div>
    </div>
  );
}
