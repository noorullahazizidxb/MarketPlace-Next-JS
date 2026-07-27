import type { ThemePreset } from "@repo/types";

export const shadcnThemePresetsBaseWithSidebar: Record<string, ThemePreset> = {
  default: {
    label: "Default",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "oklch(0.708 0 0)",
        "chart-1": "oklch(0.646 0.222 41.116)",
        "chart-2": "oklch(0.6 0.118 184.704)",
        "chart-3": "oklch(0.398 0.07 227.392)",
        "chart-4": "oklch(0.828 0.189 84.429)",
        "chart-5": "oklch(0.769 0.188 70.08)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "oklch(0.922 0 0)",
        "primary-foreground": "oklch(0.205 0 0)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "oklch(0.556 0 0)",
        "chart-1": "oklch(0.488 0.243 264.376)",
        "chart-2": "oklch(0.696 0.17 162.48)",
        "chart-3": "oklch(0.769 0.188 70.08)",
        "chart-4": "oklch(0.627 0.265 303.9)",
        "chart-5": "oklch(0.645 0.246 16.439)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  blue: {
    label: "Blue",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-blue-600)",
        "primary-foreground": "var(--color-blue-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-blue-400)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-blue-500)",
        "primary-foreground": "var(--color-blue-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-blue-900)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  green: {
    label: "Green",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-lime-600)",
        "primary-foreground": "var(--color-lime-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-lime-400)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-lime-500)",
        "primary-foreground": "var(--color-lime-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-lime-900)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  red: {
    label: "Red",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-red-600)",
        "primary-foreground": "var(--color-red-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-red-400)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-red-500)",
        "primary-foreground": "var(--color-red-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-red-900)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  rose: {
    label: "Rose",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-rose-600)",
        "primary-foreground": "var(--color-rose-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-rose-400)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-rose-500)",
        "primary-foreground": "var(--color-rose-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-rose-900)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  orange: {
    label: "Orange",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-orange-600)",
        "primary-foreground": "var(--color-orange-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-orange-400)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-orange-500)",
        "primary-foreground": "var(--color-orange-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-orange-900)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  yellow: {
    label: "Yellow",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-yellow-400)",
        "primary-foreground": "var(--color-yellow-900)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-yellow-400)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-yellow-500)",
        "primary-foreground": "var(--color-yellow-900)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-yellow-900)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  violet: {
    label: "Violet",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-violet-600)",
        "primary-foreground": "var(--color-violet-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-violet-400)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-violet-500)",
        "primary-foreground": "var(--color-violet-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-violet-900)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  amber: {
    label: "Amber",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-amber-600)",
        "primary-foreground": "var(--color-amber-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-amber-400)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-amber-500)",
        "primary-foreground": "var(--color-amber-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-amber-900)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  purple: {
    label: "Purple",
    styles: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-purple-600)",
        "primary-foreground": "var(--color-purple-50)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "var(--color-purple-400)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.205 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.269 0 0)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: "var(--color-purple-500)",
        "primary-foreground": "var(--color-purple-50)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        accent: "oklch(0.371 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: "var(--color-purple-900)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },
  teal: {
    label: "Teal",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "var(--color-teal-600)",
        "primary-foreground": "var(--color-teal-50)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "var(--color-teal-400)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "var(--color-teal-500)",
        "primary-foreground": "var(--color-teal-50)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "var(--color-teal-900)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ─── NEW OKLCH PRESETS ────────────────────────────────────────────────────

  cyan: {
    label: "Cyan",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.609 0.147 200)",
        "primary-foreground": "oklch(0.984 0.019 199)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.741 0.149 196)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.741 0.149 196)",
        "primary-foreground": "oklch(0.984 0.019 199)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.398 0.078 205)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  indigo: {
    label: "Indigo",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.511 0.262 277)",
        "primary-foreground": "oklch(0.962 0.018 272)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.673 0.182 277)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.673 0.182 277)",
        "primary-foreground": "oklch(0.962 0.018 272)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.359 0.144 279)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  emerald: {
    label: "Emerald",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.596 0.145 163)",
        "primary-foreground": "oklch(0.979 0.021 166)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.765 0.177 163)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.765 0.177 163)",
        "primary-foreground": "oklch(0.979 0.021 166)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.378 0.077 169)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  fuchsia: {
    label: "Fuchsia",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.591 0.286 312)",
        "primary-foreground": "oklch(0.977 0.017 320)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.741 0.238 322)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.741 0.238 322)",
        "primary-foreground": "oklch(0.977 0.017 320)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.401 0.17 315)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  sky: {
    label: "Sky",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.558 0.159 234)",
        "primary-foreground": "oklch(0.977 0.013 237)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.697 0.176 229)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.697 0.176 229)",
        "primary-foreground": "oklch(0.977 0.013 237)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.391 0.083 244)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ─── CONTRAST-GRADIENT PRESETS ────────────────────────────────────────────────
  //
  //  In each preset below the brand gradient deliberately lives in the
  //  COMPLEMENTARY hue zone of the primary colour so that it creates maximum
  //  visual contrast rather than blending in.
  //
  //  Pairing logic (OKLCH hue °):
  //   midnight (navy  ~243°)  →  gradient amber → gold        (~60° / ~40°)
  //   coral    (~18°)         →  gradient teal  → aqua        (~196° / ~220°)
  //   forest   (~148°)        →  gradient magenta → rose      (~328° / ~352°)
  //   gold     (~78°)         →  gradient violet → deep-indigo(~260° / ~282°)
  //   slate    (~225°)        →  gradient orange → red-orange (~44° / ~20°)
  //   crimson  (~10°)         →  gradient emerald → teal      (~165° / ~192°)
  //   plum     (~300°)        →  gradient lime → chartreuse   (~128° / ~104°)
  //   copper   (~34°)         →  gradient azure → royal-blue  (~220° / ~246°)
  //   mint     (~162°)        →  gradient rose → coral        (~342° / ~18°)
  //   lavender (~278°)        →  gradient yellow → lime       (~96° / ~118°)
  //
  // ─────────────────────────────────────────────────────────────────────────────

  // ── Midnight  (deep navy primary — gradient amber → gold) ────────────────────
  midnight: {
    label: "Midnight",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.32 0.20 243)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.32 0.20 243)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.52 0.18 240)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.66 0.11 196)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.66 0.11 196)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Coral  (warm coral primary — gradient teal → aqua-blue) ──────────────────
  coral: {
    label: "Coral",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.63 0.21 18)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.63 0.21 18)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.73 0.18 20)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.73 0.19 20)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.50 0.22 16)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Forest  (dark forest green primary — gradient magenta → rose) ─────────────
  forest: {
    label: "Forest",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.42 0.13 148)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.42 0.13 148)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.60 0.14 150)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.64 0.14 150)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.38 0.12 148)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Gold  (rich gold primary — gradient deep-violet → indigo) ────────────────
  gold: {
    label: "Gold",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.80 0.18 78)",
        "primary-foreground": "oklch(0.15 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.40 0.12 78)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.72 0.18 80)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.84 0.17 80)",
        "primary-foreground": "oklch(0.12 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.60 0.17 78)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Slate  (blue-grey primary — gradient orange → red-orange) ────────────────
  slate: {
    label: "Slate",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.48 0.08 225)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.48 0.08 225)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.64 0.07 222)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.66 0.07 222)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.38 0.07 225)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Crimson  (deep crimson primary — gradient emerald → teal) ────────────────
  crimson: {
    label: "Crimson",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.52 0.24 10)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.52 0.24 10)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.68 0.22 12)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.67 0.24 12)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.42 0.24 8)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Plum  (deep plum primary — gradient lime → chartreuse) ───────────────────
  plum: {
    label: "Plum",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.43 0.22 300)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.43 0.22 300)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.60 0.20 298)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.63 0.21 298)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.38 0.22 302)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Copper  (copper/burnt-orange primary — gradient azure → royal-blue) ───────
  copper: {
    label: "Copper",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.62 0.16 34)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.62 0.16 34)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.74 0.14 36)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.73 0.15 36)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.50 0.16 34)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Mint  (fresh mint primary — gradient rose → coral-red) ───────────────────
  mint: {
    label: "Mint",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.68 0.15 162)",
        "primary-foreground": "oklch(0.14 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.35 0.10 162)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.78 0.14 162)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.76 0.14 160)",
        "primary-foreground": "oklch(0.12 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.54 0.14 162)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      },
    },
  },

  // ── Lavender  (soft lavender primary — gradient yellow → lime) ───────────────
  lavender: {
    label: "Lavender",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.145 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.145 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.145 0 0)",
        primary: "oklch(0.60 0.16 278)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.60 0.16 278)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.74 0.14 276)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.96 0.014 278)",
        "sidebar-foreground": "oklch(0.18 0.05 278)",
        "sidebar-primary": "oklch(0.60 0.16 278)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.92 0.02 278)",
        "sidebar-accent-foreground": "oklch(0.28 0.08 278)",
        "sidebar-border": "oklch(0.87 0.018 278)",
        "sidebar-ring": "oklch(0.60 0.16 278)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.74 0.15 276)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.46 0.16 280)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.92 0.01 276)",
        "sidebar-primary": "oklch(0.74 0.15 276)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.28 0.08 278)",
        "sidebar-accent-foreground": "oklch(0.92 0.01 276)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.74 0.15 276)",
      },
    },
  },

  // ── Rose Gold  (warm rose-gold primary) ───────────────────────────────────────
  "rose-gold": {
    label: "Rose Gold",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.16 0.03 18)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.16 0.03 18)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.16 0.03 18)",
        primary: "oklch(0.68 0.15 16)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.24 0.06 16)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.54 0.05 16)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.30 0.07 16)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.68 0.15 16)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.15 0.05 16)",
        "sidebar-foreground": "oklch(0.90 0.02 18)",
        "sidebar-primary": "oklch(0.72 0.15 16)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.24 0.07 16)",
        "sidebar-accent-foreground": "oklch(0.88 0.02 18)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.72 0.15 16)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.76 0.15 16)",
        "primary-foreground": "oklch(0.14 0.02 14)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.58 0.15 16)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.90 0.01 18)",
        "sidebar-primary": "oklch(0.76 0.15 16)",
        "sidebar-primary-foreground": "oklch(0.14 0.02 14)",
        "sidebar-accent": "oklch(0.28 0.06 16)",
        "sidebar-accent-foreground": "oklch(0.90 0.01 18)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.76 0.15 16)",
      },
    },
  },

  // ── Deep Teal  (rich dark teal primary) ───────────────────────────────────────
  "deep-teal": {
    label: "Deep Teal",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.15 0.04 185)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.15 0.04 185)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.15 0.04 185)",
        primary: "oklch(0.44 0.14 185)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.22 0.07 185)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.52 0.06 185)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.28 0.07 185)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.44 0.14 185)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.12 0.06 185)",
        "sidebar-foreground": "oklch(0.88 0.03 185)",
        "sidebar-primary": "oklch(0.60 0.14 185)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.20 0.08 185)",
        "sidebar-accent-foreground": "oklch(0.86 0.03 185)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.60 0.14 185)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.62 0.14 185)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.42 0.14 185)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.88 0.01 185)",
        "sidebar-primary": "oklch(0.62 0.14 185)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.26 0.08 185)",
        "sidebar-accent-foreground": "oklch(0.88 0.01 185)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.62 0.14 185)",
      },
    },
  },

  // ── Warm Amber  (golden amber primary) ────────────────────────────────────────
  "warm-amber": {
    label: "Warm Amber",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.17 0.04 72)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.17 0.04 72)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.17 0.04 72)",
        primary: "oklch(0.72 0.18 68)",
        "primary-foreground": "oklch(0.14 0.03 60)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.26 0.07 68)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.54 0.06 70)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.30 0.07 68)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.62 0.18 68)",
        "chart-1": "oklch(0.56 0.22 248)",
        "chart-2": "oklch(0.62 0.17 162)",
        "chart-3": "oklch(0.63 0.21 22)",
        "chart-4": "oklch(0.58 0.22 296)",
        "chart-5": "oklch(0.66 0.18 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.16 0.06 68)",
        "sidebar-foreground": "oklch(0.90 0.02 72)",
        "sidebar-primary": "oklch(0.76 0.18 68)",
        "sidebar-primary-foreground": "oklch(0.14 0.03 60)",
        "sidebar-accent": "oklch(0.26 0.08 68)",
        "sidebar-accent-foreground": "oklch(0.88 0.02 72)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.76 0.18 68)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.80 0.18 68)",
        "primary-foreground": "oklch(0.12 0.03 60)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.62 0.18 68)",
        "chart-1": "oklch(0.68 0.21 248)",
        "chart-2": "oklch(0.72 0.16 162)",
        "chart-3": "oklch(0.72 0.20 22)",
        "chart-4": "oklch(0.68 0.21 296)",
        "chart-5": "oklch(0.74 0.17 188)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.91 0.01 72)",
        "sidebar-primary": "oklch(0.80 0.18 68)",
        "sidebar-primary-foreground": "oklch(0.12 0.03 60)",
        "sidebar-accent": "oklch(0.30 0.07 70)",
        "sidebar-accent-foreground": "oklch(0.91 0.01 72)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.80 0.18 68)",
      },
    },
  },

  // ── Soft Sage  (muted sage green primary) ────────────────────────────────────
  "soft-sage": {
    label: "Soft Sage",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.16 0.03 140)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.16 0.03 140)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.16 0.03 140)",
        primary: "oklch(0.54 0.10 140)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.22 0.06 140)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.52 0.05 140)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.28 0.06 140)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.54 0.10 140)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.96 0.014 138)",
        "sidebar-foreground": "oklch(0.20 0.04 140)",
        "sidebar-primary": "oklch(0.54 0.10 140)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.90 0.018 138)",
        "sidebar-accent-foreground": "oklch(0.24 0.05 140)",
        "sidebar-border": "oklch(0.86 0.016 138)",
        "sidebar-ring": "oklch(0.54 0.10 140)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.66 0.10 140)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.46 0.10 140)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.88 0.01 138)",
        "sidebar-primary": "oklch(0.66 0.10 140)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.28 0.06 140)",
        "sidebar-accent-foreground": "oklch(0.88 0.01 138)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.66 0.10 140)",
      },
    },
  },

  // ── Ocean Blue  (ocean-inspired blue primary) ────────────────────────────────
  "ocean-blue": {
    label: "Ocean Blue",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.15 0.04 215)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.15 0.04 215)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.15 0.04 215)",
        primary: "oklch(0.47 0.07 225)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.24 0.07 215)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.52 0.07 215)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.28 0.08 215)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.47 0.07 225)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.12 0.07 216)",
        "sidebar-foreground": "oklch(0.88 0.03 215)",
        "sidebar-primary": "oklch(0.62 0.17 216)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.20 0.09 216)",
        "sidebar-accent-foreground": "oklch(0.86 0.03 215)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.62 0.17 216)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.60 0.09 225)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.46 0.07 225)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.20 0.06 242)",
        "sidebar-foreground": "oklch(0.88 0.01 215)",
        "sidebar-primary": "oklch(0.60 0.09 225)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.26 0.08 216)",
        "sidebar-accent-foreground": "oklch(0.88 0.01 215)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.60 0.09 225)",
      },
    },
  },

  // ── Neon Lime  (bright lime-green primary) ───────────────────────────────────
  "neon-lime": {
    label: "Neon Lime",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.15 0.05 128)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.15 0.05 128)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.15 0.05 128)",
        primary: "oklch(0.72 0.24 128)",
        "primary-foreground": "oklch(0.12 0.04 128)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.22 0.08 128)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.52 0.08 128)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.25 0.08 128)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.60 0.24 128)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.11 0.06 128)",
        "sidebar-foreground": "oklch(0.88 0.06 128)",
        "sidebar-primary": "oklch(0.72 0.24 128)",
        "sidebar-primary-foreground": "oklch(0.12 0.04 128)",
        "sidebar-accent": "oklch(0.20 0.09 128)",
        "sidebar-accent-foreground": "oklch(0.86 0.06 128)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.72 0.24 128)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.80 0.26 128)",
        "primary-foreground": "oklch(0.10 0.04 128)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.62 0.24 128)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.91 0.04 128)",
        "sidebar-primary": "oklch(0.80 0.26 128)",
        "sidebar-primary-foreground": "oklch(0.10 0.04 128)",
        "sidebar-accent": "oklch(0.26 0.08 128)",
        "sidebar-accent-foreground": "oklch(0.91 0.04 128)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.80 0.26 128)",
      },
    },
  },

  // ── Dusty Rose  (muted dusty rose primary) ───────────────────────────────────
  "dusty-rose": {
    label: "Dusty Rose",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.18 0.03 5)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.18 0.03 5)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.18 0.03 5)",
        primary: "oklch(0.60 0.12 352)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.26 0.05 352)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.54 0.05 352)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.30 0.06 352)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.60 0.12 352)",
        "chart-1": "oklch(0.64 0.18 205)",
        "chart-2": "oklch(0.78 0.18 80)",
        "chart-3": "oklch(0.58 0.22 280)",
        "chart-4": "oklch(0.62 0.18 162)",
        "chart-5": "oklch(0.64 0.22 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.96 0.012 8)",
        "sidebar-foreground": "oklch(0.20 0.04 352)",
        "sidebar-primary": "oklch(0.60 0.12 352)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.90 0.018 8)",
        "sidebar-accent-foreground": "oklch(0.26 0.05 352)",
        "sidebar-border": "oklch(0.87 0.014 8)",
        "sidebar-ring": "oklch(0.60 0.12 352)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.70 0.12 352)",
        "primary-foreground": "oklch(0.14 0.02 350)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.52 0.12 352)",
        "chart-1": "oklch(0.72 0.17 205)",
        "chart-2": "oklch(0.84 0.17 80)",
        "chart-3": "oklch(0.70 0.21 280)",
        "chart-4": "oklch(0.72 0.17 162)",
        "chart-5": "oklch(0.72 0.21 320)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.90 0.01 5)",
        "sidebar-primary": "oklch(0.70 0.12 352)",
        "sidebar-primary-foreground": "oklch(0.14 0.02 350)",
        "sidebar-accent": "oklch(0.28 0.06 352)",
        "sidebar-accent-foreground": "oklch(0.90 0.01 5)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.70 0.12 352)",
      },
    },
  },

  // ── Steel Blue  (corporate steel blue) ──────────────────────────────────────
  "steel-blue": {
    label: "Steel Blue",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.16 0.03 225)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.16 0.03 225)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.16 0.03 225)",
        primary: "oklch(0.50 0.12 225)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.24 0.06 225)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.52 0.06 225)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.28 0.06 225)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.50 0.12 225)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.94 0.012 225)",
        "sidebar-foreground": "oklch(0.20 0.04 225)",
        "sidebar-primary": "oklch(0.50 0.12 225)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.87 0.015 225)",
        "sidebar-accent-foreground": "oklch(0.24 0.05 225)",
        "sidebar-border": "oklch(0.85 0.012 225)",
        "sidebar-ring": "oklch(0.50 0.12 225)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.64 0.12 225)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.44 0.12 225)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.625rem",
        "font-sans":
          "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono":
          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.88 0.008 225)",
        "sidebar-primary": "oklch(0.64 0.12 225)",
        "sidebar-primary-foreground": "oklch(0.985 0 0)",
        "sidebar-accent": "oklch(0.28 0.05 225)",
        "sidebar-accent-foreground": "oklch(0.88 0.008 225)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.64 0.12 225)",
      },
    },
  },

  // ── Cobalt Sky — deep navy shell + electric cobalt accent ─────────────────
  // Inspired by "Cobalt sky" palette: trust + energy; dark sidebar for max contrast
  "cobalt-sky": {
    label: "Cobalt Sky",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.14 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.14 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.14 0 0)",
        primary: "oklch(0.48 0.22 240)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.24 0.08 240)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.50 0.06 240)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.24 0.08 240)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.48 0.22 240)",
        "chart-1": "oklch(0.65 0.22 25)",
        "chart-2": "oklch(0.60 0.18 162)",
        "chart-3": "oklch(0.80 0.19 82)",
        "chart-4": "oklch(0.56 0.22 278)",
        "chart-5": "oklch(0.68 0.18 200)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        // ── Sidebar: deep navy — maximum contrast with electric cobalt accents ──
        sidebar: "oklch(0.16 0.12 240)",
        "sidebar-foreground": "oklch(0.90 0.04 240)",
        "sidebar-primary": "oklch(0.72 0.22 240)",
        "sidebar-primary-foreground": "oklch(0.98 0 0)",
        "sidebar-accent": "oklch(0.28 0.10 240)",
        "sidebar-accent-foreground": "oklch(0.90 0.04 240)",
        "sidebar-border": "oklch(1 0 0 / 12%)",
        "sidebar-ring": "oklch(0.72 0.22 240)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.68 0.20 240)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.68 0.20 240)",
        "chart-1": "oklch(0.74 0.21 25)",
        "chart-2": "oklch(0.72 0.17 162)",
        "chart-3": "oklch(0.86 0.18 82)",
        "chart-4": "oklch(0.68 0.21 278)",
        "chart-5": "oklch(0.76 0.17 200)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "oklch(0.16 0.09 235)",
        "sidebar-foreground": "oklch(0.92 0.04 240)",
        "sidebar-primary": "oklch(0.72 0.24 240)",
        "sidebar-primary-foreground": "oklch(0.98 0 0)",
        "sidebar-accent": "oklch(0.22 0.09 240)",
        "sidebar-accent-foreground": "oklch(0.92 0.04 240)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.72 0.24 240)",
      },
    },
  },

  // ── Jewel Box — deep sapphire sidebar + emerald accent (opulent, gemstone) ─
  // Inspired by "Jewel Box" palette: sapphire + emerald + amethyst tones
  "jewel-box": {
    label: "Jewel Box",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.14 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.14 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.14 0 0)",
        primary: "oklch(0.44 0.24 270)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.22 0.08 270)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.50 0.06 270)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.22 0.10 160)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.44 0.24 270)",
        "chart-1": "oklch(0.62 0.17 162)",
        "chart-2": "oklch(0.66 0.21 28)",
        "chart-3": "oklch(0.80 0.17 84)",
        "chart-4": "oklch(0.62 0.18 216)",
        "chart-5": "oklch(0.64 0.22 350)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        // ── Sidebar: deep sapphire with emerald active items ──────────────────
        sidebar: "oklch(0.18 0.16 265)",
        "sidebar-foreground": "oklch(0.92 0.04 265)",
        "sidebar-primary": "oklch(0.68 0.22 160)",
        "sidebar-primary-foreground": "oklch(0.12 0.06 160)",
        "sidebar-accent": "oklch(0.28 0.12 265)",
        "sidebar-accent-foreground": "oklch(0.92 0.04 265)",
        "sidebar-border": "oklch(1 0 0 / 12%)",
        "sidebar-ring": "oklch(0.68 0.22 160)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.66 0.22 270)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.66 0.22 270)",
        "chart-1": "oklch(0.72 0.16 162)",
        "chart-2": "oklch(0.74 0.20 28)",
        "chart-3": "oklch(0.86 0.16 84)",
        "chart-4": "oklch(0.72 0.17 216)",
        "chart-5": "oklch(0.72 0.21 350)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.92 0.04 265)",
        "sidebar-primary": "oklch(0.70 0.24 160)",
        "sidebar-primary-foreground": "oklch(0.10 0.06 160)",
        "sidebar-accent": "oklch(0.22 0.10 265)",
        "sidebar-accent-foreground": "oklch(0.92 0.04 265)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.70 0.24 160)",
      },
    },
  },

  // ── Neon Noir — near-black shell + electric violet glow (cyberpunk edge) ────
  // Inspired by "Neon Noir" palette: deep black + neon electric purple
  "neon-noir": {
    label: "Neon Noir",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.14 0 0)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.14 0 0)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.14 0 0)",
        primary: "oklch(0.52 0.28 285)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.24 0.08 285)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.50 0.06 285)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.24 0.10 285)",
        destructive: "oklch(0.58 0.26 13)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.52 0.28 285)",
        "chart-1": "oklch(0.52 0.28 285)",
        "chart-2": "oklch(0.64 0.22 320)",
        "chart-3": "oklch(0.68 0.24 250)",
        "chart-4": "oklch(0.60 0.26 340)",
        "chart-5": "oklch(0.58 0.22 215)",
        radius: "0.375rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        // ── Sidebar: near-black with electric violet active items ─────────────
        sidebar: "oklch(0.12 0.05 285)",
        "sidebar-foreground": "oklch(0.90 0.03 285)",
        "sidebar-primary": "oklch(0.74 0.28 285)",
        "sidebar-primary-foreground": "oklch(0.98 0 0)",
        "sidebar-accent": "oklch(0.22 0.08 285)",
        "sidebar-accent-foreground": "oklch(0.90 0.03 285)",
        "sidebar-border": "oklch(1 0 0 / 12%)",
        "sidebar-ring": "oklch(0.74 0.28 285)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.72 0.26 285)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.62 0.26 13)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.72 0.26 285)",
        "chart-1": "oklch(0.72 0.26 285)",
        "chart-2": "oklch(0.72 0.22 320)",
        "chart-3": "oklch(0.74 0.22 250)",
        "chart-4": "oklch(0.70 0.24 340)",
        "chart-5": "oklch(0.68 0.20 215)",
        radius: "0.375rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.90 0.03 285)",
        "sidebar-primary": "oklch(0.72 0.32 282)",
        "sidebar-primary-foreground": "oklch(0.98 0 0)",
        "sidebar-accent": "oklch(0.18 0.07 285)",
        "sidebar-accent-foreground": "oklch(0.90 0.03 285)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.72 0.32 282)",
      },
    },
  },

  // ── Tropical Forest — deep jungle sidebar + vivid lime accent ─────────────
  // Inspired by "Tropical Rainforest" palette: lush, fresh, vibrant
  "tropical-forest": {
    label: "Tropical Forest",
    styles: {
      light: {
        background: "#F5F5F5",
        foreground: "oklch(0.14 0.02 140)",
        card: "#FFFFFF",
        "card-foreground": "oklch(0.14 0.02 140)",
        popover: "#FFFFFF",
        "popover-foreground": "oklch(0.14 0.02 140)",
        primary: "oklch(0.48 0.20 155)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#E0E0E0",
        "secondary-foreground": "oklch(0.22 0.08 140)",
        muted: "#E0E0E0",
        "muted-foreground": "oklch(0.50 0.06 145)",
        accent: "#DCDCDC",
        "accent-foreground": "oklch(0.22 0.12 125)",
        destructive: "oklch(0.577 0.245 27.325)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#D3D3D3",
        input: "#D3D3D3",
        ring: "oklch(0.48 0.20 155)",
        "chart-1": "oklch(0.66 0.20 22)",
        "chart-2": "oklch(0.56 0.22 270)",
        "chart-3": "oklch(0.80 0.18 80)",
        "chart-4": "oklch(0.62 0.20 340)",
        "chart-5": "oklch(0.62 0.19 204)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        // ── Sidebar: deep jungle green + vivid lime accents ───────────────────
        sidebar: "oklch(0.16 0.10 155)",
        "sidebar-foreground": "oklch(0.90 0.05 140)",
        "sidebar-primary": "oklch(0.72 0.24 125)",
        "sidebar-primary-foreground": "oklch(0.12 0.08 125)",
        "sidebar-accent": "oklch(0.26 0.08 150)",
        "sidebar-accent-foreground": "oklch(0.90 0.05 140)",
        "sidebar-border": "oklch(1 0 0 / 12%)",
        "sidebar-ring": "oklch(0.72 0.24 125)",
      },
      dark: {
        background: "#0D0D0D",
        foreground: "#E0E0E0",
        card: "#121212",
        "card-foreground": "#E0E0E0",
        popover: "#181818",
        "popover-foreground": "#E0E0E0",
        primary: "oklch(0.66 0.22 155)",
        "primary-foreground": "oklch(0.98 0 0)",
        secondary: "#1C1C1C",
        "secondary-foreground": "#E0E0E0",
        muted: "#1C1C1C",
        "muted-foreground": "#B0B0B0",
        accent: "#2C2C2C",
        "accent-foreground": "#E0E0E0",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.98 0 0)",
        border: "#444444",
        input: "#444444",
        ring: "oklch(0.66 0.22 155)",
        "chart-1": "oklch(0.74 0.19 22)",
        "chart-2": "oklch(0.66 0.21 270)",
        "chart-3": "oklch(0.86 0.17 80)",
        "chart-4": "oklch(0.72 0.19 340)",
        "chart-5": "oklch(0.72 0.18 204)",
        radius: "0.5rem",
        "font-sans": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        sidebar: "#1A1A1A",
        "sidebar-foreground": "oklch(0.90 0.05 140)",
        "sidebar-primary": "oklch(0.74 0.26 125)",
        "sidebar-primary-foreground": "oklch(0.10 0.08 125)",
        "sidebar-accent": "oklch(0.20 0.07 150)",
        "sidebar-accent-foreground": "oklch(0.90 0.05 140)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": "oklch(0.74 0.26 125)",
      },
    },
  },
};

