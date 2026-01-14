import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#FAF8FF',
          100: '#F3EFFF',
          200: '#E6DBFF',
          300: '#D4C2FF',
          400: '#C1A3FF',
          500: '#A87EFF',
          600: '#8F5CFF',
          700: '#7640E0',
        },
        mint: {
          50: '#F0FFF9',
          100: '#DBFFF0',
          200: '#B8FFE3',
          300: '#8FFFD4',
          400: '#5EFFC4',
          500: '#2DFFB3',
          600: '#00E699',
          700: '#00846A',
        },
        peach: {
          50: '#FFF8F5',
          100: '#FFE9DC',
          200: '#FFD4C2',
          300: '#FFBDA3',
          400: '#FFA684',
          500: '#FF8E64',
          600: '#CC5500',
        },
        rose: {
          50: '#FFF5F7',
          100: '#FFE3E9',
          200: '#FFC9D6',
          300: '#FFADC2',
          400: '#FF8FAC',
          500: '#FF6B96',
          600: '#CC1155',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          500: '#737373',
          700: '#404040',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'sans-serif'],
        display: ['var(--font-cal-sans)', 'var(--font-inter)', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      backgroundImage: {
        'pookie-gradient': 'linear-gradient(135deg, #FAF8FF 0%, #F0FFF9 50%, #FFF8F5 100%)',
        'glass-overlay': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'btn-primary-gradient': 'linear-gradient(90deg, #A87EFF 0%, #2DFFB3 100%)',
        'priority-high-gradient': 'linear-gradient(90deg, #FF6B96 0%, #FFA684 100%)',
        'priority-medium-gradient': 'linear-gradient(90deg, #FFBDA3 0%, #FFD4C2 100%)',
        'priority-low-gradient': 'linear-gradient(90deg, #8FFFD4 0%, #DBFFF0 100%)',
      },
      boxShadow: {
        'lavender': '0 4px 12px rgba(168, 126, 255, 0.3)',
        'mint': '0 4px 12px rgba(45, 255, 179, 0.3)',
        'peach': '0 4px 12px rgba(255, 189, 163, 0.3)',
        'rose': '0 4px 12px rgba(255, 107, 150, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
