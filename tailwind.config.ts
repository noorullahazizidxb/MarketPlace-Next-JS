import type { Config } from "tailwindcss";

/**
 * Slim config — colors/radius come from CSS `@theme` (var(--*)), not hsl(var(--*)).
 * Keep only non-token utilities (container, shadows, keyframes).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      borderRadius: {
        squircle: "var(--squircle-radius)",
      },
      boxShadow: {
        soft: "0 10px 30px -12px color-mix(in oklch, var(--foreground) 25%, transparent)",
        glass:
          "inset 0 1px color-mix(in oklch, var(--foreground) 12%, transparent), 0 10px 30px -12px color-mix(in oklch, var(--foreground) 28%, transparent)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(10%, -10%, 0) scale(1.05)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "logo-scroll": {
          "0%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-144rem)" },
        },
      },
      animation: {
        aurora: "aurora 12s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "logo-scroll": "logo-scroll 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
