import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgTertiary: "var(--bg-tertiary)",
        borderColor: "var(--border-color)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          glow: "var(--primary-glow)",
        },
        amberGold: {
          DEFAULT: "var(--amber)",
          glow: "var(--amber-glow)",
        },
        correct: {
          DEFAULT: "var(--correct)",
          glow: "var(--correct-glow)",
        },
        wrong: {
          DEFAULT: "var(--wrong)",
          glow: "var(--wrong-glow)",
        },
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
      },
      fontFamily: {
        space: ["'Space Grotesk'", "sans-serif"],
        lora: ["'Lora'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 20px var(--primary-glow)",
        amberGlow: "0 0 20px var(--amber-glow)",
        correctGlow: "0 0 20px var(--correct-glow)",
        wrongGlow: "0 0 20px var(--wrong-glow)",
      },
    },
  },
  plugins: [],
};
export default config;