type PremiumBrandPalette = {
  light: {
    start: string;
    end: string;
    glow: string;
    hoverStart: string;
    hoverEnd: string;
  };
  dark: {
    start: string;
    end: string;
    glow: string;
    hoverStart: string;
    hoverEnd: string;
  };
};

// ─── PALETTE DESIGN GUIDE ─────────────────────────────────────────────────────
//
//  Each preset gets a gradient whose START and END sit in different hue families
//  so there is a clearly visible colour shift across the gradient (not a wash of
//  one colour).  Rule of thumb: aim for ≥ 24° hue separation and ≥ 0.10 L
//  separation between start and end.
//
//  hover* variants are simply a slightly lighter (+0.04 L) version of each stop
//  so the button / surface reads as "lifted" without needing a separate theme
//  token.
//
//  Glow alpha is 0.25 – subtle enough not to clash with nearby UI chrome yet
//  still visible against dark backgrounds.
//
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PREMIUM_BRAND_PALETTE: PremiumBrandPalette = {
  // Default primary is near-black/neutral, so we use a decorative violet→indigo
  // brand gradient that sits well on both light and dark surfaces.
  light: {
    start: "oklch(0.54 0.24 280)",  // violet-blue
    end: "oklch(0.44 0.27 258)",  // deep indigo  (+22° shift, -0.10 L)
    glow: "oklch(0.54 0.24 280 / 0.25)",
    hoverStart: "oklch(0.58 0.24 280)",
    hoverEnd: "oklch(0.48 0.27 258)",
  },
  dark: {
    start: "oklch(0.72 0.20 278)",
    end: "oklch(0.60 0.24 255)",
    glow: "oklch(0.72 0.20 278 / 0.25)",
    hoverStart: "oklch(0.76 0.20 278)",
    hoverEnd: "oklch(0.64 0.24 255)",
  },
};

