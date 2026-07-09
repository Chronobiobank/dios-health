export type TechnologyLayerIconId = 'passive-signals' | 'proxy-phase' | 'tiptraq-validate' | 'dose-cues'

type TechnologyLayerIconProps = {
  id: TechnologyLayerIconId
}

/**
 * Technology stack icons — 32×32 geometric line art.
 * Sized large in CSS; strokes stay optically even at display size.
 */
export function TechnologyLayerIcon({ id }: TechnologyLayerIconProps) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false as const,
  }

  switch (id) {
    case 'passive-signals':
      /* Phone + soft signal arcs */
      return (
        <svg {...common}>
          <rect x="11" y="4" width="10" height="24" rx="2.5" />
          <path d="M14 24.5h4" />
          <path d="M7 11.5c2.2-1.6 4.8-1.6 7 0" opacity="0.55" />
          <path d="M5.5 15c3.2-2.2 7.3-2.2 10.5 0" opacity="0.35" />
          <path d="M25 11.5c-2.2-1.6-4.8-1.6-7 0" opacity="0.55" />
          <path d="M26.5 15c-3.2-2.2-7.3-2.2-10.5 0" opacity="0.35" />
        </svg>
      )
    case 'proxy-phase':
      /* Clock face + phase crescent */
      return (
        <svg {...common}>
          <circle cx="15" cy="16" r="9.5" />
          <path d="M15 10.5v6l4 2.25" />
          <path
            d="M24.5 9.5c-1.1 2.4-1 5.2.4 7.5 1.8-.9 3.1-2.7 3.1-4.9 0-1.4-.5-2.7-1.4-3.7-.7.5-1.4.8-2.1 1.1z"
            fill="currentColor"
            stroke="none"
            opacity="0.9"
          />
        </svg>
      )
    case 'tiptraq-validate':
      /* Wearable band + check */
      return (
        <svg {...common}>
          <rect x="6" y="11" width="20" height="10" rx="5" />
          <path d="M11 16h4.5" opacity="0.45" />
          <path d="M18.25 14.25 20.5 16.5 24 13" />
        </svg>
      )
    case 'dose-cues':
      /* Six cue nodes on two quiet rails */
      return (
        <svg {...common}>
          <path d="M6 12h20" opacity="0.28" />
          <path d="M8 20h16" opacity="0.28" />
          <circle cx="8" cy="12" r="2.15" fill="currentColor" stroke="none" />
          <circle cx="16" cy="12" r="2.15" fill="currentColor" stroke="none" />
          <circle cx="24" cy="12" r="2.15" fill="currentColor" stroke="none" />
          <circle cx="10" cy="20" r="2.15" fill="currentColor" stroke="none" opacity="0.72" />
          <circle cx="16" cy="20" r="2.15" fill="currentColor" stroke="none" opacity="0.72" />
          <circle cx="22" cy="20" r="2.15" fill="currentColor" stroke="none" opacity="0.72" />
        </svg>
      )
  }
}
