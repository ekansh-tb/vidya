"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-[var(--bg-base)] shadow-sm",
  secondary: "bg-[var(--surface-strong)] text-[var(--text)] border border-[var(--border)]",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--surface-strong)]",
  success: "bg-[var(--success)] text-[var(--bg-base)]",
  danger: "bg-[var(--error)] text-[var(--bg-base)]",
  outline: "border-2 border-[var(--border-strong)] text-[var(--text)] bg-transparent hover:bg-[var(--surface-strong)]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-base rounded-2xl",
  lg: "px-7 py-3.5 text-lg rounded-2xl",
};

export function Button({
  children, onClick, variant = "primary", size = "md",
  disabled, className, type = "button", "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}) {
  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "neo-button font-bold font-body transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
