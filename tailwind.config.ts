import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C8E64C",
        accent: "#D4ED6E",
        dark: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
export default config;
