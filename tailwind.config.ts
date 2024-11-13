import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1A202C',
        'light-blue': '#2D3748',
        'accent-green': '#48BB78',

        P1: '#1E1F20',
        P2: '#0E0E0E',
        P3: '#060606',
        B1: 'rgba(27,27,27)',
      },

      backgroundImage: {
        "primary-gradient": "linear-gradient(to bottom, #5566FF, #333D99)",
      },
      keyframes: {
        highlightGreen: {
          '0%': { color: 'rgba(34, 197, 94, 0.2)' },
          '100%': { color: 'rgba(34, 197, 94, 0.2)' },
          // '100%': { color: 'transparent' },
        },
        highlightRed: {
          '0%': { color: 'rgba(239, 68, 68, 0.2)' },
          '100%': { color: 'rgba(239, 68, 68, 0.2)' },
          // '100%': { color: 'transparent' },
        },
      },
      animation: {
        'highlight-green': 'highlightGreen 1s ease-out',
        'highlight-red': 'highlightRed 1s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;