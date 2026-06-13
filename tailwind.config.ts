import type { Config } from 'tailwindcss'

/**
 * Calm UI design system — DIOS platform tokens.
 * Referenced from app/globals.css via @config.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        dios: {
          ink: '#1A0D17',
          aubergine: '#3B1F35',
          'aubergine-mid': '#5C3050',
          'aubergine-light': '#E8D5E2',
          'aubergine-very-dark': '#1A0D17',
          gold: '#C9973A',
          lilac: '#C9B8E8',
          'lilac-light': '#EDE8F7',
          'lilac-bright': '#D891EF',
          spot: '#D891EF',
          cream: '#FAFAF7',
          border: '#E8D5E2',
          muted: 'rgb(26 13 23 / 0.52)',
        },
        calm: {
          bg: '#1A0D17',
          surface: '#3B1F35',
          brand: '#C9973A',
          risk: '#5C3050',
          optimal: '#ED8936',
          critical: '#D53F8C',
        },
        photic: {
          core: '#38bdf8',
          muted: '#0369a1',
          deep: '#0c4a6e',
        },
        fuel: {
          core: '#f59e0b',
          muted: '#b45309',
          deep: '#451a03',
        },
        telemetry: {
          core: '#818cf8',
          muted: '#4338ca',
          deep: '#312e81',
        },
        status: {
          red: '#C53030',
          'red-bg': '#FFF5F5',
          'red-border': '#FEB2B2',
          amber: '#B7791F',
          'amber-bg': '#FFFBEB',
          'amber-border': '#FBD38D',
          green: '#276749',
          'green-bg': '#F0FFF4',
          'green-border': '#9AE6B4',
          blue: '#2C5282',
          'blue-bg': '#EBF8FF',
          'blue-border': '#BEE3F8',
        },
        teal: {
          DEFAULT: '#1D9E75',
          light: '#E6FAF5',
          dark: '#0F6B50',
        },
      },
      backdropBlur: {
        md: '12px',
        lg: '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
        card: 'var(--calm-radius-card, 8px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ui: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        display: ['var(--font-merriweather)', 'Georgia', 'serif'],
        'display-sans': ['var(--font-bureau-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'data-lg': ['1.25rem', { lineHeight: '1.15', fontWeight: '500' }],
        'data-md': ['1.0625rem', { lineHeight: '1.25', fontWeight: '500' }],
        'data-sm': ['0.9375rem', { lineHeight: '1.45', fontWeight: '400' }],
        'data-xs': ['0.8125rem', { lineHeight: '1.45', fontWeight: '400' }],
        'ui-h1': ['1.125rem', { lineHeight: '1.25', fontWeight: '600' }],
        'ui-h2': ['1.0625rem', { lineHeight: '1.3', fontWeight: '500' }],
        'ui-h3': ['1rem', { lineHeight: '1.35', fontWeight: '500' }],
        'ui-body': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'ui-sm': ['0.9375rem', { lineHeight: '1.55', fontWeight: '400' }],
        'ui-label': ['0.8125rem', { lineHeight: '1.45', fontWeight: '500', letterSpacing: '0.06em' }],
      },
    },
  },
  plugins: [],
}

export default config
