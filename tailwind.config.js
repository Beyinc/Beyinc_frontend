/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#4f55c7',
        customWhite:'#ffffff', // Add your custom color here
        lightPurple:'#f0f0ff',
        
      },
    },
  },
  plugins: [],
}

