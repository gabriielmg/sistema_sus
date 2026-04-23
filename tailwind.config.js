/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        susBlue: {
          DEFAULT: '#1d5fd1',
          dark: '#123d8d',
          soft: '#eaf2ff',
        },
        susGreen: {
          DEFAULT: '#0f9b6d',
          dark: '#0c7351',
          soft: '#e7f8f1',
        },
        ink: '#11263c',
        mist: '#eef5fb',
      },
      boxShadow: {
        soft: '0 30px 60px -28px rgba(17, 38, 60, 0.32)',
        card: '0 18px 35px -24px rgba(29, 95, 209, 0.45)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Sora', 'Manrope', 'ui-sans-serif'],
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(29, 95, 209, 0.12) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
