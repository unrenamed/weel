import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      typography: {
        DEFAULT: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      fontFamily: {
        display: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        default: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // Modal
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.3s ease-out forwards",
        // Input Select
        "input-select-slide-up":
          "input-select-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "input-select-slide-down":
          "input-select-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        // Accordion
        "accordion-down": "accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Custom wiggle animation
        wiggle: "wiggle 1s infinite",
        // Link card skeleton
        "move-up": "move-up 0.75s linear",
        // Spin slow
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        // Modal
        "scale-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        // Input Select
        "input-select-slide-up": {
          "0%": { transform: "translateY(-342px)" },
          "100%": { transform: "translateY(-350px)" },
        },
        "input-select-slide-down": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(8px)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(200px)", opacity: 0 },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-200px)", opacity: 0 },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
        },
        // Accordion
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // Custom wiggle animation
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-2px) rotate(-4deg)" },
          "30%": { transform: "translateX(3px) rotate(4deg)" },
          "45%": { transform: "translateX(-3px) rotate(-2.4deg)" },
          "60%": { transform: "translateX(1px) rotate(1.6deg)" },
          "75%": { transform: "translateX(-1px) rotate(-0.8deg)" },
        },
        // Link card skeleton
        "move-up": {
          "0%": { transform: "translateY(50px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      boxShadow: {
        kbd: "inset 0 -1px 0 rgba(110, 118, 129, 0.4)",
      },
      colors: {
        bkg: "hsl(var(--color-bkg) / <alpha-value>)",
        content: "hsl(var(--color-content) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        skeleton: "hsl(var(--color-skeleton) / <alpha-value>)",
        overlay: "hsl(var(--color-overlay) / <alpha-value>)",
        danger: "hsl(var(--color-danger) / <alpha-value>)",
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        link: "hsl(var(--color-link) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        "input-border": "hsl(var(--color-input-border) / <alpha-value>)",
        "input-placeholder":
          "hsl(var(--color-input-placeholder) / <alpha-value>)",
        "primary-btn": "hsl(var(--color-primary-btn) / <alpha-value>)",
        "primary-btn-disabled":
          "hsl(var(--color-primary-btn-disabled) / <alpha-value>)",
        "primary-btn-b": "hsl(var(--color-primary-btn-b) / <alpha-value>)",
        "primary-btn-b-disabled":
          "hsl(var(--color-primary-btn-b-disabled) / <alpha-value>)",
        "primary-btn-txt": "hsl(var(--color-primary-btn-txt) / <alpha-value>)",
        "primary-btn-txt-disabled":
          "hsl(var(--color-primary-btn-txt-disabled) / <alpha-value>)",
        "primary-btn-txt-hover":
          "hsl(var(--color-primary-btn-txt-hover) / <alpha-value>)",
        "secondary-btn": "hsl(var(--color-secondary-btn) / <alpha-value>)",
        "secondary-btn-disabled":
          "hsl(var(--color-secondary-btn-disabled) / <alpha-value>)",
        "secondary-btn-b": "hsl(var(--color-secondary-btn-b) / <alpha-value>)",
        "secondary-btn-b-disabled":
          "hsl(var(--color-secondary-btn-b-disabled) / <alpha-value>)",
        "secondary-btn-txt":
          "hsl(var(--color-secondary-btn-txt) / <alpha-value>)",
        "secondary-btn-txt-disabled":
          "hsl(var(--color-secondary-btn-txt-disabled) / <alpha-value>)",
        "secondary-btn-txt-hover":
          "hsl(var(--color-secondary-btn-txt-hover) / <alpha-value>)",
        "error-btn": "hsl(var(--color-error-btn) / <alpha-value>)",
        "error-btn-disabled":
          "hsl(var(--color-error-btn-disabled) / <alpha-value>)",
        "error-btn-b": "hsl(var(--color-error-btn-b) / <alpha-value>)",
        "error-btn-b-disabled":
          "hsl(var(--color-error-btn-b-disabled) / <alpha-value>)",
        "error-btn-txt": "hsl(var(--color-error-btn-txt) / <alpha-value>)",
        "error-btn-txt-disabled":
          "hsl(var(--color-error-btn-txt-disabled) / <alpha-value>)",
        "error-btn-txt-hover":
          "hsl(var(--color-error-btn-txt-hover) / <alpha-value>)",
        "primary-kbd": "hsl(var(--color-primary-kbd) / <alpha-value>)",
        "primary-kbd-hover":
          "hsl(var(--color-primary-kbd-hover) / <alpha-value>)",
        "primary-kbd-b": "hsl(var(--color-primary-kbd-b) / <alpha-value>)",
        "primary-kbd-txt": "hsl(var(--color-primary-kbd-txt) / <alpha-value>)",
        "primary-kbd-txt-hover":
          "hsl(var(--color-primary-kbd-txt-hover) / <alpha-value>)",
        "secondary-kbd": "hsl(var(--color-secondary-kbd) / <alpha-value>)",
        "secondary-kbd-hover":
          "hsl(var(--color-secondary-kbd-hover) / <alpha-value>)",
        "secondary-kbd-b": "hsl(var(--color-secondary-kbd-b) / <alpha-value>)",
        "secondary-kbd-txt":
          "hsl(var(--color-secondary-kbd-txt) / <alpha-value>)",
        "secondary-kbd-txt-hover":
          "hsl(var(--color-secondary-kbd-txt-hover) / <alpha-value>)",
        "error-kbd": "hsl(var(--color-error-kbd) / <alpha-value>)",
        "error-kbd-hover": "hsl(var(--color-error-kbd-hover) / <alpha-value>)",
        "error-kbd-b": "hsl(var(--color-error-kbd-b) / <alpha-value>)",
        "error-kbd-txt": "hsl(var(--color-error-kbd-txt) / <alpha-value>)",
        "error-kbd-txt-hover":
          "hsl(var(--color-error-kbd-txt-hover) / <alpha-value>)",
        "devices-bar": "hsl(var(--color-devices-bar) / <alpha-value>)",
        "locations-bar": "hsl(var(--color-locations-bar) / <alpha-value>)",
        "referrers-bar": "hsl(var(--color-referrers-bar) / <alpha-value>)",
        "bar-list-tab": "hsl(var(--color-bar-list-tab) / <alpha-value>)",
        "selected-bar-list-tab":
          "hsl(var(--color-selected-bar-list-tab) / <alpha-value>)",
        "link-card-backlight-from":
          "hsl(var(--color-link-card-backlight-from) / <alpha-value>)",
        "link-card-backlight-to":
          "hsl(var(--color-link-card-backlight-to) / <alpha-value>)",
        "tooltip-secondary":
          "hsl(var(--color-tooltip-secondary) / <alpha-value>)",
        "manage-password-form-tab":
          "hsl(var(--color-manage-password-form-tab) / <alpha-value>)",
        "manage-password-form-selected-tab":
          "hsl(var(--color-manage-password-form-selected-tab) / <alpha-value>)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".inset-center": {
          top: "50%",
          left: "50%",
          "@apply -translate-x-1/2 -translate-y-1/2": {},
        },
        ".inset-y-center": {
          top: "50%",
          "@apply -translate-y-1/2": {},
        },
        ".inset-x-center": {
          left: "50%",
          "@apply -translate-x-1/2": {},
        },
      });
    }),
  ],
};
