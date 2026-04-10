/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        susBlue: '#005b9f',
        susGreen: '#00a65a'
      }
    },
  },
  plugins: [],
}