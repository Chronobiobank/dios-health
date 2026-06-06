import type { Config } from 'tailwindcss'

/**
 * Calm UI design system — DIOS platform tokens.
 * Referenced from app/globals.css via @config.
 */
const config: Config = {
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
        /** Retinomic pillars — muted clinical accents (Calm UI anchors) */
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
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
}

export default config
