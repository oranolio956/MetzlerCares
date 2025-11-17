/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Metzler Foundations Brand Colors - "Grounded Hope"
        cream: '#F5F5DC', // Primary background - warm, inviting, established
        navy: '#192A56', // Primary text - trust, professionalism, calm
        olive: '#556B2F', // Secondary "growth" - renewal, hope, earthy
        gold: '#8B6914' // Primary "action" - compassion, quality, optimism (darkened for WCAG AA)
      },
      fontFamily: {
        // "Modern Authority" Typography System
        sans: ['Inter', 'system-ui', 'sans-serif'], // Headlines & UI - modern, legible
        serif: ['Lora', 'Georgia', 'serif'] // Body & Storytelling - authority, trust
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography') // For rich text content styling
  ]
}