const premiumBrandPalettes: Record<string, PremiumBrandPalette> = {
  default: DEFAULT_PREMIUM_BRAND_PALETTE,

  // ── Blue  (primary ≈ hue 250) → blue → indigo/violet (+28° end) ─────────────
  blue: {
    light: {
      start: "oklch(0.60 0.21 252)",  // mid-blue
      end: "oklch(0.47 0.26 280)",  // indigo
      glow: "oklch(0.60 0.21 252 / 0.25)",
      hoverStart: "oklch(0.64 0.21 252)",
      hoverEnd: "oklch(0.51 0.26 280)",
    },
    dark: {
      start: "oklch(0.72 0.19 250)",
      end: "oklch(0.59 0.24 278)",
      glow: "oklch(0.72 0.19 250 / 0.25)",
      hoverStart: "oklch(0.76 0.19 250)",
      hoverEnd: "oklch(0.63 0.24 278)",
    },
  },

  // ── Green / Lime  (primary ≈ hue 135) → lime → teal (+38° end) ───────────────
  green: {
    light: {
      start: "oklch(0.66 0.19 138)",  // lime-green
      end: "oklch(0.52 0.17 176)",  // teal
      glow: "oklch(0.66 0.19 138 / 0.25)",
      hoverStart: "oklch(0.70 0.19 138)",
      hoverEnd: "oklch(0.56 0.17 176)",
    },
    dark: {
      start: "oklch(0.76 0.17 140)",
      end: "oklch(0.62 0.15 178)",
      glow: "oklch(0.76 0.17 140 / 0.25)",
      hoverStart: "oklch(0.80 0.17 140)",
      hoverEnd: "oklch(0.66 0.15 178)",
    },
  },

  // ── Red  (primary ≈ hue 25) → red → deep crimson-rose (−22° end) ─────────────
  red: {
    light: {
      start: "oklch(0.62 0.23 24)",   // vivid red
      end: "oklch(0.48 0.26 2)",    // deep crimson
      glow: "oklch(0.62 0.23 24 / 0.25)",
      hoverStart: "oklch(0.66 0.23 24)",
      hoverEnd: "oklch(0.52 0.26 2)",
    },
    dark: {
      start: "oklch(0.72 0.22 26)",
      end: "oklch(0.58 0.25 4)",
      glow: "oklch(0.72 0.22 26 / 0.25)",
      hoverStart: "oklch(0.76 0.22 26)",
      hoverEnd: "oklch(0.62 0.25 4)",
    },
  },

  // ── Rose  (primary ≈ hue 5) → rose → deep magenta (−38° end) ────────────────
  rose: {
    light: {
      start: "oklch(0.65 0.22 8)",    // rose-red
      end: "oklch(0.50 0.27 330)",  // deep magenta
      glow: "oklch(0.65 0.22 8 / 0.25)",
      hoverStart: "oklch(0.69 0.22 8)",
      hoverEnd: "oklch(0.54 0.27 330)",
    },
    dark: {
      start: "oklch(0.75 0.20 10)",
      end: "oklch(0.61 0.25 332)",
      glow: "oklch(0.75 0.20 10 / 0.25)",
      hoverStart: "oklch(0.79 0.20 10)",
      hoverEnd: "oklch(0.65 0.25 332)",
    },
  },

  // ── Orange  (primary ≈ hue 45) → orange → red-orange (−26° end) ──────────────
  orange: {
    light: {
      start: "oklch(0.72 0.20 52)",   // orange
      end: "oklch(0.57 0.24 26)",   // red-orange
      glow: "oklch(0.72 0.20 52 / 0.25)",
      hoverStart: "oklch(0.76 0.20 52)",
      hoverEnd: "oklch(0.61 0.24 26)",
    },
    dark: {
      start: "oklch(0.80 0.18 54)",
      end: "oklch(0.66 0.22 28)",
      glow: "oklch(0.80 0.18 54 / 0.25)",
      hoverStart: "oklch(0.84 0.18 54)",
      hoverEnd: "oklch(0.70 0.22 28)",
    },
  },

  // ── Yellow  (primary ≈ hue 88) → yellow → amber (−28° end) ──────────────────
  yellow: {
    light: {
      start: "oklch(0.85 0.17 94)",   // bright yellow
      end: "oklch(0.70 0.21 66)",   // deep amber
      glow: "oklch(0.85 0.17 94 / 0.25)",
      hoverStart: "oklch(0.89 0.17 94)",
      hoverEnd: "oklch(0.74 0.21 66)",
    },
    dark: {
      start: "oklch(0.88 0.15 92)",
      end: "oklch(0.74 0.19 64)",
      glow: "oklch(0.88 0.15 92 / 0.25)",
      hoverStart: "oklch(0.92 0.15 92)",
      hoverEnd: "oklch(0.78 0.19 64)",
    },
  },

  // ── Violet  (primary ≈ hue 278) → violet → deep blue-indigo (−28° end) ───────
  violet: {
    light: {
      start: "oklch(0.62 0.24 290)",  // violet
      end: "oklch(0.49 0.27 262)",  // deep blue-indigo
      glow: "oklch(0.62 0.24 290 / 0.25)",
      hoverStart: "oklch(0.66 0.24 290)",
      hoverEnd: "oklch(0.53 0.27 262)",
    },
    dark: {
      start: "oklch(0.73 0.22 288)",
      end: "oklch(0.60 0.25 260)",
      glow: "oklch(0.73 0.22 288 / 0.25)",
      hoverStart: "oklch(0.77 0.22 288)",
      hoverEnd: "oklch(0.64 0.25 260)",
    },
  },

  // ── Amber  (primary ≈ hue 72) → amber → orange-red (−28° end) ───────────────
  amber: {
    light: {
      start: "oklch(0.80 0.19 80)",   // amber
      end: "oklch(0.63 0.24 52)",   // orange
      glow: "oklch(0.80 0.19 80 / 0.25)",
      hoverStart: "oklch(0.84 0.19 80)",
      hoverEnd: "oklch(0.67 0.24 52)",
    },
    dark: {
      start: "oklch(0.85 0.17 78)",
      end: "oklch(0.70 0.21 50)",
      glow: "oklch(0.85 0.17 78 / 0.25)",
      hoverStart: "oklch(0.89 0.17 78)",
      hoverEnd: "oklch(0.74 0.21 50)",
    },
  },

  // ── Purple  (primary ≈ hue 306) → purple → deep violet-indigo (−26° end) ─────
  purple: {
    light: {
      start: "oklch(0.59 0.25 308)",  // purple
      end: "oklch(0.46 0.27 282)",  // deep violet
      glow: "oklch(0.59 0.25 308 / 0.25)",
      hoverStart: "oklch(0.63 0.25 308)",
      hoverEnd: "oklch(0.50 0.27 282)",
    },
    dark: {
      start: "oklch(0.70 0.23 306)",
      end: "oklch(0.57 0.25 280)",
      glow: "oklch(0.70 0.23 306 / 0.25)",
      hoverStart: "oklch(0.74 0.23 306)",
      hoverEnd: "oklch(0.61 0.25 280)",
    },
  },

  // ── Teal  (primary ≈ hue 185) → teal → sky-blue (+30° end) ─────────────────
  teal: {
    light: {
      start: "oklch(0.65 0.17 188)",  // teal
      end: "oklch(0.51 0.20 218)",  // sky-blue
      glow: "oklch(0.65 0.17 188 / 0.25)",
      hoverStart: "oklch(0.69 0.17 188)",
      hoverEnd: "oklch(0.55 0.20 218)",
    },
    dark: {
      start: "oklch(0.76 0.15 186)",
      end: "oklch(0.62 0.18 216)",
      glow: "oklch(0.76 0.15 186 / 0.25)",
      hoverStart: "oklch(0.80 0.15 186)",
      hoverEnd: "oklch(0.66 0.18 216)",
    },
  },

  // ── Cyan  (primary ≈ hue 200) → cyan → blue (+26° end) ─────────────────────
  cyan: {
    light: {
      start: "oklch(0.66 0.17 202)",  // cyan
      end: "oklch(0.52 0.21 228)",  // sky-blue
      glow: "oklch(0.66 0.17 202 / 0.25)",
      hoverStart: "oklch(0.70 0.17 202)",
      hoverEnd: "oklch(0.56 0.21 228)",
    },
    dark: {
      start: "oklch(0.77 0.15 200)",
      end: "oklch(0.63 0.19 226)",
      glow: "oklch(0.77 0.15 200 / 0.25)",
      hoverStart: "oklch(0.81 0.15 200)",
      hoverEnd: "oklch(0.67 0.19 226)",
    },
  },

  // ── Indigo  (primary ≈ hue 277) → indigo → violet (+24° end) ────────────────
  indigo: {
    light: {
      start: "oklch(0.61 0.25 278)",  // indigo
      end: "oklch(0.48 0.28 304)",  // violet
      glow: "oklch(0.61 0.25 278 / 0.25)",
      hoverStart: "oklch(0.65 0.25 278)",
      hoverEnd: "oklch(0.52 0.28 304)",
    },
    dark: {
      start: "oklch(0.72 0.22 276)",
      end: "oklch(0.59 0.26 302)",
      glow: "oklch(0.72 0.22 276 / 0.25)",
      hoverStart: "oklch(0.76 0.22 276)",
      hoverEnd: "oklch(0.63 0.26 302)",
    },
  },

  // ── Emerald  (primary ≈ hue 163) → emerald → teal (+24° end) ────────────────
  emerald: {
    light: {
      start: "oklch(0.66 0.17 160)",  // emerald
      end: "oklch(0.52 0.18 186)",  // teal
      glow: "oklch(0.66 0.17 160 / 0.25)",
      hoverStart: "oklch(0.70 0.17 160)",
      hoverEnd: "oklch(0.56 0.18 186)",
    },
    dark: {
      start: "oklch(0.77 0.15 162)",
      end: "oklch(0.63 0.16 188)",
      glow: "oklch(0.77 0.15 162 / 0.25)",
      hoverStart: "oklch(0.81 0.15 162)",
      hoverEnd: "oklch(0.67 0.16 188)",
    },
  },

  // ── Fuchsia  (primary ≈ hue 312) → fuchsia → deep pink (+30° end) ───────────
  fuchsia: {
    light: {
      start: "oklch(0.67 0.28 314)",  // vivid fuchsia
      end: "oklch(0.52 0.30 344)",  // deep pink-rose
      glow: "oklch(0.67 0.28 314 / 0.25)",
      hoverStart: "oklch(0.71 0.28 314)",
      hoverEnd: "oklch(0.56 0.30 344)",
    },
    dark: {
      start: "oklch(0.77 0.26 312)",
      end: "oklch(0.62 0.28 342)",
      glow: "oklch(0.77 0.26 312 / 0.25)",
      hoverStart: "oklch(0.81 0.26 312)",
      hoverEnd: "oklch(0.66 0.28 342)",
    },
  },

  // ── Sky  (primary ≈ hue 234) → sky → deep indigo (+26° end) ─────────────────
  sky: {
    light: {
      start: "oklch(0.63 0.19 232)",  // sky blue
      end: "oklch(0.49 0.24 258)",  // indigo
      glow: "oklch(0.63 0.19 232 / 0.25)",
      hoverStart: "oklch(0.67 0.19 232)",
      hoverEnd: "oklch(0.53 0.24 258)",
    },
    dark: {
      start: "oklch(0.74 0.17 230)",
      end: "oklch(0.60 0.22 256)",
      glow: "oklch(0.74 0.17 230 / 0.25)",
      hoverStart: "oklch(0.78 0.17 230)",
      hoverEnd: "oklch(0.64 0.22 256)",
    },
  },

  // ── Midnight  (primary ≈ hue 243, deep navy) → amber → gold (complement ~63°)
  //  Hue Δ = 24° (60° → 36°) · L Δ = 0.14 · true OKLCH complement of 243°
  midnight: {
    light: {
      start: "oklch(0.82 0.18 60)",   // warm amber
      end: "oklch(0.68 0.21 36)",   // deep gold-orange   (−24° hue, −0.14 L)
      glow: "oklch(0.82 0.18 60 / 0.25)",
      hoverStart: "oklch(0.86 0.18 60)",
      hoverEnd: "oklch(0.72 0.21 36)",
    },
    dark: {
      start: "oklch(0.86 0.17 62)",   // bright amber
      end: "oklch(0.73 0.20 40)",   // rich gold           (−22° hue, −0.13 L)
      glow: "oklch(0.86 0.17 62 / 0.25)",
      hoverStart: "oklch(0.90 0.17 62)",
      hoverEnd: "oklch(0.77 0.20 40)",
    },
  },

  // ── Coral  (primary ≈ hue 18, warm coral) → teal → aqua (complement ~198°)
  //  Hue Δ = 26° (196° → 222°) · L Δ = 0.13 · true OKLCH complement of 18°
  coral: {
    light: {
      start: "oklch(0.64 0.17 196)",  // clear teal
      end: "oklch(0.51 0.20 222)",  // aqua-sky-blue       (+26° hue, −0.13 L)
      glow: "oklch(0.64 0.17 196 / 0.25)",
      hoverStart: "oklch(0.68 0.17 196)",
      hoverEnd: "oklch(0.55 0.20 222)",
    },
    dark: {
      start: "oklch(0.74 0.16 194)",  // light teal
      end: "oklch(0.61 0.18 220)",  // bright aqua         (+26° hue, −0.13 L)
      glow: "oklch(0.74 0.16 194 / 0.25)",
      hoverStart: "oklch(0.78 0.16 194)",
      hoverEnd: "oklch(0.65 0.18 220)",
    },
  },

  // ── Forest  (primary ≈ hue 148, forest green) → magenta → rose (complement ~328°)
  //  Hue Δ = 24° (328° → 352°) · L Δ = 0.12 · true OKLCH complement of 148°
  forest: {
    light: {
      start: "oklch(0.58 0.28 328)",  // vivid magenta
      end: "oklch(0.70 0.24 352)",  // rose-pink           (+24° hue, +0.12 L)
      glow: "oklch(0.58 0.28 328 / 0.25)",
      hoverStart: "oklch(0.62 0.28 328)",
      hoverEnd: "oklch(0.74 0.24 352)",
    },
    dark: {
      start: "oklch(0.69 0.26 326)",  // rich magenta
      end: "oklch(0.80 0.22 350)",  // bright rose         (+24° hue, +0.11 L)
      glow: "oklch(0.69 0.26 326 / 0.25)",
      hoverStart: "oklch(0.73 0.26 326)",
      hoverEnd: "oklch(0.84 0.22 350)",
    },
  },

  // ── Gold  (primary ≈ hue 78, yellow-gold) → violet → deep-indigo (complement ~258°)
  //  Hue Δ = 24° (258° → 282°) · L Δ = 0.12 · true OKLCH complement of 78°
  gold: {
    light: {
      start: "oklch(0.54 0.26 258)",  // bright violet
      end: "oklch(0.42 0.28 282)",  // deep indigo         (+24° hue, −0.12 L)
      glow: "oklch(0.54 0.26 258 / 0.25)",
      hoverStart: "oklch(0.58 0.26 258)",
      hoverEnd: "oklch(0.46 0.28 282)",
    },
    dark: {
      start: "oklch(0.70 0.23 256)",  // mid violet
      end: "oklch(0.58 0.26 280)",  // indigo-violet       (+24° hue, −0.12 L)
      glow: "oklch(0.70 0.23 256 / 0.25)",
      hoverStart: "oklch(0.74 0.23 256)",
      hoverEnd: "oklch(0.62 0.26 280)",
    },
  },

  // ── Slate  (primary ≈ hue 225, cool blue-grey) → orange → red-orange (complement ~45°)
  //  Hue Δ = 24° (44° → 20°) · L Δ = 0.16 · true OKLCH complement of 225°
  slate: {
    light: {
      start: "oklch(0.76 0.20 44)",   // warm orange
      end: "oklch(0.60 0.24 20)",   // red-orange          (−24° hue, −0.16 L)
      glow: "oklch(0.76 0.20 44 / 0.25)",
      hoverStart: "oklch(0.80 0.20 44)",
      hoverEnd: "oklch(0.64 0.24 20)",
    },
    dark: {
      start: "oklch(0.82 0.18 46)",   // bright orange
      end: "oklch(0.68 0.22 22)",   // vivid red-orange    (−24° hue, −0.14 L)
      glow: "oklch(0.82 0.18 46 / 0.25)",
      hoverStart: "oklch(0.86 0.18 46)",
      hoverEnd: "oklch(0.72 0.22 22)",
    },
  },

  // ── Crimson  (primary ≈ hue 10, deep crimson) → emerald → teal (complement ~190°)
  //  Hue Δ = 27° (165° → 192°) · L Δ = 0.12 · true OKLCH complement of 10°
  crimson: {
    light: {
      start: "oklch(0.62 0.18 165)",  // emerald green
      end: "oklch(0.50 0.17 192)",  // teal                (+27° hue, −0.12 L)
      glow: "oklch(0.62 0.18 165 / 0.25)",
      hoverStart: "oklch(0.66 0.18 165)",
      hoverEnd: "oklch(0.54 0.17 192)",
    },
    dark: {
      start: "oklch(0.73 0.16 163)",  // bright emerald
      end: "oklch(0.61 0.15 190)",  // light teal          (+27° hue, −0.12 L)
      glow: "oklch(0.73 0.16 163 / 0.25)",
      hoverStart: "oklch(0.77 0.16 163)",
      hoverEnd: "oklch(0.65 0.15 190)",
    },
  },

  // ── Plum  (primary ≈ hue 300, purple-magenta) → lime → chartreuse (complement ~120°)
  //  Hue Δ = 24° (128° → 104°) · L Δ = 0.12 · true OKLCH complement of 300°
  plum: {
    light: {
      start: "oklch(0.72 0.24 128)",  // vivid lime
      end: "oklch(0.84 0.24 104)",  // chartreuse          (−24° hue, +0.12 L)
      glow: "oklch(0.72 0.24 128 / 0.25)",
      hoverStart: "oklch(0.76 0.24 128)",
      hoverEnd: "oklch(0.88 0.24 104)",
    },
    dark: {
      start: "oklch(0.78 0.22 130)",  // bright lime
      end: "oklch(0.90 0.22 106)",  // sharp chartreuse    (−24° hue, +0.12 L)
      glow: "oklch(0.78 0.22 130 / 0.25)",
      hoverStart: "oklch(0.82 0.22 130)",
      hoverEnd: "oklch(0.94 0.22 106)",
    },
  },

  // ── Copper  (primary ≈ hue 34, copper/burnt-orange) → azure → royal-blue (complement ~214°)
  //  Hue Δ = 26° (220° → 246°) · L Δ = 0.14 · true OKLCH complement of 34°
  copper: {
    light: {
      start: "oklch(0.62 0.19 220)",  // azure blue
      end: "oklch(0.48 0.24 246)",  // royal blue          (+26° hue, −0.14 L)
      glow: "oklch(0.62 0.19 220 / 0.25)",
      hoverStart: "oklch(0.66 0.19 220)",
      hoverEnd: "oklch(0.52 0.24 246)",
    },
    dark: {
      start: "oklch(0.72 0.18 222)",  // bright azure
      end: "oklch(0.60 0.22 248)",  // deep royal blue     (+26° hue, −0.12 L)
      glow: "oklch(0.72 0.18 222 / 0.25)",
      hoverStart: "oklch(0.76 0.18 222)",
      hoverEnd: "oklch(0.64 0.22 248)",
    },
  },

  // ── Mint  (primary ≈ hue 162, fresh mint) → rose → coral (complement ~342°)
  //  Hue Δ = 36° (342° → 18°, wrapping) · L Δ = 0.12 · true OKLCH complement of 162°
  mint: {
    light: {
      start: "oklch(0.62 0.26 342)",  // vivid rose
      end: "oklch(0.74 0.22 18)",   // warm coral          (+36° hue wrap, +0.12 L)
      glow: "oklch(0.62 0.26 342 / 0.25)",
      hoverStart: "oklch(0.66 0.26 342)",
      hoverEnd: "oklch(0.78 0.22 18)",
    },
    dark: {
      start: "oklch(0.72 0.24 340)",  // bright rose
      end: "oklch(0.82 0.20 20)",   // vivid coral         (+40° hue wrap, +0.10 L)
      glow: "oklch(0.72 0.24 340 / 0.25)",
      hoverStart: "oklch(0.76 0.24 340)",
      hoverEnd: "oklch(0.86 0.20 20)",
    },
  },

  // ── Lavender  (primary ≈ hue 278, blue-violet) → yellow-green → lime (complement ~98°)
  //  Hue Δ = 24° (96° → 120°) · L Δ = 0.12 · true OKLCH complement of 278°
  lavender: {
    light: {
      start: "oklch(0.88 0.18 96)",   // bright yellow-green
      end: "oklch(0.76 0.22 120)",  // saturated lime      (+24° hue, −0.12 L)
      glow: "oklch(0.88 0.18 96 / 0.25)",
      hoverStart: "oklch(0.92 0.18 96)",
      hoverEnd: "oklch(0.80 0.22 120)",
    },
    dark: {
      start: "oklch(0.90 0.17 94)",   // warm yellow-lime
      end: "oklch(0.79 0.21 118)",  // vivid lime          (+24° hue, −0.11 L)
      glow: "oklch(0.90 0.17 94 / 0.25)",
      hoverStart: "oklch(0.94 0.17 94)",
      hoverEnd: "oklch(0.83 0.21 118)",
    },
  },
};

