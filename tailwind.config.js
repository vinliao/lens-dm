const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: { fontFamily: { sans: ['Inter', ...defaultTheme.fontFamily.sans] } },
  },
  plugins: [require('tailwind-scrollbar'),
  plugin(function ({ addUtilities }) {
    addUtilities({
      /* Hide scrollbar for Chrome, Safari and Opera */
      '.no-scrollbar::-webkit-scrollbar': {
        'display': 'none',
      },

      /* Hide scrollbar for IE, Edge and Firefox */
      '.no-scrollbar': {
        '-ms-overflow-style': 'none',  /* IE and Edge */
        'scrollbar-width': 'none'  /* Firefox */
      }
    });
  }),
  ],
};
