"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every framer-motion animation inside honour the OS "reduce motion"
 * setting.
 *
 * `reducedMotion="user"` drops transform and layout animations (x, y, scale,
 * rotate, `layout`) straight to their end state while still animating opacity
 * and colour — i.e. entrance slides and staggered lists degrade to a cross-fade
 * rather than merely running faster. Shortening a duration is not enough: a
 * vestibular trigger has to actually stop.
 *
 * This does NOT cover looping opacity/colour animations or anything driven by
 * CSS; those are handled at the call site (see Mascot, StreakFlame, the tutor's
 * "thinking" pulse) and by the reduced-motion block in globals.css.
 *
 * Wrap a whole view in this rather than threading `useReducedMotion` through
 * every motion element — one wrapper cannot be forgotten halfway down a file.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
