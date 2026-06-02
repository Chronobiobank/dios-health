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
