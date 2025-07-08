import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./**/*.html",
    "./**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anuphan", "sans-serif"],
      },
      fontSize: {
        dynamic: "clamp(0.875rem, 1vw, 1.125rem)",
      },
    },
  },
  plugins: [],
};

export default config;
