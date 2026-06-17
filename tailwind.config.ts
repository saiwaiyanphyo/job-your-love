import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#FAFAFA",
        sidebar: "#F7F6F4",
        card: "#FFFFFF",
        hover: "#EFEEEC",
        line: "#E8E7E4",
        line2: "#D9D8D4",
        ink: "#0F0F0F",
        ink2: "#6B6B6B",
        ink3: "#9B9B9B",
        status: {
          wishlist: "#9B9B9B",
          applied: "#3B82F6",
          assessment: "#8B5CF6",
          interviewing: "#F97316",
          final: "#EAB308",
          offer: "#22C55E",
          accepted: "#10B981",
          rejected: "#EF4444",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
