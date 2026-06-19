/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1B2B',
          50: '#1A3148',
          100: '#142B40',
          200: '#0F2335',
          300: '#0B1B2B',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E2C18B',
          dark: '#9C8050',
        },
        line: '#1F3B55',
        signal: {
          red: '#D64545',
          green: '#2E8B6B',
          blue: '#4A8FB8',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', 'serif'],
        sans: ['"IBM Plex Sans"', '"Noto Serif SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
