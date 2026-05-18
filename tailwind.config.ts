import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        mist: "#f5f7fb",
        line: "#dbe3ee"
      },
      boxShadow: {
        panel: "0 12px 30px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
