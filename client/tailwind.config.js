/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  // Dark mode via the [data-theme="dark"] attribute set by ThemeToggle.jsx
  darkMode: ["selector", '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        primary:        "var(--color-primary)",
        "primary-hover":"var(--color-primary-hover)",
        "primary-soft": "var(--color-primary-soft)",
        success:        "var(--color-success)",
        "success-soft": "var(--color-success-soft)",
        danger:         "var(--color-danger)",
        "danger-hover": "var(--color-danger-hover)",
        "danger-soft":  "var(--color-danger-soft)",
        warning:        "var(--color-warning)",
        "warning-soft": "var(--color-warning-soft)",
        surface:        "var(--color-surface)",
        "surface-2":    "var(--color-surface-2)",
        "surface-hover":"var(--color-surface-hover)",
        border:         "var(--color-border)",
        "border-strong":"var(--color-border-strong)",
        "text-base":    "var(--color-text)",
        "text-muted":   "var(--color-text-muted)",
        "text-subtle":  "var(--color-text-subtle)",
        "text-inverse": "var(--color-text-inverse)",
        // Category palette
        "cat-food":          "var(--cat-food)",
        "cat-transport":     "var(--cat-transport)",
        "cat-shopping":      "var(--cat-shopping)",
        "cat-health":        "var(--cat-health)",
        "cat-entertainment": "var(--cat-entertainment)",
        "cat-bills":         "var(--cat-bills)",
        "cat-other":         "var(--cat-other)",
      },
      boxShadow: {
        xs:   "var(--shadow-xs)",
        sm:   "var(--shadow-sm)",
        md:   "var(--shadow-md)",
        lg:   "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        DEFAULT: "160ms",
        slow:    "240ms",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
