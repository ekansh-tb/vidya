import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        deva: ["var(--font-deva)", "var(--font-body)", "sans-serif"],
      },
      colors: {
        cosmos: {
          950: "#0A0420",
          900: "#0F0729",
          800: "#170D3D",
          700: "#221555",
          600: "#311E78",
        },
        nova: {
          cyan: "#22D3EE",
          magenta: "#F472B6",
          amber: "#FBBF24",
          lime: "#A3E635",
          violet: "#A78BFA",
          rose: "#FB7185",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "scale-in": "scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-up": "slideUp 0.45s ease-out both",
        "float": "float 3.5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "flame": "flame 1.4s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "aurora": "aurora 18s ease infinite",
        "wiggle": "wiggle 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.92)" }, to: { opacity: "1", transform: "scale(1)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        flame: { "0%, 100%": { transform: "scale(1) rotate(-2deg)" }, "50%": { transform: "scale(1.06) rotate(2deg)" } },
        pulseGlow: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(244, 114, 182, 0.6)" }, "50%": { boxShadow: "0 0 32px 12px rgba(244, 114, 182, 0)" } },
        aurora: { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        wiggle: { "0%, 100%": { transform: "rotate(0deg)" }, "25%": { transform: "rotate(-3deg)" }, "75%": { transform: "rotate(3deg)" } },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};

export default config;
