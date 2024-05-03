/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        primary: '#f2f2f2',
        secondary: '#ffffff',
        uAccent: '#0080ff',
        sAccent: '#ee6c4d',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
