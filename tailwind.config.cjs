/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        '128': '32rem',
      },
      colors:{
        custompurple:'rgb(125, 134, 238)',
        customblue:'rgb(50, 150, 250)'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-23deg)' },
          '50%': { transform: 'rotate(23deg)' },
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'Exo': ["Exo", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
});