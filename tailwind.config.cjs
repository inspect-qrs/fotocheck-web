/** @type {import('tailwindcss').Config} */

const Color = require('color')
const lighten = (clr, val) => Color(clr).lighten(val).rgb().string()
const darken = (clr, val) => Color(clr).darken(val).rgb().string()

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#6ea8fe',
          DEFAULT: '#0d6efd',
          dark: darken('#0d6efd', 0.5)
        },
        red: {
          DEFAULT: '#b3190e',
          dark: '#70151e'
        },
        gray: {
          DEFAULT: colors.gray,
          light: 'rgba(0, 0, 0, 0.2)'
        },
        black: {
          DEFAULT: colors.black,
          light: lighten('black', 0.2)
        },
        success: {
          DEFAULT: '#198754',
          dark: darken('#198754', 0.5)
        },
        yellow: '#ffc107',
        cyan: '#0dcaf0'
      },
      gridTemplateColumns: {
        filter: '70% 30%'
      },
      boxShadow: {
        card: '0px 1px 10px -1px rgba(0,0,0,0.5)'
      }
    },
    screens: {
      xs: '480px',
      ss: '620px',
      sm: '768px',
      md: '1060px',
      lg: '1200px',
      xl: '1700px'
    }
  },
  plugins: []
}
