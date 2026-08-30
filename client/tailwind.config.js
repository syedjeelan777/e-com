/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#026fc1',
          700: '#03589c',
          800: '#074a81',
          900: '#0c3e6c',
          950: '#082747',
        },
        industrial: {
          50: '#f6f6f7',
          100: '#e3e3e7',
          200: '#c7c7cf',
          300: '#a1a1ae',
          400: '#767687',
          500: '#5b5b6c',
          600: '#484856',
          700: '#3b3b46',
          800: '#34343d',
          900: '#2e2e35',
          950: '#1c1c21',
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
