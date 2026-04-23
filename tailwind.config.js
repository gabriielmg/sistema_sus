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
          DEFAULT: '#0f62db',
          dark: '#0a4cae',
          soft: '#edf5ff',
        },
        susGreen: {
          DEFAULT: '#0f9d73',
          dark: '#0b7d5b',
          soft: '#eaf9f3',
        },
        ink: '#0f2137',
        mist: '#f3f8fc',
        slateHealth: '#6c8098',
        lineHealth: '#d9e4f0',
      },
      boxShadow: {
        soft: '0 32px 70px -38px rgba(15, 33, 55, 0.28)',
        card: '0 24px 44px -28px rgba(15, 98, 219, 0.36)',
        elevated: '0 30px 80px -34px rgba(15, 33, 55, 0.32)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Sora', 'Inter', 'ui-sans-serif'],
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(15, 98, 219, 0.13) 1px, transparent 0)',
        'hero-wash':
          'linear-gradient(135deg, rgba(15, 98, 219, 0.12), rgba(15, 157, 115, 0.08))',
      },
    },
  },
  plugins: [],
}
