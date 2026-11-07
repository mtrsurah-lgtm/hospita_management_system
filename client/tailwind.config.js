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
          blue: '#0d9488',
          sky: '#0284c7',
          dark: '#0f766e',
          light: '#f0fdfa',
          purple: '#7c3aed',
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        hospital: {
          blue: '#1e40af',
          sky: '#0284c7',
          teal: '#0f766e',
          slate: '#0f172a',
        }
      },
    },
  },
  plugins: [],
}
