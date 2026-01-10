/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#420212',
          50: '#f9e7eb',
          100: '#f0c5cc',
          200: '#e59aa5',
          300: '#d96f7e',
          400: '#c94458',
          500: '#420212',
          600: '#380210',
          700: '#2e010d',
          800: '#24010a',
          900: '#1a0108',
        },
        golden: {
          DEFAULT: '#f3a93e',
          50: '#fef8ec',
          100: '#fdf0d3',
          200: '#fbe1a7',
          300: '#f8d27b',
          400: '#f6c34f',
          500: '#f3a93e',
          600: '#d99432',
          700: '#bf7f26',
          800: '#a56a1a',
          900: '#8b550e',
        },
      },
      fontFamily: {
        'league': ['"League Spartan"', 'sans-serif'],
        'integral': ['"Integral CF"', 'sans-serif'],
        'sporting': ['"Sporting Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}