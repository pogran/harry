const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        secondary: 'var(--color-secondary)',
        gray: {
          75: '#d2d2d2',
          150: 'hsla(0,0%,100%,.77)',
          250: '#aaaaaa',
        },
        black: {
          300: '#444444',
          400: '#3a3a3a',
          500: '#303030',
          600: '#262626',
          700: '#141414',
          800: '#121212',
          900: '#080808',
          1000: '#000000',
        },
        stone: {
          750: '#332e2d',
        },
        primary: {
          main: 'var(--color-primary-main)',
          hover: 'var(--color-primary-hover)',
        },
      },
      backgroundImage: {
        'book-pattern':
          'linear-gradient(-180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.9) 90%)',
      },
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
}
