/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Bangers"', 'cursive'],
        display: ['"Fredoka"', 'sans-serif'],
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        comic: '4px 4px 0px #0f172a',
        'comic-sm': '2px 2px 0px #0f172a',
        'comic-lg': '6px 6px 0px #0f172a',
      },
      keyframes: {
        'hero-pop': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-100%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'hero-pop': 'hero-pop 1.8s ease-in-out infinite',
        'shine-sweep': 'shine-sweep 2.6s ease-in-out infinite',
        'float-slow': 'float-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
