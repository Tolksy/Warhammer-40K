/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        grimdark: {
          bg: '#05060a',
          panel: '#111827',
          accent: '#facc15',
          danger: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}



