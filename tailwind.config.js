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
        primary: {
          50: "#E8EDF7",
          100: "#C6D1EA",
          200: "#9FB0D9",
          300: "#758EC8",
          400: "#4F70B9",
          500: "#2C52AB",
          600: "#1A3E8A",
          700: "#0F2D6B",
          800: "#0A2463",
          900: "#061842",
          950: "#030D28",
        },
        gold: {
          50: "#FDF9ED",
          100: "#FAF0C8",
          200: "#F5E091",
          300: "#EFCD5A",
          400: "#E8BF39",
          500: "#D8B44A",
          600: "#C19A2E",
          700: "#9E7B24",
          800: "#7B5F1D",
          900: "#5D4818",
        },
        risk: {
          high: "#E63946",
          medium: "#F77F00",
          low: "#2A9D8F",
        },
        slate: {
          850: "#172033",
          950: "#0A0F1A",
        },
      },
      fontFamily: {
        sans: ["Noto Sans SC", "Inter", "system-ui", "sans-serif"],
        serif: ["Noto Serif SC", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink": "blink 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
