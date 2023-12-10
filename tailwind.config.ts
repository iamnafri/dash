import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', sans-seri",
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "4px",
          medium: "8px",
          large: "10px",
        },
      },
    }),
  ],
} satisfies Config;
