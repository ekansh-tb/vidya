"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

/** Finite decorative motion. Content and navigation are immediately available. */
export function useLearningMotion(root: RefObject<HTMLElement | null>, calm: boolean, scene: string) {
  useEffect(() => {
    if (calm || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo("[data-activity-art]", { y: 7, rotation: -2 }, {
        y: 0, rotation: 0, duration: .45, stagger: .045, ease: "power2.out", clearProps: "transform",
      });
    }, root);
    return () => context.revert();
  }, [root, calm, scene]);
}
