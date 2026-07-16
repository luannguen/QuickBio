/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          coral: '#FF8A5B',
          dark: '#0B0F19',
          card: '#161F30',
          light: '#F8F9FA',
          green: '#7CB342', // Green Commerce cho Desktop
        },
        semantic: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          muted: '#6B7280',
        },
        background: '#080B11',
        foreground: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