export const withPremiumBrandVariables = (
  presets: Record<string, ThemePreset>,
): Record<string, ThemePreset> => {
  const withAlpha = (color: string, alpha: string) => {
    const trimmed = color.trim();
    if (!trimmed.startsWith("oklch(")) return trimmed;
    if (trimmed.includes("/")) return trimmed;
    return trimmed.replace(/\)$/, ` / ${alpha})`);
  };

  return Object.fromEntries(
    Object.entries(presets).map(([presetKey, preset]) => {
      const palette =
        premiumBrandPalettes[presetKey] ?? DEFAULT_PREMIUM_BRAND_PALETTE;

      const lightPrimary = preset.styles.light.primary ?? palette.light.start;
      const darkPrimary = preset.styles.dark.primary ?? palette.dark.start;
      const lightAccent = preset.styles.light.accent ?? palette.light.end;
      const darkAccent = preset.styles.dark.accent ?? palette.dark.end;
      const lightSuccess = preset.styles.light.success ?? preset.styles.light["chart-2"] ?? palette.light.end;
      const darkSuccess = preset.styles.dark.success ?? preset.styles.dark["chart-2"] ?? palette.dark.end;
      const lightInfo = preset.styles.light.info ?? preset.styles.light["chart-3"] ?? palette.light.start;
      const darkInfo = preset.styles.dark.info ?? preset.styles.dark["chart-3"] ?? palette.dark.start;
      const lightWarning = preset.styles.light.warning ?? preset.styles.light["chart-5"] ?? lightAccent;
      const darkWarning = preset.styles.dark.warning ?? preset.styles.dark["chart-5"] ?? darkAccent;
      const lightForeground = preset.styles.light.foreground ?? "oklch(0.145 0 0)";
      const darkForeground = preset.styles.dark.foreground ?? "oklch(0.985 0 0)";
      const lightBackground = preset.styles.light.background ?? "oklch(1 0 0)";
      const darkBackground = preset.styles.dark.background ?? "oklch(0.145 0 0)";
      const lightCard = preset.styles.light.card ?? lightBackground;
      const darkCard = preset.styles.dark.card ?? darkBackground;
      const lightBorder = preset.styles.light.border ?? "oklch(0.922 0 0)";
      const darkBorder = preset.styles.dark.border ?? "oklch(1 0 0 / 10%)";
      const lightMuted = preset.styles.light.muted ?? "oklch(0.97 0 0)";
      const darkMuted = preset.styles.dark.muted ?? "oklch(0.269 0 0)";
      const lightMutedForeground =
        preset.styles.light["muted-foreground"] ?? "oklch(0.556 0 0)";
      const darkMutedForeground =
        preset.styles.dark["muted-foreground"] ?? "oklch(0.708 0 0)";
      const lightPrimaryForeground =
        preset.styles.light["primary-foreground"] ?? lightForeground;
      const darkPrimaryForeground =
        preset.styles.dark["primary-foreground"] ?? darkForeground;
      const lightSecondary = preset.styles.light.secondary ?? lightMuted;
      const darkSecondary = preset.styles.dark.secondary ?? darkMuted;
      const lightSecondaryForeground =
        preset.styles.light["secondary-foreground"] ?? lightForeground;
      const darkSecondaryForeground =
        preset.styles.dark["secondary-foreground"] ?? darkForeground;
      const lightRing = preset.styles.light.ring ?? lightPrimary;
      const darkRing = preset.styles.dark.ring ?? darkPrimary;

      return [
        presetKey,
        {
          ...preset,
          styles: {
            light: {
              ...preset.styles.light,
              "brand-gradient-start":
                preset.styles.light["brand-gradient-start"] ?? palette.light.start,
              "brand-gradient-end":
                preset.styles.light["brand-gradient-end"] ?? palette.light.end,
              "brand-gradient":
                preset.styles.light["brand-gradient"] ??
                `linear-gradient(135deg, ${palette.light.start}, ${palette.light.end})`,
              "hover-gradient-start":
                preset.styles.light["hover-gradient-start"] ?? palette.light.hoverStart,
              "hover-gradient-end":
                preset.styles.light["hover-gradient-end"] ?? palette.light.hoverEnd,
              "hover-gradient":
                preset.styles.light["hover-gradient"] ??
                `linear-gradient(135deg, ${palette.light.hoverStart}, ${palette.light.hoverEnd})`,
              "brand-glow":
                preset.styles.light["brand-glow"] ?? palette.light.glow,
              success: lightSuccess,
              "success-foreground":
                preset.styles.light["success-foreground"] ??
                lightPrimaryForeground,
              warning: lightWarning,
              "warning-foreground":
                preset.styles.light["warning-foreground"] ??
                lightForeground,
              info: lightInfo,
              "info-foreground":
                preset.styles.light["info-foreground"] ??
                lightPrimaryForeground,
              price: preset.styles.light.price ?? lightSuccess,
              "price-sale": preset.styles.light["price-sale"] ?? lightPrimary,
              "price-original":
                preset.styles.light["price-original"] ??
                lightMutedForeground,
              "price-highlight-bg":
                preset.styles.light["price-highlight-bg"] ??
                withAlpha(lightSuccess, "0.18"),
              "switch-track-off":
                preset.styles.light["switch-track-off"] ??
                lightMuted,
              "switch-track-off-border":
                preset.styles.light["switch-track-off-border"] ??
                lightBorder,
              "switch-track-on":
                preset.styles.light["switch-track-on"] ??
                lightPrimary,
              "switch-track-on-border":
                preset.styles.light["switch-track-on-border"] ??
                lightRing,
              "switch-thumb":
                preset.styles.light["switch-thumb"] ??
                lightBackground,
              "switch-thumb-on":
                preset.styles.light["switch-thumb-on"] ??
                lightPrimaryForeground,
              "switch-ring":
                preset.styles.light["switch-ring"] ??
                withAlpha(lightPrimary, "0.35"),
              "scrollbar-track":
                preset.styles.light["scrollbar-track"] ??
                lightMuted,
              "scrollbar-thumb":
                preset.styles.light["scrollbar-thumb"] ??
                lightBorder,
              "scrollbar-thumb-hover":
                preset.styles.light["scrollbar-thumb-hover"] ??
                lightMutedForeground,
              skeleton:
                preset.styles.light.skeleton ??
                lightMuted,
              "skeleton-shimmer":
                preset.styles.light["skeleton-shimmer"] ??
                withAlpha(lightCard, "0.85"),
              "badge-cheap":
                preset.styles.light["badge-cheap"] ??
                withAlpha(lightSuccess, "0.2"),
              "badge-cheap-text":
                preset.styles.light["badge-cheap-text"] ??
                lightSuccess,
              "badge-best":
                preset.styles.light["badge-best"] ??
                withAlpha(lightPrimary, "0.2"),
              "badge-best-text":
                preset.styles.light["badge-best-text"] ??
                lightPrimary,
              "badge-fast":
                preset.styles.light["badge-fast"] ??
                withAlpha(lightInfo, "0.2"),
              "badge-fast-text":
                preset.styles.light["badge-fast-text"] ??
                lightInfo,
              "airline-logo-bg":
                preset.styles.light["airline-logo-bg"] ??
                lightCard,
              "layover-line":
                preset.styles.light["layover-line"] ??
                lightBorder,
              "selected-flight":
                preset.styles.light["selected-flight"] ??
                withAlpha(lightPrimary, "0.12"),
              "selected-flight-border":
                preset.styles.light["selected-flight-border"] ??
                lightRing,
              chip:
                preset.styles.light.chip ??
                lightSecondary,
              "chip-foreground":
                preset.styles.light["chip-foreground"] ??
                lightSecondaryForeground,
              "chip-selected":
                preset.styles.light["chip-selected"] ??
                lightPrimary,
              "chip-selected-foreground":
                preset.styles.light["chip-selected-foreground"] ??
                lightPrimaryForeground,
            },
            dark: {
              ...preset.styles.dark,
              "brand-gradient-start":
                preset.styles.dark["brand-gradient-start"] ?? palette.dark.start,
              "brand-gradient-end":
                preset.styles.dark["brand-gradient-end"] ?? palette.dark.end,
              "brand-gradient":
                preset.styles.dark["brand-gradient"] ??
                `linear-gradient(135deg, ${palette.dark.start}, ${palette.dark.end})`,
              "hover-gradient-start":
                preset.styles.dark["hover-gradient-start"] ?? palette.dark.hoverStart,
              "hover-gradient-end":
                preset.styles.dark["hover-gradient-end"] ?? palette.dark.hoverEnd,
              "hover-gradient":
                preset.styles.dark["hover-gradient"] ??
                `linear-gradient(135deg, ${palette.dark.hoverStart}, ${palette.dark.hoverEnd})`,
              "brand-glow":
                preset.styles.dark["brand-glow"] ?? palette.dark.glow,
              success: darkSuccess,
              "success-foreground":
                preset.styles.dark["success-foreground"] ??
                darkPrimaryForeground,
              warning: darkWarning,
              "warning-foreground":
                preset.styles.dark["warning-foreground"] ??
                darkForeground,
              info: darkInfo,
              "info-foreground":
                preset.styles.dark["info-foreground"] ??
                darkPrimaryForeground,
              price: preset.styles.dark.price ?? darkSuccess,
              "price-sale": preset.styles.dark["price-sale"] ?? darkPrimary,
              "price-original":
                preset.styles.dark["price-original"] ??
                darkMutedForeground,
              "price-highlight-bg":
                preset.styles.dark["price-highlight-bg"] ??
                withAlpha(darkSuccess, "0.18"),
              "switch-track-off":
                preset.styles.dark["switch-track-off"] ??
                darkMuted,
              "switch-track-off-border":
                preset.styles.dark["switch-track-off-border"] ??
                darkBorder,
              "switch-track-on":
                preset.styles.dark["switch-track-on"] ??
                darkPrimary,
              "switch-track-on-border":
                preset.styles.dark["switch-track-on-border"] ??
                darkRing,
              "switch-thumb":
                preset.styles.dark["switch-thumb"] ??
                darkBackground,
              "switch-thumb-on":
                preset.styles.dark["switch-thumb-on"] ??
                darkPrimaryForeground,
              "switch-ring":
                preset.styles.dark["switch-ring"] ??
                withAlpha(darkPrimary, "0.4"),
              "scrollbar-track":
                preset.styles.dark["scrollbar-track"] ??
                darkMuted,
              "scrollbar-thumb":
                preset.styles.dark["scrollbar-thumb"] ??
                darkBorder,
              "scrollbar-thumb-hover":
                preset.styles.dark["scrollbar-thumb-hover"] ??
                darkMutedForeground,
              skeleton:
                preset.styles.dark.skeleton ??
                darkMuted,
              "skeleton-shimmer":
                preset.styles.dark["skeleton-shimmer"] ??
                withAlpha(darkCard, "0.85"),
              "badge-cheap":
                preset.styles.dark["badge-cheap"] ??
                withAlpha(darkSuccess, "0.2"),
              "badge-cheap-text":
                preset.styles.dark["badge-cheap-text"] ??
                darkSuccess,
              "badge-best":
                preset.styles.dark["badge-best"] ??
                withAlpha(darkPrimary, "0.2"),
              "badge-best-text":
                preset.styles.dark["badge-best-text"] ??
                darkPrimary,
              "badge-fast":
                preset.styles.dark["badge-fast"] ??
                withAlpha(darkInfo, "0.2"),
              "badge-fast-text":
                preset.styles.dark["badge-fast-text"] ??
                darkInfo,
              "airline-logo-bg":
                preset.styles.dark["airline-logo-bg"] ??
                darkCard,
              "layover-line":
                preset.styles.dark["layover-line"] ??
                darkBorder,
              "selected-flight":
                preset.styles.dark["selected-flight"] ??
                withAlpha(darkPrimary, "0.16"),
              "selected-flight-border":
                preset.styles.dark["selected-flight-border"] ??
                darkRing,
              chip:
                preset.styles.dark.chip ??
                darkSecondary,
              "chip-foreground":
                preset.styles.dark["chip-foreground"] ??
                darkSecondaryForeground,
              "chip-selected":
                preset.styles.dark["chip-selected"] ??
                darkPrimary,
              "chip-selected-foreground":
                preset.styles.dark["chip-selected-foreground"] ??
                darkPrimaryForeground,
            },
          },
        },
      ];
    }),
  );
};

export const shadcnThemePresets: Record<string, ThemePreset> =
  withPremiumBrandVariables(shadcnThemePresetsBaseWithSidebar);