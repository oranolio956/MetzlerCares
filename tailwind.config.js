/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Recovery Palette - Healthcare & Wellness Colors
        'primary-main': '#2E5C55', // Deep Forest Green: Growth, stability, renewal
        'primary-light': '#5C8A82', // Sage: Softer interactions
        'secondary-main': '#4A6FA5', // Slate Blue: Trust, calm, logic
        'surface-bg': '#F8F9FA', // Vapor White: Reduces glare
        'surface-card': '#FFFFFF', // Pure White: Elevated surfaces
        'status-success': '#10B981', // Vibrant Green: Verified, safe
        'text-body': '#1F2937', // Charcoal: Reduces eye strain
        'text-muted': '#6B7280', // Cool Grey: Hierarchy
        'warmth': '#B8956A', // Muted Gold/Terra Cotta for donate CTA
        'vapor-white': '#F8F9FA',
        // Legacy colors maintained for backward compatibility
        'forest-green': '#2E5C55',
        'sunset-orange': '#FF6B35',
        'mountain-blue': '#4A6FA5',
        'warm-gray': '#F5F4F2',
        'sage-green': '#5C8A82',
        terracotta: '#B8956A',
        'sky-blue': '#87CEEB',
        cream: '#FAF8F5',
        charcoal: '#1F2937',
        error: '#DC2626'
      },
      fontSize: {
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }]
      },
      spacing: {
        // Premium spacing scale based on 4px grid
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem'
      },
      borderRadius: {
        // Extended radius system
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      animation: {
        // Premium animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
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
        forest: '0 4px 20px rgba(45, 80, 22, 0.15)',
        sunset: '0 8px 32px rgba(255, 107, 53, 0.2)',
        mountain: '0 12px 40px rgba(74, 144, 226, 0.15)',
        glow: '0 0 40px rgba(255, 107, 53, 0.3)',
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      transitionDuration: {
        // Premium motion timing
        1500: '1500ms',
        2000: '2000ms',
        2500: '2500ms',
        3000: '3000ms'
      },
      transitionTimingFunction: {
        // Custom easing functions
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        overshoot: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        emphasized: 'cubic-bezier(0.4, 0, 0.2, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')]
}
