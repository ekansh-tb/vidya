"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * "You didn't open a screen. You walked into a room."
 *
 * Vidya's whole premise (VISION.md) is that a subject is a *place* — a
 * classroom with a door — not a tab. A cross-fade quietly contradicts that:
 * fades say "the content was swapped". Walking says "you moved".
 *
 * So arriving somewhere is staged as approach, not replacement:
 *
 *   · the new room starts *behind* the screen plane (translateZ) and comes
 *     forward to meet the child — the same optical cue as stepping through a
 *     doorway, which is why it reads as travel and not as a zoom;
 *   · two bright edges part outward and pass off-screen — the door frame
 *     going by on either side of you;
 *   · a warm wash of light spills in and fades — the light of the new room.
 *
 * The room you left recedes rather than disappearing, so the child keeps a
 * sense of where they came from and that Back is a real direction.
 *
 * Timing is 340ms in, 160ms out — at the fast end of the transition range,
 * because a child navigates a lot and this must never become a toll booth.
 */

// Doors are heavy: they start slowly, swing, and ease to a stop.
const DOOR_EASE = [0.65, 0, 0.35, 1] as const;
const ENTER_EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Enter-only wrapper. Safe to drop around any view: it never coordinates
 * unmounts, so it cannot interfere with view state. Change `roomKey` when
 * the child walks somewhere new.
 */
export function RoomEnter({
  roomKey,
  door = false,
  children,
}: {
  roomKey: string;
  /** True when this is a real room (a classroom, the library). False for tab-level moves. */
  door?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div style={reduce ? undefined : { perspective: 1400 }}>
      <motion.div
        key={roomKey}
        // Reduced motion: no approach, no rotation, no lateral sweep — a plain
        // fade. Nothing here may push a large surface across the visual field.
        initial={reduce ? { opacity: 0 } : { opacity: 0, z: -120, rotateX: 4, y: 10 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, z: 0, rotateX: 0, y: 0 }}
        transition={reduce ? { duration: 0.18 } : { duration: 0.34, ease: ENTER_EASE }}
        style={{ transformOrigin: "50% 40%" }}
      >
        {children}
      </motion.div>
      {door && !reduce && <DoorSweep key={`${roomKey}-door`} />}
    </div>
  );
}

/**
 * Full enter/exit version. Note this unmounts the outgoing view, so the
 * caller must be happy for that view's local state to be discarded.
 */
export function RoomTransition({
  roomKey,
  door = false,
  children,
}: {
  roomKey: string;
  door?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div style={reduce ? undefined : { perspective: 1400 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={roomKey}
          initial={reduce ? { opacity: 0 } : { opacity: 0, z: -120, rotateX: 4, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, z: 0, rotateX: 0, y: 0 }}
          // The room you leave falls away behind you rather than blinking out,
          // so Back always feels like a place you can walk to again.
          exit={reduce ? { opacity: 0 } : { opacity: 0, z: -70, transition: { duration: 0.16 } }}
          transition={reduce ? { duration: 0.18 } : { duration: 0.34, ease: ENTER_EASE }}
          style={{ transformOrigin: "50% 40%" }}
        >
          {children}
          {door && !reduce && <DoorSweep />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * The doorway itself, passing you. Two lit edges sweep out past the sides of
 * the screen while the light of the new room washes in and settles.
 *
 * Four fixed, pointer-transparent elements that remove themselves in under
 * half a second — no persistent overlay, nothing left animating.
 */
function DoorSweep() {
  return (
    <div aria-hidden className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      {[-1, 1].map((dir) => (
        <motion.span
          key={dir}
          className="absolute top-0 bottom-0"
          style={{
            width: 3,
            left: "50%",
            marginLeft: -1.5,
            background:
              "linear-gradient(180deg, transparent, var(--accent) 18%, var(--accent) 82%, transparent)",
            boxShadow: "0 0 26px var(--accent-glow)",
          }}
          initial={{ x: 0, opacity: 0, scaleY: 0.6 }}
          animate={{
            x: ["0vw", `${dir * 18}vw`, `${dir * 58}vw`],
            opacity: [0, 0.85, 0],
            scaleY: [0.6, 1, 1],
          }}
          transition={{ duration: 0.42, ease: DOOR_EASE, times: [0, 0.3, 1] }}
        />
      ))}

      {/* The light of the room you have just entered. Opacity only. */}
      <motion.span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, var(--accent-soft) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.46, ease: "easeOut", times: [0, 0.25, 1] }}
      />
    </div>
  );
}
