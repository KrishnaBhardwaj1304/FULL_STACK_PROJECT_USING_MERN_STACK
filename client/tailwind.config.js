/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          50: '#fdfbf7',
          100: '#f7f1e5',
          200: '#eddcc5',
          300: '#dfbe9c',
          400: '#ce9e71',
          500: '#b87c46',
          600: '#9d6337',
          700: '#7d4a2d',
          800: '#5c3523',
          900: '#3e2318',
        },
        crust: {
          light: '#f4ede4',
          DEFAULT: '#c68b59',
          dark: '#58311a',
        },
        cinnamon: '#87431d',
        butter: '#fef3c7',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
