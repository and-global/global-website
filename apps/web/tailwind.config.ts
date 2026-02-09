import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0066B3",
          "blue-dark": "#004d87",
          "blue-light": "#e6f0f9",
          purple: "#751C7C",
          teal: "#68C8C6",
          yellow: "#FFC81A",
          orange: "#EF7F20",
        },
      },
    },
  },
  plugins: [],
};

export default config;
