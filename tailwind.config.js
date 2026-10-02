/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
          600: '#0270c1',
          700: '#03599d',
          800: '#074c82',
          900: '#0c406e',
          950: '#082849',
        },
        slate: {
          850: '#151e2e',
          950: '#0b0f19',
        },
        emerald: {
          450: '#10b981',
        },
        amber: {
          450: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(12, 141, 228, 0.3)',
        'glow-lg': '0 0 40px -10px rgba(12, 141, 228, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
