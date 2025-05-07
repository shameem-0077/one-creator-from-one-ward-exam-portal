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
      },
      fontFamily: {
        // figtree_regular: ["figtree_regular"],
        // figtree_medium: ["figtree_medium"],
        // figtree_semibold: ["figtree_semibold"],
        figtree: ["var(--font-figtree)"],
      },
      fontWeight: {
        regular: "400",
        semibold: "600",
        bold: "700",
      },
      boxShadow: {
        custom: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;
