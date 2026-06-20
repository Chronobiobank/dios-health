import type { ZeitgeberId } from '@/lib/chronobiology/zeitgebers'

/**
 * Shared dose-ecosystem visuals so the About page and the patient dose dash
 * use the same six circadian shades, positions, and line icons.
 *
 * Order/colours run dawn (white) → night (dark lilac).
 */
export const DOSE_TIMING: Record<
  ZeitgeberId,
  { pct: number; label: string; color: string }
> = {
  light: { pct: 6, label: 'Dawn', color: '#eef4f8' },
  meals: { pct: 22, label: 'Morning', color: '#acd3de' },
  meds: { pct: 40, label: 'Midday', color: '#f4c19e' },
  exercise: { pct: 58, label: 'Afternoon', color: '#f2a3c0' },
  cognition: { pct: 76, label: 'Evening', color: '#c9b6f2' },
  sleep: { pct: 94, label: 'Night', color: '#8a76c6' },
}

/** Six-stop circadian spectrum used for timeline tracks. */
export const DOSE_SPECTRUM =
  'linear-gradient(90deg, #eef4f8 0%, #acd3de 20%, #f4c19e 40%, #f2a3c0 58%, #c9b6f2 78%, #8a76c6 100%)'

export function DoseIcon({ id, size = 26 }: { id: ZeitgeberId; size?: number }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (id) {
    case 'light':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <circle cx="12" cy="12" r="4" {...common} />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"
            {...common}
          />
        </svg>
      )
    case 'meals':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10" {...common} />
          <path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM16 12v9" {...common} />
        </svg>
      )
    case 'meds':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <rect x="3.5" y="8" width="17" height="8" rx="4" {...common} />
          <path d="M12 8v8" {...common} />
        </svg>
      )
    case 'exercise':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="M2.5 12h3l2.5-6 4 12 2.5-6h3" {...common} />
        </svg>
      )
    case 'cognition':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <g transform="translate(12 11.75) scale(1.4) translate(-12 -11.75)">
            <path
              d="M12 5.5a3 3 0 0 0-3 3 2.6 2.6 0 0 0-1 5 2.6 2.6 0 0 0 2 3.4 3 3 0 0 0 2 1.1M12 5.5a3 3 0 0 1 3 3 2.6 2.6 0 0 1 1 5 2.6 2.6 0 0 1-2 3.4 3 3 0 0 1-2 1.1M12 5.5V18"
              {...common}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )
    case 'sleep':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5z" {...common} />
        </svg>
      )
  }
}
