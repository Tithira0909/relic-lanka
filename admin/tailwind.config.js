/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#006994',
        green: '#2E8B57',
        yellow: '#FFD700',
      }
    },
  },
  plugins: [],
}
