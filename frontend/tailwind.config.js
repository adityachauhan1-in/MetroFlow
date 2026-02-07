/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        metro: {
          primary: "#0ea5e9",
          dark: "#0369a1",
          light: "#38bdf8",
          surface: "#f0f9ff",
          accent: "#0c4a6e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "metro-pulse": "metro-pulse 1.5s ease-in-out infinite",
        "train-move": "train-move 2s ease-in-out infinite",
      },
      keyframes: {
        "metro-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "train-move": {
          "0%": { transform: "translateX(-20px)" },
          "100%": { transform: "translateX(20px)" },
        },
      },
    },
  },
  plugins: [],
};
