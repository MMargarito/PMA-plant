/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        secondary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1e88e5',
          600: '#1976d2',
          700: '#1565c0',
          800: '#0d47a1',
          900: '#01579b',
        },
        myceili: {
          cyan: '#26C6DA',
          blue: '#1E88E5',
          light: '#E0F7FA',
          dark: '#006064',
        }
      },
      backgroundImage: {
        'myceili-gradient': 'linear-gradient(135deg, #1E88E5 0%, #26C6DA 100%)',
        'myceili-gradient-dark': 'linear-gradient(135deg, #0D47A1 0%, #00838F 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

