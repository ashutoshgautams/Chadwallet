import type { Config } from "tailwindcss";

/**
 * ChadWallet brand system.
 * Every value here was sampled directly from the official app assets
 * (see /lib/brand.ts for provenance notes), not eyeballed.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas — a deep blue-black, the in-app background. NOT pure black.
        bg: "#020817",
        surface: "#0F1729",
        "surface-2": "#1A2336",
        hairline: "#1E2A40",
        // The signal green: buy, positive price action, primary CTA, active nav.
        green: {
          DEFAULT: "#26ED80",
          press: "#1DBA67",
          dim: "#0E3D27",
        },
        // Sell / negative.
        red: { DEFAULT: "#F44034", dim: "#3A1411" },
        // Links + the promo gradient's cool end.
        blue: "#2696FF",
        mint: "#8EE1D1",
        // Text.
        ink: "#FFFFFF",
        muted: "#8A93A6",
        faint: "#5A6379",
      },
      fontFamily: {
        // Heavy rounded-geometric display (Cash-App energy) for headlines.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Clean body/UI face.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Tabular monospace so prices don't jitter as digits change.
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // Reserved for the landing's one bright promo moment.
        promo: "linear-gradient(168deg, #2696FF 0%, #5FC5E8 52%, #8EE1D1 100%)",
      },
      borderRadius: {
        pill: "999px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        glow: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(38,237,128,0.25), 0 0 40px rgba(38,237,128,0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(38,237,128,0.5), 0 0 80px rgba(38,237,128,0.2)",
          },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 5s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        glow: "glow 2.5s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        scan: "scan 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
