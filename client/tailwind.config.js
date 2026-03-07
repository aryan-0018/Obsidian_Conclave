/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#0a0a0a',
          card: '#111111',
          secondary: '#1a1a1a',
          border: '#2a2520',
          gold: '#b38f4d',
          goldHover: '#96763d',
          text: '#e8e0d4',
          muted: '#9a9080'
        }
      }
    },
  },
  plugins: [],
}