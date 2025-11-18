/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // MetzlerCares Premium Brand Colors
        'forest-green': {
          DEFAULT: '#2D5016',
          50: '#F0F4E8',
          100: '#DDE6C8',
          200: '#BBD094',
          300: '#99B960',
          400: '#77A32C',
          500: '#2D5016',
          600: '#244012',
          700: '#1B300D',
          800: '#122009',
          900: '#091004'
        },
        'sunset-orange': {
          DEFAULT: '#FF6B35',
          50: '#FFF1EB',
          100: '#FFE2D6',
          200: '#FFC5AD',
          300: '#FFA885',
          400: '#FF8B5C',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#CC4922',
          800: '#B23818',
          900: '#99270F'
        },
        'mountain-blue': {
          DEFAULT: '#4A90E2',
          50: '#EBF3FD',
          100: '#D6E7FB',
          200: '#ADCEF6',
          300: '#85B5F1',
          400: '#5C9CEC',
          500: '#4A90E2',
          600: '#3A7BC8',
          700: '#2A66AE',
          800: '#1A5194',
          900: '#0A3C7A'
        },
        'warm-gray': {
          DEFAULT: '#F5F4F2',
          50: '#FEFDFC',
          100: '#FDFBF9',
          200: '#F9F6F2',
          300: '#F5F4F2',
          400: '#E8E6E3',
          500: '#DAD8D5',
          600: '#CCCAC7',
          700: '#BEBCB9',
          800: '#B0AEAB',
          900: '#A2A09D'
        },
        'gold-milestone': {
          DEFAULT: '#F4D03F',
          50: '#FEF9E7',
          100: '#FDF2CF',
          200: '#FAE59F',
          300: '#F8D870',
          400: '#F5CB40',
          500: '#F4D03F',
          600: '#DAB837',
          700: '#C1A02F',
          800: '#A78827',
          900: '#8E701F'
        },
        // Extended Brand Colors
        'sage-green': '#7A8471',
        'terracotta': '#C65D00',
        'sky-blue': '#87CEEB',
        'cream': '#FAF8F5',
        'charcoal': '#2C2C2C',
        
        // Legacy colors for compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626'
        }
      },
      fontFamily: {
        'primary': ['Canela', 'Tiempos', 'Georgia', 'serif'],
        'secondary': ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        'accent': ['Playfair Display', 'serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
        // Legacy fonts for compatibility
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      fontSize: {
        // Extended typography scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      spacing: {
        // Premium spacing scale based on 4px grid
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        // Extended radius system
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        // Premium animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.6)' }
        }
      },
      boxShadow: {
        // Premium shadow system
        'forest': '0 4px 20px rgba(45, 80, 22, 0.15)',
        'sunset': '0 8px 32px rgba(255, 107, 53, 0.2)',
        'mountain': '0 12px 40px rgba(74, 144, 226, 0.15)',
        'glow': '0 0 40px rgba(255, 107, 53, 0.3)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      transitionDuration: {
        // Premium motion timing
        '1500': '1500ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        // Custom easing functions
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'overshoot': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'emphasized': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};