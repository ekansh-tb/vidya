"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/30",
  secondary: "bg-white/10 backdrop-blur-xl text-white border border-white/10",
  ghost: "bg-white/5 text-white hover:bg-white/10",
  success: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
  danger: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30",
  outline: "border-2 border-white/20 text-white bg-transparent hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-base rounded-2xl",
  lg: "px-7 py-3.5 text-lg rounded-2xl",
};

export function Button({
  children, onClick, variant = "primary", size = "md",
  disabled, className, type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
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
