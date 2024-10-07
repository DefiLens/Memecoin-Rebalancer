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
      },
    },
  },
  plugins: [],
};
export default config;