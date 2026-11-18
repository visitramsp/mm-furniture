import type { Config } from "tailwindcss";

// Theme tokens taken from the Strivera Global site (navy + orange, Plus Jakarta Sans / Inter)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2rem" }, screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        navy: { DEFAULT: "#0f1e3d", 700: "#172a52", 600: "#1d3566", 500: "#2a4a85", 950: "#0a1429" },
        accent: { DEFAULT: "#f28c28", hover: "#e07a14", soft: "#fdeedd", text: "#a65300", dark: "#f7b26b" },
        grey: { 50: "#f6f8fb", 100: "#eef2f7", 200: "#dfe5ee", 400: "#8a97ab", 600: "#4a5568" },
        ink: "#1b2333",
        success: { DEFAULT: "#135c2c", soft: "#e7f6ec" },
        danger: { DEFAULT: "#b42318", soft: "#fdecea" },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "18px", lgx: "12px" },
      boxShadow: {
        soft: "0 2px 8px rgba(15,30,61,0.06)",
        card: "0 10px 30px rgba(15,30,61,0.10)",
        lift: "0 24px 60px rgba(15,30,61,0.18)",
        glow: "0 10px 40px -10px rgba(242,140,40,0.55)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
