"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Tap-readable details for compact controls, also usable by keyboard. */
export function InfoPopover({ label, summary, children, className = "" }: {
  label: string; summary: ReactNode; children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      const details = ref.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    const dismissEscape = (event: KeyboardEvent) => {
      const details = ref.current;
      if (event.key !== "Escape" || !details?.open) return;
      const focusedInside = details.contains(document.activeElement);
      details.open = false;
      if (focusedInside) details.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, []);
  return <details ref={ref} className={`info-popover ${className}`}>
    <summary aria-label={label} title={label}>{summary}</summary>
    <div className="info-popover-panel">{children}</div>
  </details>;
}
