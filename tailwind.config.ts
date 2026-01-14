import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pookie: {
          lavender: '#E6D9F5',
          'lavender-light': '#F3ECFC',
          'lavender-dark': '#D4C4EA',
          mint: '#D5F5E8',
          peach: '#FFE5D9',
          sky: '#D9EBFF',
          rose: '#FFD9E8',
          lemon: '#FFF9D9',
          white: '#FEFEFE',
          cream: '#FAF8F5',
          'gray-light': '#F0EEF0',
          'gray-mid': '#C8C5CC',
          'gray-dark': '#8B8793',
          charcoal: '#4A4555',
        },
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 2px 4px rgba(74, 69, 85, 0.04), 0 1px 2px rgba(74, 69, 85, 0.02)',
        md: '0 4px 8px rgba(74, 69, 85, 0.06), 0 2px 4px rgba(74, 69, 85, 0.03)',
        lg: '0 8px 16px rgba(74, 69, 85, 0.08), 0 4px 8px rgba(74, 69, 85, 0.04)',
        xl: '0 16px 32px rgba(74, 69, 85, 0.1), 0 8px 16px rgba(74, 69, 85, 0.05)',
        inner: 'inset 0 2px 4px rgba(74, 69, 85, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
