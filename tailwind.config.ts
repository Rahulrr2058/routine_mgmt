import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "#181818",
        babyPink: "#F8EDED",
        descriptionText: "#6C757D",
        footer: "#770000",
      },
      fontFamily: {
        lexend: ['"Lexend"', "sans-serif"],
      },
      keyframes: {
        lightning: {
          "0%, 100%": { opacity: "0", transform: "scale(0.6)" },
          "10%, 30%, 50%, 70%": { opacity: "1", transform: "scale(1.3)" },
          "20%, 40%, 60%": { opacity: "0.5", transform: "scale(1)" },
        },
        flashText: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        pulseCountdown: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
      },
      animation: {
        lightning: "lightning 1s infinite",
        flashText: "flashText 1s infinite",
        pulseCountdown: "pulseCountdown 1s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
