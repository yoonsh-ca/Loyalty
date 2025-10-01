/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' },
    },
    extend: {
      colors: {
        brand: 'var(--brand-pink)',
        'muted-fg': 'var(--muted-fg)',
        card: '#ffffff',
        border: '#e6eaf0',
        bg: '#FAFAFC',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
      },
      borderRadius: { xl: '12px', '2xl': '16px' },
      boxShadow: { card: '0 6px 20px rgba(0,0,0,0.06)' },
    },
  },
  plugins: [],
};
