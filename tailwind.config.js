/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Professional Healthcare Nonprofit Palette
        'sage': {
          50: '#F6F7F5',
          100: '#E3E7E0',
          200: '#C7D0C1',
          300: '#A8B5A0',
          400: '#8F9F85',
          500: '#7A8A6F',
          600: '#6B7A61',
          700: '#5A6853',
          800: '#4C5747',
          900: '#40493B',
        },
        'deep-navy': {
          50: '#F0F2F5',
          100: '#D9DFE8',
          200: '#B4C0D1',
          300: '#8FA0B9',
          400: '#6A80A1',
          500: '#4A6588',
          600: '#3A5270',
          700: '#2E425A',
          800: '#243445',
          900: '#1E2D4F',
        },
        'warm-cream': '#FAF8F3',
        'accent-gold': {
          50: '#FDF8F0',
          100: '#F9E9D1',
          200: '#F3D4A3',
          300: '#EDB970',
          400: '#E7A345',
          500: '#C9A45C',
          600: '#B8934A',
          700: '#9A7C3E',
          800: '#7C6532',
          900: '#655229',
        },
        'soft-white': '#FFFFFF',
        // Semantic colors
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#F44336',
        'info': '#2196F3',
      },
      fontFamily: {
        // Professional Healthcare Typography
        'primary': ['Source Sans Pro', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Merriweather', 'Georgia', 'serif'],
        'mono': ['SF Mono', 'Monaco', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Sophisticated typography scale
        'display-large': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.1' }],
        'display-medium': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.2' }],
        'display-small': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.3' }],
        'headline-large': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.3' }],
        'headline-medium': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.4' }],
        'headline-small': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.4' }],
        'body-large': ['clamp(1rem, 1.3vw, 1.125rem)', { lineHeight: '1.6' }],
        'body-medium': ['clamp(0.875rem, 1.1vw, 1rem)', { lineHeight: '1.6' }],
        'body-small': ['clamp(0.75rem, 0.9vw, 0.875rem)', { lineHeight: '1.5' }],
      },
      spacing: {
        // Professional spacing system
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      boxShadow: {
        // Sophisticated shadow system
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'strong': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        // Professional radius system
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        // Smooth animations
        'fast': '150ms ease-out',
        'medium': '250ms ease-out',
        'slow': '350ms ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
