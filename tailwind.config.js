/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00897B',
          light: '#4DB6AC',
          dark: '#00695C',
        },
        dark: {
          DEFAULT: '#000000',
          gray: '#212121',
        },
        light: {
          DEFAULT: '#FFFFFF',
          gray: '#F5F5F5',
        },
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3',
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        bold: ['System'],
      },
    },
  },
  plugins: [],
}
