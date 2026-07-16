/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
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
