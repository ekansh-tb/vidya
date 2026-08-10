"use client";

import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Physical presence for the classroom doors in the lobby.
 *
 * The point is not "a 3D effect". The point is that a classroom card should
 * feel like a *slab you can push*, so opening one feels like opening a door
 * rather than tapping a rectangle. Depth is what tells a child the thing is
 * real, and real things are worth walking into.
 *
 * Two deliberately different input stories:
 *
 *  · Pointer (mouse/trackpad): the card follows the cursor, tilting a few
 *    degrees and lifting its contents forward. Continuous, because a mouse
 *    hovers without committing to anything.
 *  · Touch: a finger is already a commitment, and tracking a finger across a
 *    card makes the card feel loose and slippery. So touch gets a *press*
 *    instead — the card takes the weight, tips slightly toward where it was
 *    pressed, and springs back on release. One short spring rather than a
 *    continuous tracking loop, which also keeps mid-range Android cool.
 *
 * Everything is `transform`/`opacity`. Springs run on Framer Motion's own
 * scheduler, so there is no bespoke rAF loop: unmounting disposes the motion
 * values and all animation with them.
 */

const TILT_POINTER = 9; // degrees at the card's edge
const TILT_TOUCH = 5; // gentler — a finger sits closer to what it is touching
const LIFT_PX = 18; // how far contents float above the card face

export type TiltHandlers = {
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onBlur: () => void;
};

export type Tilt = {
  ref: React.RefObject<HTMLDivElement | null>;
  handlers: TiltHandlers;
  /** Goes on the outer element: establishes the 3D scene. */
  sceneStyle: React.CSSProperties;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  /** Contents float forward by this many px, parting company with the card face. */
  lift: MotionValue<number>;
  /** Specular sheen tracks the tilt — what sells the surface as glossy. */
  sheen: MotionValue<string>;
  sheenOpacity: MotionValue<number>;
  /** True when tilt is suppressed (reduced motion, or explicitly disabled). */
  disabled: boolean;
};

export function useTilt({ disabled = false }: { disabled?: boolean } = {}): Tilt {
  const reduce = useReducedMotion();
  // Vestibular safety: this rotates a large surface under the eye. Reduced
  // motion switches it off entirely rather than merely softening it.
  const off = reduce === true || disabled;

  const ref = useRef<HTMLDivElement | null>(null);
  const nx = useMotionValue(0); // -1 … 1, horizontal position within the card
  const ny = useMotionValue(0); // -1 … 1, vertical
  const pressed = useMotionValue(0); // 0 … 1

  // Slightly under-damped so the card *settles* rather than snapping.
  // Follow-through is what makes it read as having mass.
  const sx = useSpring(nx, { stiffness: 240, damping: 22, mass: 0.7 });
  const sy = useSpring(ny, { stiffness: 240, damping: 22, mass: 0.7 });
  const sp = useSpring(pressed, { stiffness: 420, damping: 28, mass: 0.5 });

  const rotateY = useTransform(sx, (v) => v * TILT_POINTER);
  const rotateX = useTransform(sy, (v) => -v * TILT_POINTER);
  const scale = useTransform(sp, (v) => 1 - v * 0.028);
  const lift = useTransform(sp, (v) => LIFT_PX * (0.35 + v * 0.65));
  const sheenOpacity = useTransform<number, number>([sx, sy, sp], ([x, y, p]) =>
    Math.min(0.5, Math.abs(x) * 0.28 + Math.abs(y) * 0.16 + p * 0.2),
  );
  const sheen = useTransform(
    sx,
    (v) =>
      `radial-gradient(ellipse 60% 90% at ${50 + v * 38}% 0%, rgba(255,255,255,0.22), transparent 62%)`,
  );

  const track = useCallback(
    (clientX: number, clientY: number, gain: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const x = ((clientX - r.left) / r.width) * 2 - 1;
      const y = ((clientY - r.top) / r.height) * 2 - 1;
      nx.set(clamp(x) * gain);
      ny.set(clamp(y) * gain);
    },
    [nx, ny],
  );

  const rest = useCallback(() => {
    nx.set(0);
    ny.set(0);
    pressed.set(0);
  }, [nx, ny, pressed]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (off) return;
      // Only a hovering pointer gets continuous tracking. A finger that is
      // moving is almost always trying to scroll, not to tilt.
      if (e.pointerType !== "mouse") return;
      track(e.clientX, e.clientY, 1);
    },
    [off, track],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (off) return;
      pressed.set(1);
      if (e.pointerType !== "mouse") {
        track(e.clientX, e.clientY, TILT_TOUCH / TILT_POINTER);
      }
    },
    [off, pressed, track],
  );

  const onPointerUp = useCallback(() => {
    if (off) return;
    pressed.set(0);
    // Touch has no hover state to fall back to, so the card returns flat.
    nx.set(0);
    ny.set(0);
  }, [off, pressed, nx, ny]);

  return {
    ref,
    handlers: {
      onPointerMove,
      onPointerDown,
      onPointerUp,
      // pointercancel fires the moment the browser claims the gesture for
      // scrolling — exactly when the card should let go.
      onPointerCancel: rest,
      onPointerLeave: rest,
      onBlur: rest,
    },
    sceneStyle: off ? {} : { perspective: 900 },
    rotateX,
    rotateY,
    scale,
    lift,
    sheen,
    sheenOpacity,
    disabled: off,
  };
}

function clamp(v: number) {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}

/**
 * Drop-in tilting card, rendered as a `<button>` because in the lobby every
 * one of these is a door the child opens. Use `TiltPanel` for depth on
 * something that is not tappable.
 */
export function TiltCard({
  children,
  className,
  style,
  onClick,
  disabled,
  sheen = true,
  glow,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  /** Specular highlight that slides with the tilt. Worth turning off on very busy cards. */
  sheen?: boolean;
  /** Colour of the light pooled under the card as it lifts. */
  glow?: string;
  ariaLabel?: string;
}) {
  const tilt = useTilt({ disabled });

  return (
    <div ref={tilt.ref} style={tilt.sceneStyle} className="relative">
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={className}
        style={{
          ...style,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: tilt.scale,
          transformStyle: tilt.disabled ? undefined : "preserve-3d",
        }}
        {...tilt.handlers}
        // Reduced motion still gets tactile confirmation, just without rotation.
        whileTap={tilt.disabled ? { opacity: 0.86 } : undefined}
      >
        {/* Contents ride forward of the card face. The parallax between a face
            and its own contents is what the eye reads as thickness. */}
        <motion.div
          style={tilt.disabled ? undefined : { z: tilt.lift, transformStyle: "preserve-3d" }}
        >
          {children}
        </motion.div>

        {sheen && !tilt.disabled && (
          <motion.span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              opacity: tilt.sheenOpacity,
              backgroundImage: tilt.sheen,
            }}
          />
        )}
      </motion.button>

      {glow && !tilt.disabled && (
        // Light pools under a lifted object. Cheap, and it grounds the card.
        <motion.span
          aria-hidden
          className="absolute inset-x-3 -bottom-1 h-6 pointer-events-none blur-xl"
          style={{ background: glow, opacity: tilt.sheenOpacity, borderRadius: "50%" }}
        />
      )}
    </div>
  );
}

/** Non-interactive variant — depth without implying "tap me". */
export function TiltPanel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const tilt = useTilt();
  return (
    <div ref={tilt.ref} style={tilt.sceneStyle} className="relative">
      <motion.div
        className={className}
        style={{
          ...style,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: tilt.disabled ? undefined : "preserve-3d",
        }}
        {...tilt.handlers}
      >
        {children}
      </motion.div>
    </div>
  );
}
