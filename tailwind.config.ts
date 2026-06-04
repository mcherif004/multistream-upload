import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00d2ff",
          dim: "rgba(0,210,255,0.15)",
          glow: "rgba(0,210,255,0.4)",
        },
        cyber: {
          bg: "#000000",
          surface: "#0a0a0f",
          border: "#1a1a2e",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,210,255,0.4), 0 0 40px rgba(0,210,255,0.15)",
        "neon-sm": "0 0 10px rgba(0,210,255,0.3)",
        "neon-card": "0 0 1px rgba(0,210,255,0.4), inset 0 0 20px rgba(0,210,255,0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
