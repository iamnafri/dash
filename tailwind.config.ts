import { nextui, colors } from "@nextui-org/react";
import { readableColor } from "color2k";
import { Config } from "tailwindcss";

function swapColorValues<T extends Object>(colors: T) {
  const swappedColors = {};
  const keys = Object.keys(colors);
  const length = keys.length;

  for (let i = 0; i < length / 2; i++) {
    const key1 = keys[i];
    const key2 = keys[length - 1 - i];

    // @ts-ignore
    swappedColors[key1] = colors[key2];
    // @ts-ignore
    swappedColors[key2] = colors[key1];
  }
  if (length % 2 !== 0) {
    const middleKey = keys[Math.floor(length / 2)];

    // @ts-ignore
    swappedColors[middleKey] = colors[middleKey];
  }

  return swappedColors;
}

const slate = {
  "50": "#f8fafc",
  "100": "#f1f5f9",
  "200": "#e2e8f0",
  "300": "#cbd5e1",
  "400": "#94a3b8",
  "500": "#64748b",
  "600": "#475569",
  "700": "#334155",
  "800": "#1e293b",
  "900": "#0f172a",
};

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "var(--nextui-spacing-unit-3)",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    fontFamily: {
      sans: "'Plus Jakarta Sans', sans-seri",
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              ...colors.purple,
              DEFAULT: colors.purple[500],
              foreground: readableColor(colors.purple[500]),
            },
            background: {
              DEFAULT: slate[50],
            },
            foreground: {
              ...slate,
              DEFAULT: slate[900],
            },
            focus: {
              DEFAULT: colors.purple[500],
            },
            content1: {
              DEFAULT: slate[50],
              foreground: slate[900],
            },
            content2: {
              DEFAULT: slate[100],
              foreground: slate[800],
            },
            content3: {
              DEFAULT: slate[200],
              foreground: slate[700],
            },
            content4: {
              DEFAULT: slate[300],
              foreground: slate[600],
            },
          },
        },
        dark: {
          colors: {
            primary: {
              ...swapColorValues(colors.purple),
              foreground: readableColor(colors.purple[500]),
              DEFAULT: colors.purple[500],
            },
            background: {
              DEFAULT: "rgb(14, 19, 32)",
            },
            foreground: {
              ...swapColorValues(slate),
              DEFAULT: slate[50],
            },
            focus: {
              DEFAULT: colors.purple[500],
            },
            content1: {
              DEFAULT: slate[900],
              foreground: slate[50],
            },
            content2: {
              DEFAULT: "#1C2536",
              foreground: slate[100],
            },
            content3: {
              DEFAULT: slate[700],
              foreground: slate[200],
            },
            content4: {
              DEFAULT: slate[600],
              foreground: slate[300],
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
