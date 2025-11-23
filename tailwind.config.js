/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Legacy palette (keeping for backward compatibility where needed)
        'forest-green': '#2D5016',
        'tech-primary': '#0F172A',
        'tech-secondary': '#1E293B',
        
        // New Trauma-Informed Design Palette
        'sage': {
          50: '#f4f7f6',
          100: '#e3ebe9',
          200: '#c5d6d2',
          300: '#9eb7b2',
          400: '#7c9a92', // Primary Brand Color
          500: '#5f7e76',
          600: '#4a645e',
          700: '#3e514d',
          800: '#354340',
          900: '#2d3735',
        },
        'sand': {
          50: '#fbfaf8',
          100: '#f5f1e8', // Secondary Brand Color
          200: '#ebe3d3',
          300: '#decba9',
          400: '#d0af7e',
          500: '#c5955b',
          600: '#b97d4b',
          700: '#9a633f',
          800: '#805239',
          900: '#684431',
        },
        'navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#2c3e50', // Accent Brand Color (Deep Navy)
          900: '#102a43',
        },
        'warm-white': '#fcfcfc',
        
        // Aliases for easier use
        primary: '#7C9A92', // Sage
        secondary: '#F5F1E8', // Sand
        accent: '#2C3E50', // Deep Navy
        'sage-green': '#7C9A92', // Updating legacy reference
        olive: '#7C9A92', // Updating legacy reference
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'Playfair Display', 'serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem', // Softening radius as requested
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')]
}
