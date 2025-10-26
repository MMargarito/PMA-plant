/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        secondary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
        myceili: {
          lime: '#a4d866',
          green: '#4caf50',
          teal: '#00897b',
          dark: '#1b5e20',
          light: '#e8f5e9',
          accent: '#81c784',
        }
      },
      backgroundImage: {
        'myceili-gradient': 'linear-gradient(135deg, #4caf50 0%, #00897b 100%)',
        'myceili-gradient-dark': 'linear-gradient(135deg, #2e7d32 0%, #00695c 100%)',
        'myceili-gradient-light': 'linear-gradient(135deg, #81c784 0%, #4db6ac 100%)',
        'myceili-radial': 'radial-gradient(circle at top right, #4caf50, #00897b)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

