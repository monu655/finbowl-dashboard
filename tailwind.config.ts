import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6C4FEB',
          'purple-dark': '#5A3FD6',
          'purple-light': '#F2EEFD',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F8FB',
          sidebar: '#181124',
        },
        border: {
          DEFAULT: '#E7E5EF',
          strong: '#D6D3E3',
        },
        text: {
          primary: '#1E1B2E',
          secondary: '#6B6980',
          muted: '#9C99AD',
        },
        status: {
          draft: { bg: '#F1F0F5', fg: '#6B6980' },
          submitted: { bg: '#E9F7EF', fg: '#1E9E5A' },
          verified: { bg: '#EAF1FF', fg: '#3E7BFA' },
          processed: { bg: '#FFF4E5', fg: '#D97A00' },
          audited: { bg: '#F2EEFD', fg: '#6C4FEB' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['12.5px', '18px'],
        base: ['13.5px', '20px'],
        lg: ['16px', '22px'],
        xl: ['20px', '26px'],
        '2xl': ['24px', '30px'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 16, 40, 0.04), 0 1px 8px rgba(20, 16, 40, 0.04)',
        popover: '0 8px 24px rgba(20, 16, 40, 0.14)',
        drawer: '-8px 0 24px rgba(20, 16, 40, 0.10)',
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
      },
    },
  },
  plugins: [],
} satisfies Config
