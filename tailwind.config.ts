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
        calm: {
          bg: '#080808',
          surface: '#0f0f0f',
          brand: '#C9973A',
          risk: '#1A365D',
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
