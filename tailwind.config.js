/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        subcold: {
          black: '#000000',
          dark: '#111111',
          gray: '#1a1a1a',
          'gray-light': '#2a2a2a',
          teal: '#00B4D8',
          'teal-dark': '#0096B4',
          'teal-light': '#48CAE4',
          white: '#FFFFFF',
          'off-white': '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
