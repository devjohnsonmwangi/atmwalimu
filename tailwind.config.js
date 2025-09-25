// tailwind.config.js
import daisyui from "daisyui";
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  // We control dark mode by adding/removing a 'dark' class on the <html> tag.
  // DaisyUI will then apply the theme specified in the 'data-theme' attribute.
  darkMode: 'class', 

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    'node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      // Your keyframes and animations are preserved as they are.
      keyframes: {
        marquee: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
        twinkle: { '0%, 100%': { color: '#FFF', transform: 'translateY(0)' }, '50%': { color: '#FFF5E1', transform: 'translateY(-0.25rem)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideInLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        fadeInDown: { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        modalEnter: { '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' }, '100%': { opacity: '1', transform: 'scale(1) translateY(0)' } },
        logoutProgress: { '0%': { width: '0%' }, '100%': { width: '100%' } },
        blob: { "0%": { transform: "translate(0px, 0px) scale(1)" }, "33%": { transform: "translate(30px, -50px) scale(1.1)" }, "66%": { transform: "translate(-20px, 20px) scale(0.9)" }, "100%": { transform: "translate(0px, 0px) scale(1)" } },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        modalEnter: 'modalEnter 0.3s ease-in-out forwards',
        'logout-progress': 'logoutProgress 2s ease-out forwards',
        blob: "blob 7s infinite",
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      animationDelay: {
        '100': '100ms', '200': '200ms', '300': '300ms', '400': '400ms', '500': '500ms', '700': '700ms', '1000': '1000ms',
      },
      screens: {
        'xs': '250px', 'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '2000px',
      },
    },
  },
  plugins: [
    flowbitePlugin,
    daisyui,
    function ({ addUtilities, theme, e }) {
      const delays = theme('animationDelay');
      if (delays) {
        const utilities = Object.entries(delays).map(([key, value]) => ({
          [`.${e(`animation-delay-${key}`)}`]: { 'animation-delay': value },
        }));
        addUtilities(utilities, ['responsive', 'hover']);
      }
    }
  ],
  // This is the core of our new theme system
  daisyui: {
    themes: [
      {
        'mwalimu-light': {
          "primary": "#2563eb",   // A strong, professional blue
          "secondary": "#4f46e5", // A complementary indigo/purple
          "accent": "#10b981",    // An energetic green for highlights
          "neutral": "#1e293b",   // Dark slate for primary text
          "base-100": "#f8fafc",  // Main background (very light gray)
          "base-200": "#f1f5f9",  // Cards/sections background
          "base-300": "#e2e8f0",  // Borders or hover states
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",

          // Adding content colors for text on colored backgrounds
          "--rounded-box": "1rem", // Default border radius for cards
          "--rounded-btn": "0.5rem", // Default border radius for buttons
          "primary-content": "#ffffff",
          "secondary-content": "#ffffff",
          "accent-content": "#ffffff",
          "neutral-content": "#f8fafc",
        },
      },
      {
        'mwalimu-dark': {
          "primary": "#60a5fa",    // A lighter blue that pops on dark
          "secondary": "#818cf8",  // A lighter indigo/purple
          "accent": "#34d399",     // A vibrant green for highlights
          "neutral": "#e2e8f0",    // Light slate for primary text
          "base-100": "#0f172a",   // Main background (very dark navy/slate)
          "base-200": "#1e293b",   // Cards/sections background
          "base-300": "#334155",   // Borders or hover states
          "info": "#60a5fa",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",

          // Adding content colors for text on colored backgrounds
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "primary-content": "#0f172a",
          "secondary-content": "#0f172a",
          "accent-content": "#0f172a",
          "neutral-content": "#0f172a",

        },
      },
    ],
    darkTheme: "mwalimu-dark", // Specifies which theme is the dark theme
    base: true,
    styled: true,
    utils: true,
  },
};