/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#5b21b6',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1361',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        surface: '#1f2937',
        'surface-light': '#374151',
        'surface-lighter': '#4b5563',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'elevated': '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}