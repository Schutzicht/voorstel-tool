/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF9F6',
          dark: '#F0EDE8',
        },
        'warm-grey': '#E8E6E1',
        muted: '#B5B0A8',
        dark: '#0D0D0D',
        indigo: {
          light: '#4F5EF7',
          DEFAULT: '#2D3FE0',
        },
        violet: '#6C63FF',
        'text-primary': '#2A2A2A',
        'text-secondary': '#4A4A4A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
